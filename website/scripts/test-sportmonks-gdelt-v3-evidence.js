const assert = require('assert');
const fs = require('fs');
const path = require('path');

const context = fs.readFileSync(path.join(__dirname, '..', 'pages/api/integrations/context.js'), 'utf8');
const settings = fs.readFileSync(path.join(__dirname, '..', 'pages/settings.js'), 'utf8');
const predict = fs.readFileSync(path.join(__dirname, '..', 'pages/predict.js'), 'utf8');
const testApi = fs.readFileSync(path.join(__dirname, '..', 'pages/api/integrations/test.js'), 'utf8');

assert(settings.includes("sportmonks: ''"), 'settings stores Sportmonks key');
assert(settings.includes("key: 'sportmonks'"), 'settings displays Sportmonks provider');
assert(!settings.includes("key: 'newsApi'"), 'NewsAPI is not user-facing');
assert(predict.includes("'sportmonks'"), 'predict shows Sportmonks provider status');
assert(!predict.includes("'newsApi'"), 'predict does not show NewsAPI');
assert(testApi.includes('async function testSportmonks'), 'Sportmonks key test exists');
assert(testApi.includes('sportmonks: testSportmonks'), 'Sportmonks tester is routed');
assert(context.includes('async function getSportmonksContext'), 'Sportmonks context function exists');
assert(context.includes('/fixtures/head-to-head/'), 'Sportmonks H2H endpoint is used');
assert(context.includes('sidelined'), 'Sportmonks player-status evidence is requested');
assert(context.includes("if (apiKeys.sportmonks) addJob('sportmonks'"), 'Sportmonks context job is attempted');
assert(context.includes('api.gdeltproject.org/api/v2/doc/doc'), 'GDELT DOC endpoint is used');
assert(context.includes('capital_commercial_political_news'), 'GDELT news evidence category is present');
assert(!context.includes('getNewsApiContext'), 'NewsAPI context code is removed');

console.log('PASS Sportmonks V3 football evidence and GDELT no-key news evidence are wired without NewsAPI.');
