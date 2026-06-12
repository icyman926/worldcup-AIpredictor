const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const liveModel = fs.readFileSync(path.join(root, 'lib/live-model.js'), 'utf8');
const matchApi = fs.readFileSync(path.join(root, 'pages/api/predict/match.js'), 'utf8');
const liveApi = fs.readFileSync(path.join(root, 'pages/api/predict/live.js'), 'utf8');
const predict = fs.readFileSync(path.join(root, 'pages/predict.js'), 'utf8');

assert(liveModel.includes('applyLiveMatchContext'), 'live model exports applyLiveMatchContext');
assert(liveModel.includes('comeback_probability'), 'live model exposes comeback probability');
assert(liveModel.includes('next_goal'), 'live model exposes next-goal probability');
assert(matchApi.includes('applyLiveMatchContext'), 'match API applies live context');
assert(matchApi.includes('live_state'), 'match API accepts live_state');
assert(liveApi.includes('/ ../../../lib/live-model'.replace('/ ', '')), 'live API imports live model');
assert(predict.includes('Live match intelligence'), 'predict page has live controls');
assert(predict.includes('payload.live_state'), 'predict request sends live state');
assert(predict.includes('Live in-play analytics'), 'predict result renders live analytics');

console.log('PASS live match MVP is wired across model, API, and UI.');
