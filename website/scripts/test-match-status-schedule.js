const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const kickoff = fs.readFileSync(path.join(root, 'lib', 'kickoff-time.js'), 'utf8');
assert(kickoff.includes('UK_SUMMER_TO_BEIJING_HOURS = 7'), 'Beijing conversion must use UK summer +7 hours.');
assert(kickoff.includes('formatBeijingTimeFromUkSummer'), 'Beijing time formatter is missing.');

const groupstage = fs.readFileSync(path.join(root, 'pages', 'groupstage.js'), 'utf8');
assert(groupstage.includes('/api/matches/status'), 'Group stage must load match status API.');
assert(groupstage.includes('completedMatch'), 'Group stage must render completed match state.');
assert(groupstage.includes('Final score') || groupstage.includes('FT'), 'Group stage must show final score.');

const predict = fs.readFileSync(path.join(root, 'pages', 'predict.js'), 'utf8');
assert(predict.includes('/api/matches/status'), 'Predict page must load match status API.');
assert(predict.includes('match_id'), 'Predict payload must include match_id.');
assert(predict.includes('isCompletedMatch'), 'Predict page must block completed matches.');

const api = fs.readFileSync(path.join(root, 'pages', 'api', 'predict', 'match.js'), 'utf8');
assert(api.includes('findCompletedMatch'), 'Prediction API must check completed matches.');
assert(api.includes('completed_match'), 'Prediction API must return completed_match payload.');

console.log('PASS match status, Beijing time, and completed fixture guard are wired.');
