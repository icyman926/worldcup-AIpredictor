import { IntegratedPredictor } from '../../../lib/predictor';

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function applyExternalContext(result, contexts) {
  if (!Array.isArray(contexts) || contexts.length === 0) {
    return {
      ...result,
      external_context: {
        connected: [],
        applied: false,
        notes: ['No live AI/data context was supplied to this prediction.'],
      },
    };
  }

  const total = contexts.reduce((acc, item) => ({
    home: acc.home + (Number(item.home_adjustment) || 0),
    draw: acc.draw + (Number(item.draw_adjustment) || 0),
    away: acc.away + (Number(item.away_adjustment) || 0),
    confidence: acc.confidence + (Number(item.confidence_delta) || 0),
  }), { home: 0, draw: 0, away: 0, confidence: 0 });

  let home = Math.max(1, result.probabilities.home + total.home * 100);
  let draw = Math.max(1, result.probabilities.draw + total.draw * 100);
  let away = Math.max(1, result.probabilities.away + total.away * 100);
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
    confidence: Math.round(clamp(result.confidence + total.confidence, 1, 95) * 100) / 100,
    external_context: {
      connected: contexts.map((item) => item.provider),
      applied: true,
      notes: contexts.map((item) => item.summary || item.provider + ' context applied.'),
      adjustments: {
        home: Math.round(total.home * 10000) / 100,
        draw: Math.round(total.draw * 10000) / 100,
        away: Math.round(total.away * 10000) / 100,
      },
    },
  };
}

export default function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { home_team, away_team, venue, home_odds, draw_odds, away_odds, external_context } = req.body;

      if (!home_team || !away_team) {
        return res.status(400).json({ error: 'Both home_team and away_team are required' });
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

      res.status(200).json(applyExternalContext(baseResult, external_context));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
