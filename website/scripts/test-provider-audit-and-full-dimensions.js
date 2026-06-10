const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'pages/api/integrations/context.js'), 'utf8');
assert(source.includes('function providerAuditText'));
assert(source.includes('key_factors.slice(0, 10)'));
assert(source.includes("if (apiKeys.chatgpt) addJob('chatgpt'"));
assert(source.includes('getDeepSeekSynthesis(apiKeys.deepseek'));

const helperSource = source.slice(
  source.indexOf('function formatPct'),
  source.indexOf('async function getDeepSeekSynthesis')
);
const sandbox = { module: { exports: {} } };
vm.runInNewContext(helperSource + '\nmodule.exports = { buildReasoningSummary, providerAuditText };', sandbox);

const contexts = [
  { provider: 'gemini', model: 'gemini-2.5-flash', signal: 'directional', summary: 'Mexico crowd support and squad depth create a small edge, while South Korea injury uncertainty matters.', home_adjustment: 0.006, draw_adjustment: 0, away_adjustment: -0.006, confidence_delta: 0.4 },
  { provider: 'chatgpt', model: 'gpt-4o-mini', signal: 'directional', summary: 'OpenAI context: Mexico possession control versus South Korea transition speed is the tactical matchup.', home_adjustment: 0.02, draw_adjustment: 0.01, away_adjustment: -0.03, confidence_delta: 3 },
  { provider: 'oddsApi', model: 'h2h-market', signal: 'directional', summary: 'The Odds API returned a matching H2H market. No-vig probabilities: home 52.19%, draw 27.14%, away 20.67%.', home_adjustment: 0.015, draw_adjustment: 0.003, away_adjustment: -0.018, confidence_delta: 1.5 },
  { provider: 'footballData', model: 'competition-matches', signal: 'neutral', summary: 'Football-Data.org returned a matching fixture record. No score/form edge is available yet, so it is kept as a neutral schedule confirmation.', home_adjustment: 0, draw_adjustment: 0, away_adjustment: 0, confidence_delta: 0 },
];

const summary = sandbox.module.exports.buildReasoningSummary('Mexico', 'South Korea', contexts, {});
const all = summary.probability_rationale + ' ' + summary.data_basis + ' ' + summary.key_factors.map((item) => item.factor + ' ' + item.read + ' ' + item.impact).join(' ');

assert(all.includes('OpenAI ChatGPT context was included'));
assert(all.includes('DeepSeek V4 Pro is used as the final synthesis layer'));
assert(all.includes('Player status/injuries'));
assert(all.includes('Locker-room/team dynamics'));
assert(all.includes('Capital/commercial/political context'));
assert(all.includes('Head-to-head/history'));
assert(all.includes('Tactical matchup'));
assert(summary.key_factors.length >= 9);
assert(summary.key_factors.some((item) => item.factor === 'API provider audit'));
assert(summary.key_factors.some((item) => item.factor === 'Tactical style and matchup advantages'));

console.log('PASS provider audit and full reasoning dimensions are present.');
