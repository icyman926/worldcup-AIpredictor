const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

function read(rel) {
  return fs.readFileSync(path.join(__dirname, '..', rel), 'utf8');
}

const contextApi = read('pages/api/integrations/context.js');
const predictApi = read('pages/api/predict/match.js');
const predictPage = read('pages/predict.js');

assert(contextApi.includes("const GEMINI_MODEL = 'gemini-2.5-flash'"));
assert(contextApi.includes("if (apiKeys.oddsApi) addJob('oddsApi'"));
assert(contextApi.includes("if (apiKeys.footballData) addJob('footballData'"));
assert(contextApi.includes("providerContext('oddsApi'"));
assert(contextApi.includes("providerContext('footballData'"));
assert(predictApi.includes('Average of successful live model contexts'));
assert(predictPage.includes('APIs attempted'));
assert(predictPage.includes('Average adjustment across successful providers'));

let code = contextApi
  .replace(/export default async function handler/, 'async function handler')
  + '\nmodule.exports = { handler };';

let calls = [];
const sandbox = {
  module: { exports: {} },
  exports: {},
  console,
  setTimeout,
  clearTimeout,
  AbortController,
  fetch: async (url, options = {}) => {
    calls.push(String(url));
    if (String(url).includes('deepseek.com')) {
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({
          choices: [{ message: { content: JSON.stringify({
            summary: 'DeepSeek directional context.',
            home_adjustment: 0.03,
            draw_adjustment: -0.02,
            away_adjustment: -0.01,
            confidence_delta: 2,
          }) } }],
        }),
      };
    }
    if (String(url).includes('the-odds-api.com')) {
      return { ok: true, status: 200, text: async () => JSON.stringify([]) };
    }
    if (String(url).includes('football-data.org')) {
      return { ok: true, status: 200, text: async () => JSON.stringify({ matches: [] }) };
    }
    if (String(url).includes('generativelanguage.googleapis.com')) {
      throw new Error('fetch failed');
    }
    throw new Error('Unexpected URL ' + url);
  },
};
vm.createContext(sandbox);
vm.runInContext(code, sandbox);

const req = {
  method: 'POST',
  body: {
    home_team: 'Mexico',
    away_team: 'South Korea',
    apiKeys: {
      gemini: 'AIza-test',
      deepseek: 'sk-test',
      oddsApi: 'odds-test',
      footballData: 'fd-test',
    },
  },
};

const res = {
  statusCode: 0,
  headers: {},
  setHeader(key, value) { this.headers[key] = value; },
  status(code) { this.statusCode = code; return this; },
  json(payload) { this.payload = payload; return this; },
};

(async () => {
  await sandbox.module.exports.handler(req, res);
  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.payload.attempted.join(','), 'gemini,deepseek,oddsApi,footballData');
  assert(res.payload.connected.includes('deepseek'));
  assert(res.payload.connected.includes('oddsApi'));
  assert(res.payload.connected.includes('footballData'));
  assert(res.payload.errors.some((item) => item.provider === 'gemini'));
  assert.strictEqual(res.payload.contexts.length, 3);
  assert(calls.some((url) => url.includes('generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent')));
  assert(calls.some((url) => url.includes('the-odds-api.com')));
  assert(calls.some((url) => url.includes('football-data.org')));
  console.log('PASS all configured providers are attempted, successful data providers join the ensemble, and Gemini failure is reported.');
  console.table({
    attempted: res.payload.attempted.join(', '),
    connected: res.payload.connected.join(', '),
    errors: res.payload.errors.map((item) => item.provider).join(', '),
    contexts: res.payload.contexts.length,
  });
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
