function normalizeName(name) {
  return String(name || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function namesMatch(a, b) {
  const left = normalizeName(a);
  const right = normalizeName(b);
  return Boolean(left && right && (left === right || left.includes(right) || right.includes(left)));
}

async function fetchJson(url, options = {}, timeoutMs = 12000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    const text = await response.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch (_) {}
    if (!response.ok) {
      throw new Error('HTTP ' + response.status + ': ' + text.slice(0, 180));
    }
    return data;
  } finally {
    clearTimeout(timer);
  }
}

function emptySnapshot(provider, message) {
  return { provider, found: false, message };
}

function fixtureTeams(row) {
  return {
    home: row?.teams?.home?.name || row?.homeTeam?.name || row?.participants?.find?.((p) => p?.meta?.location === 'home')?.name || '',
    away: row?.teams?.away?.name || row?.awayTeam?.name || row?.participants?.find?.((p) => p?.meta?.location === 'away')?.name || '',
  };
}

function matchFixture(row, homeTeam, awayTeam) {
  const teams = fixtureTeams(row);
  return (namesMatch(teams.home, homeTeam) && namesMatch(teams.away, awayTeam))
    || (namesMatch(teams.home, awayTeam) && namesMatch(teams.away, homeTeam));
}

function collectRedCardsFromEvents(events = [], teams = {}) {
  const cards = { home: 0, away: 0 };
  for (const event of events || []) {
    const type = String(event?.type || event?.detail || event?.var_result || event?.addition || '').toLowerCase();
    if (!type.includes('red')) continue;
    const teamName = event?.team?.name || event?.participant_name || event?.team_name || '';
    if (namesMatch(teamName, teams.home)) cards.home += 1;
    if (namesMatch(teamName, teams.away)) cards.away += 1;
  }
  return cards;
}

function scoreFromSportmonks(row) {
  const scores = Array.isArray(row?.scores) ? row.scores : [];
  const current = scores.find((item) => String(item?.description || '').toLowerCase().includes('current'))
    || scores.find((item) => item?.score?.goals !== undefined)
    || null;
  if (!current) return { home: 0, away: 0 };
  const goals = current.score || {};
  return {
    home: Number(goals.home ?? goals.localteam_score ?? goals.participant_home_score ?? 0) || 0,
    away: Number(goals.away ?? goals.visitorteam_score ?? goals.participant_away_score ?? 0) || 0,
  };
}

export async function getApiFootballLiveSnapshot(apiKey, homeTeam, awayTeam) {
  if (!apiKey) return emptySnapshot('apiFootball', 'API-Football key not configured.');
  const data = await fetchJson('https://v3.football.api-sports.io/fixtures?live=all', {
    headers: { 'x-apisports-key': apiKey },
  });
  const rows = Array.isArray(data?.response) ? data.response : [];
  const row = rows.find((fixture) => matchFixture(fixture, homeTeam, awayTeam));
  if (!row) return emptySnapshot('apiFootball', 'No live API-Football fixture matched this team pair.');

  const teams = fixtureTeams(row);
  let redCards = collectRedCardsFromEvents(row.events || [], teams);
  if (row.fixture?.id) {
    try {
      const events = await fetchJson('https://v3.football.api-sports.io/fixtures/events?fixture=' + row.fixture.id, {
        headers: { 'x-apisports-key': apiKey },
      }, 9000);
      redCards = collectRedCardsFromEvents(events?.response || [], teams);
    } catch (_) {}
  }

  return {
    provider: 'apiFootball',
    found: true,
    source: 'API-Football live fixtures',
    minute: Number(row.fixture?.status?.elapsed ?? 0) || 0,
    homeScore: Number(row.goals?.home ?? 0) || 0,
    awayScore: Number(row.goals?.away ?? 0) || 0,
    homeRedCards: redCards.home,
    awayRedCards: redCards.away,
    status: row.fixture?.status?.long || row.fixture?.status?.short || 'live',
    teams,
  };
}

export async function getFootballDataLiveSnapshot(apiKey, homeTeam, awayTeam) {
  if (!apiKey) return emptySnapshot('footballData', 'Football-Data key not configured.');
  const data = await fetchJson('https://api.football-data.org/v4/matches?status=LIVE', {
    headers: { 'X-Auth-Token': apiKey },
  });
  const rows = Array.isArray(data?.matches) ? data.matches : [];
  const row = rows.find((fixture) => matchFixture(fixture, homeTeam, awayTeam));
  if (!row) return emptySnapshot('footballData', 'No live Football-Data fixture matched this team pair.');
  const ft = row.score?.fullTime || row.score?.regularTime || {};
  return {
    provider: 'footballData',
    found: true,
    source: 'Football-Data live matches',
    minute: 0,
    homeScore: Number(ft.home ?? 0) || 0,
    awayScore: Number(ft.away ?? 0) || 0,
    homeRedCards: 0,
    awayRedCards: 0,
    status: row.status || 'LIVE',
    teams: fixtureTeams(row),
  };
}

export async function getSportmonksLiveSnapshot(apiKey, homeTeam, awayTeam) {
  if (!apiKey) return emptySnapshot('sportmonks', 'Sportmonks key not configured.');
  const url = 'https://api.sportmonks.com/v3/football/livescores?api_token=' + encodeURIComponent(apiKey) + '&include=participants;scores;events';
  const data = await fetchJson(url);
  const rows = Array.isArray(data?.data) ? data.data : [];
  const row = rows.find((fixture) => matchFixture(fixture, homeTeam, awayTeam));
  if (!row) return emptySnapshot('sportmonks', 'No live Sportmonks fixture matched this team pair.');
  const teams = fixtureTeams(row);
  const score = scoreFromSportmonks(row);
  const redCards = collectRedCardsFromEvents(row.events || [], teams);
  return {
    provider: 'sportmonks',
    found: true,
    source: 'Sportmonks livescores',
    minute: Number(row?.state?.minute ?? row?.periods?.find?.((p) => p?.type_id)?.minutes ?? 0) || 0,
    homeScore: score.home,
    awayScore: score.away,
    homeRedCards: redCards.home,
    awayRedCards: redCards.away,
    status: row?.state?.name || row?.state?.short_name || 'live',
    teams,
  };
}

function noVigFromBookmakers(bookmakers, homeTeam, awayTeam) {
  const bookmaker = (bookmakers || []).find((book) => Array.isArray(book?.markets) && book.markets.some((market) => market.key === 'h2h'));
  const market = bookmaker?.markets?.find((item) => item.key === 'h2h');
  if (!market) return null;
  const outcomes = market.outcomes || [];
  const home = outcomes.find((item) => namesMatch(item.name, homeTeam));
  const away = outcomes.find((item) => namesMatch(item.name, awayTeam));
  const draw = outcomes.find((item) => /draw/i.test(item.name));
  if (!(home?.price > 1) || !(draw?.price > 1) || !(away?.price > 1)) return null;
  return {
    home: Number(home.price),
    draw: Number(draw.price),
    away: Number(away.price),
    bookmaker: bookmaker.title || bookmaker.key || 'bookmaker',
  };
}

export async function getOddsApiLiveSnapshot(apiKey, homeTeam, awayTeam) {
  if (!apiKey) return emptySnapshot('oddsApi', 'The Odds API key not configured.');
  const sports = ['soccer_fifa_world_cup', 'soccer_international_friendlies', 'soccer'];
  const errors = [];
  for (const sport of sports) {
    try {
      const url = 'https://api.the-odds-api.com/v4/sports/' + sport + '/odds/?apiKey=' + encodeURIComponent(apiKey) + '&regions=us,eu,uk&markets=h2h&oddsFormat=decimal';
      const data = await fetchJson(url, {}, 10000);
      const rows = Array.isArray(data) ? data : [];
      const row = rows.find((event) => (namesMatch(event.home_team, homeTeam) && namesMatch(event.away_team, awayTeam)) || (namesMatch(event.home_team, awayTeam) && namesMatch(event.away_team, homeTeam)));
      if (!row) continue;
      const odds = noVigFromBookmakers(row.bookmakers, homeTeam, awayTeam);
      if (!odds) continue;
      return {
        provider: 'oddsApi',
        found: true,
        source: 'The Odds API h2h market',
        liveOdds: odds,
        status: 'market available',
      };
    } catch (error) {
      errors.push(sport + ': ' + error.message);
    }
  }
  return emptySnapshot('oddsApi', errors.length ? errors.join(' | ') : 'No matching live odds market found.');
}

export async function getLiveSnapshot({ homeTeam, awayTeam, apiKeys = {} }) {
  const providers = [];
  const errors = [];
  const jobs = [
    ['apiFootball', () => getApiFootballLiveSnapshot(apiKeys.apiFootball, homeTeam, awayTeam)],
    ['footballData', () => getFootballDataLiveSnapshot(apiKeys.footballData, homeTeam, awayTeam)],
    ['sportmonks', () => getSportmonksLiveSnapshot(apiKeys.sportmonks, homeTeam, awayTeam)],
    ['oddsApi', () => getOddsApiLiveSnapshot(apiKeys.oddsApi, homeTeam, awayTeam)],
  ];

  const results = await Promise.all(jobs.map(async ([name, job]) => {
    try {
      const result = await job();
      providers.push({ provider: name, found: Boolean(result?.found), message: result?.message || result?.status || result?.source || '' });
      return result;
    } catch (error) {
      errors.push({ provider: name, error: error.message });
      providers.push({ provider: name, found: false, message: error.message });
      return emptySnapshot(name, error.message);
    }
  }));

  const score = results.find((item) => item?.found && item.minute !== undefined);
  const market = results.find((item) => item?.found && item.liveOdds);
  const found = Boolean(score || market);
  const liveState = found ? {
    enabled: Boolean(score),
    source: [score?.provider, market?.provider].filter(Boolean).join('+') || 'live-snapshot',
    minute: score?.minute ?? '',
    homeScore: score?.homeScore ?? 0,
    awayScore: score?.awayScore ?? 0,
    homeRedCards: score?.homeRedCards ?? 0,
    awayRedCards: score?.awayRedCards ?? 0,
    liveOdds: market?.liveOdds ? {
      home: market.liveOdds.home,
      draw: market.liveOdds.draw,
      away: market.liveOdds.away,
    } : {},
  } : null;

  return {
    found,
    live_state: liveState,
    score_provider: score || null,
    market_provider: market || null,
    providers,
    errors,
    checkedAt: new Date().toISOString(),
    nextPollSeconds: 120,
  };
}
