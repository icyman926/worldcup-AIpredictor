import { IntegratedPredictor } from '../../../lib/predictor';
import { applyLiveMatchContext } from '../../../lib/live-model';
import { findCompletedMatch } from '../../../lib/match-status';

const SITE_LOCALE = process.env.NEXT_PUBLIC_SITE_LOCALE || '';

function isChinaLocale() {
  return /^zh/i.test(SITE_LOCALE);
}

function contextNotesForDisplay(contexts, synthesis) {
  const list = Array.isArray(contexts) ? contexts : [];
  const connected = list.length
    ? list.map((item) => item.provider + (item.model ? ' / ' + item.model : '')).join(', ')
    : (isChinaLocale() ? '暂无成功返回的数据源' : 'No successful data sources');
  const qwen = list.find((item) => item.provider === 'qwen');
  const qwenEvidence = qwen && /evidence-synthesis/i.test(String(qwen.model || ''));

  if (isChinaLocale()) {
    const qwenStatus = qwenEvidence
      ? '千问证据综合已参与：已读取其它成功数据源，并整理伤病、战术、更衣室、资本政治、盘口和赛程等维度。'
      : '千问证据综合未参与或未成功返回；本次只使用其它成功数据源。';
    return [
      '已接入并成功返回的数据源：' + connected + '。模型先以 Elo 强度和 Poisson 进球分布作为基础概率，再叠加盘口、赛程、新闻与 AI 上下文的平均修正。' + qwenStatus + ' 下方“最终综合推理”和“已使用的实时证据”展示具体参考因素。'
    ];
  }

  return [
    'Connected sources: ' + connected + '. The model starts from Elo and Poisson, then applies average adjustments from odds, fixtures, news, and AI context. Detailed evidence appears in the final synthesis section.'
  ];
}

function aggregationLabel() {
  return isChinaLocale() ? '成功数据源的平均上下文修正' : 'Average of successful live model contexts';
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function averageExternalContext(contexts) {
  if (!Array.isArray(contexts) || contexts.length === 0) {
    return { home: 0, draw: 0, away: 0, confidence: 0 };
  }

  const total = contexts.reduce((acc, item) => ({
    home: acc.home + (Number(item.home_adjustment) || 0),
    draw: acc.draw + (Number(item.draw_adjustment) || 0),
    away: acc.away + (Number(item.away_adjustment) || 0),
    confidence: acc.confidence + (Number(item.confidence_delta) || 0),
  }), { home: 0, draw: 0, away: 0, confidence: 0 });

  return {
    home: total.home / contexts.length,
    draw: total.draw / contexts.length,
    away: total.away / contexts.length,
    confidence: total.confidence / contexts.length,
  };
}

function applyExternalContext(result, contexts, meta = {}) {
  const baseProbabilities = { ...result.probabilities };
  const attempted = Array.isArray(meta.attempted) ? meta.attempted : [];
  const failed = Array.isArray(meta.failed) ? meta.failed : [];
  const synthesis = meta.synthesis || null;

  if (!Array.isArray(contexts) || contexts.length === 0) {
    return {
      ...result,
      external_context: {
        base_probabilities: baseProbabilities,
        connected: [],
        attempted,
        failed,
        applied: false,
        aggregation: isChinaLocale() ? '未应用实时模型上下文' : 'No live model context applied',

        notes: contextNotesForDisplay([], synthesis),
        adjustments: { home: 0, draw: 0, away: 0 },
        synthesis,
      },
    };
  }

  const average = averageExternalContext(contexts);

  let home = Math.max(1, result.probabilities.home + average.home * 100);
  let draw = Math.max(1, result.probabilities.draw + average.draw * 100);
  let away = Math.max(1, result.probabilities.away + average.away * 100);
  const sum = home + draw + away;

  home = (home / sum) * 100;
  draw = (draw / sum) * 100;
  away = (away / sum) * 100;

  return {
    ...result,
    probabilities: {
      home: Math.round(home * 100) / 100,
      draw: Math.round(draw * 100) / 100,
      away: Math.round(away * 100) / 100,
    },
    confidence: Math.round(clamp(result.confidence + average.confidence, 1, 95) * 100) / 100,
    external_context: {
      base_probabilities: baseProbabilities,
      connected: contexts.map((item) => item.provider),
      attempted: attempted.length ? attempted : contexts.map((item) => item.provider),
      failed,
      applied: true,
      aggregation: aggregationLabel(),

      notes: contextNotesForDisplay(contexts, synthesis),
      adjustments: {
        home: Math.round(average.home * 10000) / 100,
        draw: Math.round(average.draw * 10000) / 100,
        away: Math.round(average.away * 10000) / 100,
      },
      synthesis,
    },
  };
}

export default function handler(req, res) {
  res.setHeader?.('Content-Type', 'application/json; charset=utf-8');
  res.setHeader?.('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  try {
    const {
      home_team,
      away_team,
      venue,
      home_odds,
      draw_odds,
      away_odds,
      external_context,
      external_context_meta,
      live_state,
      match_id,
    } = req.body || {};

    if (!home_team || !away_team) {
      res.status(400).json({ error: 'Both home_team and away_team are required' });
      return;
    }

    const completedMatch = findCompletedMatch({ matchId: match_id, homeTeamName: home_team, awayTeamName: away_team });
    if (completedMatch) {
      res.status(409).json({
        error: isChinaLocale() ? '比赛已完赛，显示最终比分，不再生成预测。' : 'Match completed. Final score is shown instead of a forecast.',
        completed_match: completedMatch,
      });
      return;
    }

    const predictor = new IntegratedPredictor();
    const baseResult = predictor.predictMatch(
      home_team,
      away_team,
      home_odds || null,
      draw_odds || null,
      away_odds || null,
      venue || 'neutral',
      1.5,
      1.3,
      0.8,
      0.9
    );

    const contextResult = applyExternalContext(baseResult, external_context, external_context_meta);
    const liveResult = live_state?.enabled
      ? applyLiveMatchContext(contextResult, live_state, { homeTeam: home_team, awayTeam: away_team })
      : contextResult;

    res.status(200).json(liveResult);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
