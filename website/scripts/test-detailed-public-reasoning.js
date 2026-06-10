const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'pages/api/integrations/context.js'), 'utf8');
assert(source.includes('function publicProviderSummary'));
assert(source.includes('Locker-room and team dynamics'));
assert(source.includes('Capital, commercial, and political context'));
assert(source.includes('Head-to-head and historical pattern'));
assert(source.includes('Tactical style and matchup advantages'));
assert(!source.includes("fixture lookup failed. Treated as neutral data signal. ' + explainNetworkError(error)"));

const helperSource = source.slice(
  source.indexOf('function formatPct'),
  source.indexOf('async function getDeepSeekSynthesis')
);
const sandbox = { module: { exports: {} } };
vm.runInNewContext(helperSource + '\nmodule.exports = { buildReasoningSummary, publicProviderSummary };', sandbox);

const contexts = [
  { provider: 'gemini', model: 'gemini-2.5-flash', signal: 'directional', summary: 'Mexico home support and squad depth create a small edge, while South Korea has injury uncertainty.', home_adjustment: 0.006, draw_adjustment: 0, away_adjustment: -0.006, confidence_delta: 0.4 },
  { provider: 'chatgpt', model: 'gpt-4o-mini', signal: 'directional', summary: 'Mexico possession control versus South Korea transition speed is the key tactical matchup.', home_adjustment: 0.02, draw_adjustment: 0.01, away_adjustment: -0.03, confidence_delta: 3 },
  { provider: 'oddsApi', model: 'h2h-market', signal: 'directional', summary: 'The Odds API returned a matching H2H market. No-vig probabilities: home 52.23%, draw 27.16%, away 20.61%.', home_adjustment: 0.015, draw_adjustment: 0.003, away_adjustment: -0.018, confidence_delta: 1.5 },
  { provider: 'footballData', model: 'competition-matches', signal: 'neutral', summary: 'Football-Data.org is connected, but fixture lookup failed. Treated as neutral data signal. fetch failed | UND_ERR_CONNECT_TIMEOUT | Connect Timeout Error (attempted address: api.football-data.org:443, timeout: 10000ms)', home_adjustment: 0, draw_adjustment: 0, away_adjustment: 0, confidence_delta: 0 },
];

const summary = sandbox.module.exports.buildReasoningSummary('Mexico', 'South Korea', contexts, {});
const text = summary.probability_rationale + ' ' + summary.key_factors.map((item) => item.factor + ' ' + item.read).join(' ');

assert(text.includes('baseline Elo and Poisson'));
assert(text.includes('Player status and injuries'));
assert(text.includes('Locker-room and team dynamics'));
assert(text.includes('Capital, commercial, and political context'));
assert(text.includes('Head-to-head and historical pattern'));
assert(text.includes('Tactical style and matchup advantages'));
assert(text.includes('Odds and market signal'));
assert(!/UND_ERR|api\.football-data\.org|Connect Timeout/i.test(text));
assert(sandbox.module.exports.publicProviderSummary(contexts[3].summary).includes('neutral'));

console.log('PASS detailed public reasoning covers required dimensions without leaking connection errors.');
