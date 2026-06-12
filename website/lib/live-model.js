import { getTeamByName } from './predictor';

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, Number(value) || 0));
}

function normalizeTriple(home, draw, away) {
  const safe = [home, draw, away].map((value) => Math.max(0.5, Number(value) || 0.5));
  const sum = safe[0] + safe[1] + safe[2];
  return {
    home: Math.round((safe[0] / sum) * 10000) / 100,
    draw: Math.round((safe[1] / sum) * 10000) / 100,
    away: Math.round((safe[2] / sum) * 10000) / 100,
  };
}

function oddsToNoVig(odds) {
  const home = Number(odds?.home);
  const draw = Number(odds?.draw);
  const away = Number(odds?.away);
  if (!(home > 1) || !(draw > 1) || !(away > 1)) return null;
  const rawHome = 1 / home;
  const rawDraw = 1 / draw;
  const rawAway = 1 / away;
  const total = rawHome + rawDraw + rawAway;
  return {
    home: (rawHome / total) * 100,
    draw: (rawDraw / total) * 100,
    away: (rawAway / total) * 100,
  };
}

function formatPct(value) {
  const rounded = Math.round(Number(value || 0) * 100) / 100;
  return (rounded > 0 ? '+' : '') + rounded + '%';
}

function scorePressure({ homeScore, awayScore, minute, homeElo, awayElo }) {
  const diff = homeScore - awayScore;
  const remainingShare = clamp((96 - minute) / 96, 0, 1);
  const elapsedShare = 1 - remainingShare;
  const eloGap = clamp((homeElo - awayElo) / 400, -1.25, 1.25);

  let home = 0;
  let draw = 0;
  let away = 0;

  if (diff > 0) {
    const protectLead = Math.min(34, diff * (12 + elapsedShare * 18));
    home += protectLead;
    draw -= protectLead * 0.42;
    away -= protectLead * 0.58;
    if (eloGap < -0.15) {
      const favoriteChase = Math.abs(eloGap) * remainingShare * 11;
      away += favoriteChase;
      home -= favoriteChase * 0.7;
      draw -= favoriteChase * 0.3;
    }
  } else if (diff < 0) {
    const protectLead = Math.min(34, Math.abs(diff) * (12 + elapsedShare * 18));
    away += protectLead;
    draw -= protectLead * 0.42;
    home -= protectLead * 0.58;
    if (eloGap > 0.15) {
      const favoriteChase = eloGap * remainingShare * 11;
      home += favoriteChase;
      away -= favoriteChase * 0.7;
      draw -= favoriteChase * 0.3;
    }
  } else if (minute >= 65) {
    draw += Math.min(10, (minute - 64) * 0.32);
    home -= Math.min(5, (minute - 64) * 0.16);
    away -= Math.min(5, (minute - 64) * 0.16);
  }

  return { home, draw, away };
}

function cardPressure({ homeRedCards, awayRedCards, minute }) {
  const redDiff = clamp(awayRedCards, 0, 5) - clamp(homeRedCards, 0, 5);
  const remainingShare = clamp((96 - minute) / 96, 0.08, 1);
  const shift = redDiff * 9 * remainingShare;
  return {
    home: shift,
    draw: -Math.abs(shift) * 0.22,
    away: -shift,
  };
}

function nextGoalModel({ base, live, homeScore, awayScore, minute, homeElo, awayElo, homeRedCards, awayRedCards }) {
  const remainingShare = clamp((96 - minute) / 96, 0, 1);
  const urgencyHome = homeScore < awayScore ? 0.13 : homeScore === awayScore ? 0.04 : -0.04;
  const urgencyAway = awayScore < homeScore ? 0.13 : homeScore === awayScore ? 0.04 : -0.04;
  const strengthHome = clamp((homeElo - awayElo) / 700, -0.18, 0.18);
  const redSwing = (clamp(awayRedCards, 0, 5) - clamp(homeRedCards, 0, 5)) * 0.1;

  let home = 0.38 + strengthHome + urgencyHome + redSwing + (live.home - base.home) / 450;
  let away = 0.38 - strengthHome + urgencyAway - redSwing + (live.away - base.away) / 450;
  let noGoal = 0.24 + (1 - remainingShare) * 0.35;
  if (minute < 15) noGoal -= 0.06;
  if (minute > 80) noGoal += 0.12;

  const total = home + away + noGoal;
  return {
    home: Math.round((home / total) * 10000) / 100,
    away: Math.round((away / total) * 10000) / 100,
    noGoal: Math.round((noGoal / total) * 10000) / 100,
  };
}

