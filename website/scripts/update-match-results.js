const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const dataDir = path.join(root, 'data');
const logsDir = path.join(root, 'logs');
const outFile = path.join(dataDir, 'match-results.json');

const FOOTBALL_DATA_KEY_NAMES = [
  'FOOTBALL_DATA_API_KEY',
  'NEXT_PUBLIC_FOOTBALL_DATA_API_KEY',
  'FOOTBALL_DATA_TOKEN',
  'FOOTBALLDATA_API_KEY',
];

function loadEnvFile() {
  const envPath = path.join(root, '.env.local');
  if (!fs.existsSync(envPath)) return false;
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue;
    const index = trimmed.indexOf('=');
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^['"]|['"]$/g, '');
    if (key && !process.env[key]) process.env[key] = value;
  }
  return true;
}

function getFootballDataKey() {
  for (const name of FOOTBALL_DATA_KEY_NAMES) {
    if (process.env[name]) return { name, value: process.env[name] };
  }
  return null;
}

function normalizeName(name) {
  return String(name || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function completed(status) {
  return ['FINISHED', 'FINISHED_PENALTY', 'AWARDED', 'FULL_TIME', 'FT'].includes(String(status || '').toUpperCase());
}

function readExisting() {
  try {
    return JSON.parse(fs.readFileSync(outFile, 'utf8'));
  } catch (error) {
    return { generatedAt: null, source: 'empty', matches: {} };
  }
}

function loadFixtures() {
  const predictorPath = path.join(root, 'lib', 'predictor.js');
  let source = fs.readFileSync(predictorPath, 'utf8');
  source = source.replace(/export\s+\{\s*WORLD_CUP_2026_TEAMS,\s*GROUP_STAGES,\s*getTeamByName,\s*getTeamById,\s*IntegratedPredictor\s*\};?/, 'module.exports = { WORLD_CUP_2026_TEAMS, GROUP_STAGES, getTeamByName, getTeamById, IntegratedPredictor };');
  const sandbox = {
    module: { exports: {} },
    exports: {},
    console,
    Math,
    Number,
    String,
    Boolean,
    Array,
    Object,
    RegExp,
    Date,
  };
  vm.runInNewContext(source, sandbox, { filename: predictorPath });
  const predictor = sandbox.module.exports;
  if (!Array.isArray(predictor.GROUP_STAGES) || !Array.isArray(predictor.WORLD_CUP_2026_TEAMS)) {
    throw new Error('Could not load local fixture data from lib/predictor.js');
  }
  return predictor.GROUP_STAGES.flatMap((group) => group.matches.map((match) => ({
    ...match,
    group: group.group,
    homeTeam: predictor.getTeamById(match.team1)?.name || match.team1,
    awayTeam: predictor.getTeamById(match.team2)?.name || match.team2,
  })));
}

function matchLocalFixture(fixtures, apiMatch) {
  const home = normalizeName(apiMatch.homeTeam?.name || apiMatch.homeTeam?.shortName);
  const away = normalizeName(apiMatch.awayTeam?.name || apiMatch.awayTeam?.shortName);
  return fixtures.find((fixture) => {
    const a = normalizeName(fixture.homeTeam);
    const b = normalizeName(fixture.awayTeam);
    return (a === home && b === away) || (a === away && b === home);
  }) || null;
}

async function fetchFootballData() {
  const key = getFootballDataKey();
  if (!key) {
    console.log('No Football-Data API key found. Keep existing match-results.json unchanged.');
    console.log('Add one of these keys to .env.local: ' + FOOTBALL_DATA_KEY_NAMES.join(', '));
    console.log('Example: FOOTBALL_DATA_API_KEY=your_real_key');
    return null;
  }
  console.log('Using Football-Data key from ' + key.name + '.');
  const response = await fetch('https://api.football-data.org/v4/competitions/WC/matches', {
    headers: { 'X-Auth-Token': key.value },
  });
  if (!response.ok) {
    throw new Error('Football-Data update failed: HTTP ' + response.status + ' ' + await response.text());
  }
  const json = await response.json();
  return Array.isArray(json.matches) ? json.matches : [];
}

async function main() {
  fs.mkdirSync(dataDir, { recursive: true });
  fs.mkdirSync(logsDir, { recursive: true });

  const envLoaded = loadEnvFile();
  console.log('Match result updater started at ' + new Date().toISOString());
  console.log(envLoaded ? 'Loaded .env.local.' : 'No .env.local file found.');

  const fixtures = loadFixtures();
  const existing = readExisting();
  const apiMatches = await fetchFootballData();
  if (!apiMatches) return;

  const matches = { ...(existing.matches || {}) };
  let mapped = 0;
  let finished = 0;
  for (const apiMatch of apiMatches) {
    const fixture = matchLocalFixture(fixtures, apiMatch);
    if (!fixture) continue;
    mapped += 1;
    const score = apiMatch.score?.fullTime || {};
    const record = {
      matchId: fixture.id,
      group: fixture.group,
      homeTeam: fixture.homeTeam,
      awayTeam: fixture.awayTeam,
      status: apiMatch.status || 'UNKNOWN',
      completed: completed(apiMatch.status),
      utcDate: apiMatch.utcDate || null,
      score: {
        home: Number.isFinite(Number(score.home)) ? Number(score.home) : null,
        away: Number.isFinite(Number(score.away)) ? Number(score.away) : null,
      },
      winner: apiMatch.score?.winner || null,
      source: 'football-data',
      updatedAt: new Date().toISOString(),
    };
    if (record.completed) finished += 1;
    matches[fixture.id] = record;
  }

  fs.writeFileSync(outFile, JSON.stringify({
    generatedAt: new Date().toISOString(),
    source: 'football-data',
    mapped,
    finished,
    matches,
  }, null, 2) + '\n');
  console.log('Updated match results: ' + mapped + ' mapped, ' + finished + ' completed.');
  console.log(outFile);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
