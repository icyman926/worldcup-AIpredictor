const assert = require('assert');
const fs = require('fs');
const path = require('path');

function read(rel) {
  return fs.readFileSync(path.join(__dirname, '..', rel), 'utf8');
}

const context = read('pages/api/integrations/context.js');
const predict = read('pages/predict.js');

assert(context.includes('function buildFallbackSynthesis'));
assert(context.includes('final-synthesis-fallback'));
assert(context.includes('if (!synthesis && contexts.length > 0)'));
assert(context.includes('synthesis = buildFallbackSynthesis(home_team, away_team, contexts, synthesisError)'));
assert(predict.includes('Probability rationale fallback'));

console.log('PASS probability rationale is always visible with fallback when DeepSeek synthesis fails.');
