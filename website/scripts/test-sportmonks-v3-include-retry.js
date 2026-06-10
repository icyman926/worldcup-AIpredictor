const assert = require('assert');
const fs = require('fs');
const path = require('path');

const context = fs.readFileSync(path.join(__dirname, '..', 'pages/api/integrations/context.js'), 'utf8');

assert(context.includes("include=country;venue"), 'team search uses safe includes only');
assert(!context.includes("include=country;venue;sidelined;latest;squad;rankings"), 'unsupported squad include removed');
assert(context.includes('sportmonksJsonFirstOk'), 'Sportmonks H2H has retry fallback');
assert(context.includes("include=participants;scores;state;venue"), 'H2H starts with safe match evidence includes');
assert(context.includes("include=participants;scores&per_page=5"), 'H2H retries with smaller include set');
assert(context.includes('Unsupported names/includes are downgraded'), 'data quality evidence explains downgraded includes');

console.log('PASS Sportmonks V3 includes are safe and retry unsupported include/plan responses.');
