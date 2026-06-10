const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'pages/api/integrations/context.js'), 'utf8');
assert(source.includes('function cleanSynthesisProse'));
assert(source.includes('summaryOnly ? 0.006 : 0'));

const helperBlock = source.match(/function cleanSynthesisProse\(output, homeTeam, awayTeam\) \{[\s\S]*?\n\}/)[0];
const sandbox = { module: { exports: {} } };
vm.runInNewContext(helperBlock + '\nmodule.exports = { cleanSynthesisProse };', sandbox);
const dirty = 'We are asked to produce a compact JSON object with keys: headline, probability_rationale. The input is a fusion of provider contexts for Mexico vs South Korea. Provider contexts: Gemini says Mexico crowd support matters. ChatGPT says squad depth edge is small.';
const clean = sandbox.module.exports.cleanSynthesisProse(dirty, 'Mexico', 'South Korea');
assert(!clean.toLowerCase().includes('we are asked'));
assert(!clean.toLowerCase().includes('json object'));
assert(clean.includes('Gemini') || clean.includes('Provider contexts'));

console.log('PASS final rationale cleanup removes schema/task text and preserves football reasoning.');
