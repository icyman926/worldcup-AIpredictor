const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const context = fs.readFileSync(path.join(__dirname, '..', 'pages/api/integrations/context.js'), 'utf8');
const predict = fs.readFileSync(path.join(__dirname, '..', 'pages/predict.js'), 'utf8');

assert(context.includes('function collectEvidenceItems'));
assert(context.includes('async function getGdeltNewsContext'));
assert(context.includes('/fixtures/headtohead?h2h='));
assert(context.includes('/injuries?team='));
assert(context.includes('evidence_items: evidenceItems'));
assert(predict.includes('Live evidence used'));

const helperSource = context.slice(
  context.indexOf('function formatPct'),
  context.indexOf('function buildReasoningSummary')
) + context.slice(
  context.indexOf('function buildReasoningSummary'),
  context.indexOf('function isGenericSynthesis')
);
const sandbox = { module: { exports: {} } };
vm.runInNewContext(helperSource + '\nmodule.exports = { buildReasoningSummary, collectEvidenceItems };', sandbox);

const contexts = [
  { provider: 'oddsApi', model: 'h2h-market', signal: 'directional', summary: 'Odds', home_adjustment: 0.01, draw_adjustment: 0, away_adjustment: -0.01, confidence_delta: 1, evidence_items: [{ category: 'odds_market', source: 'The Odds API', detail: 'No-vig probabilities: home 52.19%, draw 27.14%, away 20.67%.', impact: 'Market signal included.' }] },
  { provider: 'apiFootball', model: 'h2h-injury-evidence', signal: 'directional', summary: 'API-Football evidence', home_adjustment: 0, draw_adjustment: 0, away_adjustment: 0, confidence_delta: 1, evidence_items: [
    { category: 'head_to_head', source: 'API-Football', detail: '2022-01-29: Mexico 0-0 South Korea', impact: 'H2H evidence.' },
    { category: 'player_status_injury', source: 'API-Football', detail: 'South Korea - Example Player: muscle injury', impact: 'Availability evidence.' },
  ] },
  { provider: 'gdeltNews', model: 'gdelt-doc-news', signal: 'neutral', summary: 'News', home_adjustment: 0, draw_adjustment: 0, away_adjustment: 0, confidence_delta: 0, evidence_items: [{ category: 'capital_commercial_political_news', source: 'GDELT / example.com', detail: 'FIFA sponsorship news item | Seen: 20260609', impact: 'News context only.' }] },
];

const summary = sandbox.module.exports.buildReasoningSummary('Mexico', 'South Korea', contexts, {});
const text = summary.probability_rationale + ' ' + summary.key_factors.map((item) => item.read).join(' ') + ' ' + summary.evidence_items.map((item) => item.detail).join(' ');
assert(text.includes('No-vig probabilities'));
assert(text.includes('2022-01-29'));
assert(text.includes('muscle injury'));
assert(text.includes('FIFA sponsorship news item'));
assert(summary.evidence_items.length >= 4);

console.log('PASS live evidence sources are surfaced in synthesis and UI.');