export function applyLiveMatchContext(baseResult, liveState = {}, teams = {}) {
  if (!liveState || !liveState.enabled) return baseResult;

  const minute = clamp(liveState.minute, 0, 130);
  const homeScore = clamp(liveState.homeScore, 0, 20);
  const awayScore = clamp(liveState.awayScore, 0, 20);
  const homeRedCards = clamp(liveState.homeRedCards, 0, 5);
  const awayRedCards = clamp(liveState.awayRedCards, 0, 5);
  const homeTeam = teams.homeTeam || baseResult.home_team;
  const awayTeam = teams.awayTeam || baseResult.away_team;
  const homeData = getTeamByName(homeTeam) || { elo: 1500 };
  const awayData = getTeamByName(awayTeam) || { elo: 1500 };
  const base = { ...baseResult.probabilities };

  const score = scorePressure({ homeScore, awayScore, minute, homeElo: homeData.elo, awayElo: awayData.elo });
  const cards = cardPressure({ homeRedCards, awayRedCards, minute });

  let modelHome = base.home + score.home + cards.home;
  let modelDraw = base.draw + score.draw + cards.draw;
  let modelAway = base.away + score.away + cards.away;
  let model = normalizeTriple(modelHome, modelDraw, modelAway);

  const market = oddsToNoVig(liveState.liveOdds);
  let live = model;
  let marketWeight = 0;
  if (market) {
    marketWeight = minute >= 75 ? 0.45 : minute >= 45 ? 0.38 : 0.30;
    live = normalizeTriple(
      model.home * (1 - marketWeight) + market.home * marketWeight,
      model.draw * (1 - marketWeight) + market.draw * marketWeight,
      model.away * (1 - marketWeight) + market.away * marketWeight
    );
  }

  const trailing = homeScore < awayScore ? homeTeam : awayScore < homeScore ? awayTeam : null;
  const comebackProbability = trailing === homeTeam
    ? Math.round((live.home + live.draw) * 100) / 100
    : trailing === awayTeam
      ? Math.round((live.away + live.draw) * 100) / 100
      : null;
  const nextGoal = nextGoalModel({
    base,
    live,
    homeScore,
    awayScore,
    minute,
    homeElo: homeData.elo,
    awayElo: awayData.elo,
    homeRedCards,
    awayRedCards,
  });

  const notes = [
    'Live layer recalibrates the pre-match forecast using current minute, scoreline, red cards, team-strength gap, and optional in-play odds.',
    'Score/minute adjustment: Home ' + formatPct(score.home) + ', Draw ' + formatPct(score.draw) + ', Away ' + formatPct(score.away) + '.',
    'Red-card adjustment: Home ' + formatPct(cards.home) + ', Draw ' + formatPct(cards.draw) + ', Away ' + formatPct(cards.away) + '.',
    market ? 'In-play odds are blended as a live market signal with ' + Math.round(marketWeight * 100) + '% weight.' : 'No in-play odds supplied, so the live market layer is neutral.',
    trailing ? trailing + ' comeback-to-avoid-defeat probability is ' + comebackProbability + '%.' : 'Match is level, so comeback pressure is neutral and next-goal pressure matters more.',
  ];

  return {
    ...baseResult,
    probabilities: live,
    confidence: Math.round(Math.min(95, Math.max(1, (baseResult.confidence || 70) + (market ? 3 : 0) + Math.min(4, minute / 30))) * 100) / 100,
    live_context: {
      applied: true,
      mode: liveState.source || 'manual-live-mvp',
      minute,
      score: { home: homeScore, away: awayScore },
      red_cards: { home: homeRedCards, away: awayRedCards },
      base_probabilities: base,
      model_probabilities: model,
      market_probabilities: market ? normalizeTriple(market.home, market.draw, market.away) : null,
      final_probabilities: live,
      adjustments: {
        score_minute: {
          home: Math.round(score.home * 100) / 100,
          draw: Math.round(score.draw * 100) / 100,
          away: Math.round(score.away * 100) / 100,
        },
        red_cards: {
          home: Math.round(cards.home * 100) / 100,
          draw: Math.round(cards.draw * 100) / 100,
          away: Math.round(cards.away * 100) / 100,
        },
        market_weight: marketWeight,
      },
      next_goal: nextGoal,
      comeback_probability: comebackProbability,
      trailing_team: trailing,
      notes,
      disclaimer: 'Live in-play analytics only. Not betting advice and not a guarantee of match outcomes.',
    },
  };
}
