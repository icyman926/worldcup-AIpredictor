const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'pages/api/integrations/context.js'), 'utf8');
assert(source.includes('function extractLooseSummary'));
assert(source.includes('Never mention JSON, keys, schema'));

const helperBlock = source.match(/function cleanSynthesisProse\(output, homeTeam, awayTeam\) \{[\s\S]*?function extractLooseSummary\(text\) \{[\s\S]*?\n\}/)[0];
const sandbox = { module: { exports: {} }, parseJsonText: () => { throw new Error('mock'); } };
vm.runInNewContext(helperBlock + '\nmodule.exports = { cleanSynthesisProse, extractLooseSummary };', sandbox);

const dirty = 'provider contexts into one concise explanation for a match probability forecast for Mexico vs South Korea. Return valid compact JSON only with keys: headline, probability_rationale, key_factors, uncertainty_notes, data_basis. key_factors must be an array. Provider contexts: gemini: neutral, non-standard context, summary: Mexico often benefits from strong crowd support while South Korea injuries may matter. chatgpt: directional signal. home_adjustment: 0.02, draw_adjustment: 0.01, away_adjustment: -0.03.';
const clean = sandbox.module.exports.cleanSynthesisProse(dirty, 'Mexico', 'South Korea');
assert(!/json|keys|schema|provider contexts into one concise/i.test(clean));
assert(clean.includes('Mexico') || clean.includes('gemini'));

const loose = sandbox.module.exports.extractLooseSummary('Preview: {"summary":"Mexico crowd support is a small contextual edge');
assert(loose.includes('Mexico crowd support'));

console.log('PASS final rationale polish removes prompt residue and recovers loose Gemini summaries.');
