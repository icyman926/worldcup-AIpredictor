const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'pages/api/integrations/context.js'), 'utf8');
assert(source.includes('function buildReasoningSummary'));
assert(source.includes('function isGenericSynthesis'));
assert(source.includes('const enriched = isGenericSynthesis(parsed)'));

const helperSource = source.slice(
  source.indexOf('function formatPct'),
  source.indexOf('async function getDeepSeekSynthesis')
);

const sandbox = { module: { exports: {} } };
vm.runInNewContext(helperSource + '\nmodule.exports = { buildReasoningSummary, isGenericSynthesis };', sandbox);

const contexts = [
  { provider: 'gemini', model: 'gemini-2.5-flash', signal: 'directional', summary: 'Mexico often benefits from strong home crowd support, while South Korea has minor injury uncertainty.', home_adjustment: 0.006, draw_adjustment: 0, away_adjustment: -0.006, confidence_delta: 0.4 },
  { provider: 'chatgpt', model: 'gpt-4o-mini', signal: 'directional', summary: 'Mexico squad depth and venue familiarity create a small edge; South Korea counter-attacking threat keeps the match close.', home_adjustment: 0.02, draw_adjustment: 0.01, away_adjustment: -0.03, confidence_delta: 3 },
  { provider: 'oddsApi', model: 'h2h-market', signal: 'directional', summary: 'The Odds API returned a matching H2H market. No-vig probabilities: home 52.23%, draw 27.16%, away 20.61%.', home_adjustment: 0.015, draw_adjustment: 0.003, away_adjustment: -0.018, confidence_delta: 1.5 },
  { provider: 'footballData', model: 'competition-matches', signal: 'neutral', summary: 'Football-Data.org returned a matching fixture record, with no score/form edge available yet.', home_adjustment: 0, draw_adjustment: 0, away_adjustment: 0, confidence_delta: 0 },
];

const generic = {
  headline: 'Final probability rationale',
  probability_rationale: 'The final probability blends baseline model output with connected provider context.',
  key_factors: [],
};

assert.strictEqual(sandbox.module.exports.isGenericSynthesis(generic), true);
const enriched = sandbox.module.exports.buildReasoningSummary('Mexico', 'South Korea', contexts, generic);
assert(enriched.probability_rationale.includes('baseline Elo and Poisson'));
assert(enriched.probability_rationale.includes('Home +'));
assert(enriched.probability_rationale.includes('Odds API'));
assert(enriched.key_factors.length >= 5);
assert(enriched.key_factors.some((item) => item.factor === 'Player status and injuries' || item.factor === 'Squad, injuries, and form'));
assert(enriched.key_factors.some((item) => item.factor === 'Capital, commercial, and political context' || item.factor === 'Political, commercial, and capital context'));

console.log('PASS rich reasoning summary expands weak V4 output into useful football analysis.');
