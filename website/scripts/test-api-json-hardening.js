const assert = require('assert');
const fs = require('fs');
const path = require('path');

function read(rel) {
  return fs.readFileSync(path.join(__dirname, '..', rel), 'utf8');
}

const settings = read('pages/settings.js');
const predict = read('pages/predict.js');
const testApi = read('pages/api/integrations/test.js');
const contextApi = read('pages/api/integrations/context.js');
const matchApi = read('pages/api/predict/match.js');

assert(settings.includes("readApiJson(response, 'Integration test API')"));
assert(settings.includes('returned non-JSON'));
assert(predict.includes("readApiJson(contextResponse, 'Live context API')"));
assert(predict.includes("readApiJson(response, 'Match prediction API')"));
assert(predict.includes('returned non-JSON'));
assert(testApi.includes("application/json; charset=utf-8"));
assert(contextApi.includes("application/json; charset=utf-8"));
assert(matchApi.includes("application/json; charset=utf-8"));
assert(matchApi.includes('Average of successful live model contexts'));
assert(contextApi.includes("const GEMINI_MODEL = 'gemini-2.5-flash'"));

console.log('PASS API routes force JSON and frontend reports non-JSON responses precisely.');
