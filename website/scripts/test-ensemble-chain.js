const assert = require('assert');
const fs = require('fs');
const path = require('path');

function read(rel) {
  return fs.readFileSync(path.join(__dirname, '..', rel), 'utf8');
}

function averageExternalContext(contexts) {
  const total = contexts.reduce((acc, item) => ({
    home: acc.home + item.home_adjustment,
    draw: acc.draw + item.draw_adjustment,
    away: acc.away + item.away_adjustment,
  }), { home: 0, draw: 0, away: 0 });
  return {
    home: total.home / contexts.length,
    draw: total.draw / contexts.length,
    away: total.away / contexts.length,
  };
}

const avg = averageExternalContext([
  { provider: 'gemini', home_adjustment: 0.04, draw_adjustment: -0.02, away_adjustment: -0.02 },
  { provider: 'deepseek', home_adjustment: -0.02, draw_adjustment: 0.01, away_adjustment: 0.03 },
]);

assert.strictEqual(Math.round(avg.home * 10000) / 100, 1);
assert.strictEqual(Math.round(avg.draw * 10000) / 100, -0.5);
assert.strictEqual(Math.round(avg.away * 10000) / 100, 0.5);

const predictApi = read('pages/api/predict/match.js');
const contextApi = read('pages/api/integrations/context.js');
const predictPage = read('pages/predict.js');
const groupstagePage = read('pages/groupstage.js');

assert(predictApi.includes('averageExternalContext'));
assert(predictApi.includes('Average of successful live model contexts'));
assert(predictApi.includes('external_context_meta'));
assert(contextApi.includes("const GEMINI_MODEL = 'gemini-2.5-flash'"));
assert(contextApi.includes('attempted'));
assert(contextApi.includes("provider: item.reason?.provider || 'unknown'"));
assert(predictPage.includes('Applied ensemble average from'));
assert(predictPage.includes('Failed providers'));
assert(predictPage.includes('external_context_meta'));
assert(groupstagePage.includes('href={{ pathname: \'/predict\''));

console.log('PASS ensemble uses average of successful model contexts, not sum.');
console.table([{ home: avg.home, draw: avg.draw, away: avg.away }]);
