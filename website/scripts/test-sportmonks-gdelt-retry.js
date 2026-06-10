const assert = require('assert');
const fs = require('fs');
const path = require('path');

const context = fs.readFileSync(path.join(__dirname, '..', 'pages/api/integrations/context.js'), 'utf8');

assert(context.includes('async function searchSportmonksTeam'), 'Sportmonks alias search exists');
assert(context.includes('Korea Republic'), 'South Korea alias is searched');
assert(context.includes('sportmonksJsonFirstOk'), 'Sportmonks endpoint fallback exists');
assert(context.includes('fetchText(url'), 'Sportmonks/GDELT use shared fetchText helper');
assert(context.includes('async function gdeltJsonFirstOk'), 'GDELT retry helper exists');
assert(context.includes('Mexico South Korea') === false, 'No hardcoded fixture query');
assert(context.includes('GDELT responded, but returned no article rows'), 'GDELT distinguishes empty response from network failure');

console.log('PASS Sportmonks mapping retries and GDELT DOC retries are wired.');
