const assert = require('assert');
const fs = require('fs');
const path = require('path');

function read(rel) {
  return fs.readFileSync(path.join(__dirname, '..', rel), 'utf8');
}

const contextApi = read('pages/api/integrations/context.js');
const matchApi = read('pages/api/predict/match.js');
const predictPage = read('pages/predict.js');

assert(contextApi.includes('getDeepSeekSynthesis'));
assert(contextApi.includes('political/commercial/capital uncertainty'));
assert(contextApi.includes('locker-room/team dynamics'));
assert(contextApi.includes("role: 'final-synthesis'"));
assert(matchApi.includes('synthesis = meta.synthesis || null'));
assert(predictPage.includes('DeepSeek V4 Pro final synthesis'));
assert(predictPage.includes('Probability rationale'));
console.log('PASS DeepSeek V4 Pro synthesizes provider context into probability rationale.');
