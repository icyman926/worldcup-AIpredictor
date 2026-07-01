import fs from 'fs';
import path from 'path';
import { GROUP_STAGES, getTeamById } from './predictor';

const RESULT_PATH = path.join(process.cwd(), 'data', 'match-results.json');
const COMPLETED_STATUSES = new Set(['FINISHED', 'FINISHED_PENALTY', 'AWARDED', 'COMPLETED', 'FULL_TIME', 'FT']);

function isCompletedStatus(status) {
  return COMPLETED_STATUSES.has(String(status || '').toUpperCase());
}

function loadMatchResults() {
  try {
    const parsed = JSON.parse(fs.readFileSync(RESULT_PATH, 'utf8'));
    return {
      generatedAt: parsed.generatedAt || null,
      source: parsed.source || 'local',
      matches: parsed.matches && typeof parsed.matches === 'object' ? parsed.matches : {},
    };
  } catch (error) {
    return { generatedAt: null, source: 'empty', matches: {} };
  }
}

function allFixtures() {
  return GROUP_STAGES.flatMap((group) => group.matches.map((match) => ({
    ...match,
    group: group.group,
    homeTeam: getTeamById(match.team1)?.name || match.team1,
    awayTeam: getTeamById(match.team2)?.name || match.team2,
  })));
}

function normalizeName(name) {
  return String(name || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function findFixture({ matchId, homeTeamId, awayTeamId, homeTeamName, awayTeamName } = {}) {
  const fixtures = allFixtures();
  if (matchId) {
    const byId = fixtures.find((match) => match.id === matchId);
    if (byId) return byId;
  }
  if (homeTeamId && awayTeamId) {
    const byTeamId = fixtures.find((match) => (
      (match.team1 === homeTeamId && match.team2 === awayTeamId) ||
      (match.team1 === awayTeamId && match.team2 === homeTeamId)
    ));
    if (byTeamId) return byTeamId;
  }
  const home = normalizeName(homeTeamName);
  const away = normalizeName(awayTeamName);
  if (home && away) {
    return fixtures.find((match) => {
      const a = normalizeName(match.homeTeam);
      const b = normalizeName(match.awayTeam);
      return (a === home && b === away) || (a === away && b === home);
    }) || null;
  }
  return null;
}

function findMatchStatus(options = {}) {
  const fixture = findFixture(options);
  if (!fixture) return null;
  const data = loadMatchResults();
  const status = data.matches[fixture.id];
  return status ? { ...status, fixture } : null;
}

function findCompletedMatch(options = {}) {
  const status = findMatchStatus(options);
  if (!status) return null;
  return status.completed || isCompletedStatus(status.status) ? status : null;
}

export { RESULT_PATH, isCompletedStatus, loadMatchResults, findFixture, findMatchStatus, findCompletedMatch };
