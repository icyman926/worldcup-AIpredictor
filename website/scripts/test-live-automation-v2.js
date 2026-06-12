const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const liveFeed = fs.readFileSync(path.join(root, 'lib/live-feed.js'), 'utf8');
const liveApi = fs.readFileSync(path.join(root, 'pages/api/predict/live-snapshot.js'), 'utf8');
const predict = fs.readFileSync(path.join(root, 'pages/predict.js'), 'utf8');

assert(liveFeed.includes('getApiFootballLiveSnapshot'), 'API-Football live adapter exists');
assert(liveFeed.includes('getFootballDataLiveSnapshot'), 'Football-Data live adapter exists');
assert(liveFeed.includes('getSportmonksLiveSnapshot'), 'Sportmonks live adapter exists');
assert(liveFeed.includes('getOddsApiLiveSnapshot'), 'Odds API live adapter exists');
assert(liveFeed.includes('nextPollSeconds: 120'), 'polling cadence is exposed');
assert(liveApi.includes('getLiveSnapshot'), 'live snapshot API calls getLiveSnapshot');
assert(predict.includes('Auto live feed'), 'predict page has auto live control');
assert(predict.includes("fetch('/api/predict/live-snapshot'"), 'predict page fetches live snapshot API');
assert(predict.includes('setInterval(fetchLiveSnapshot, 120000)'), 'predict page polls every 120 seconds');
assert(predict.includes('applyLiveSnapshot(snapshot)'), 'predict page applies snapshot to live layer');

console.log('PASS live automation v2 is wired across providers, API, and UI.');
