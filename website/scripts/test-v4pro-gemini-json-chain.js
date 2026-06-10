const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

function read(rel) {
  return fs.readFileSync(path.join(__dirname, '..', rel), 'utf8');
}

const contextApi = read('pages/api/integrations/context.js');
assert(contextApi.includes("model: 'deepseek-v4-pro'"));
assert(contextApi.includes("thinking: { type: 'enabled' }"));
assert(contextApi.includes("reasoning_effort: 'high'"));
assert(contextApi.includes("responseMimeType: 'application/json'"));
assert(contextApi.includes('Gemini is reachable, but returned non-JSON context'));
assert(!contextApi.includes("model: 'deepseek-chat'"));

let calls = [];
const sandbox = {
  module: { exports: {} },
  exports: {},
  console,
  setTimeout,
  clearTimeout,
  AbortController,
  fetch: async (url, options = {}) => {
    calls.push({ url: String(url), body: JSON.parse(options.body || '{}'), headers: options.headers || {} });
    if (String(url).includes('generativelanguage.googleapis.com')) {
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({
          candidates: [{ content: { parts: [{ text: 'I think Mexico has a slight edge, but this is not JSON.' }] } }],
        }),
      };
    }
    if (String(url).includes('api.deepseek.com/chat/completions')) {
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({
          choices: [{ message: { content: JSON.stringify({
            summary: 'DeepSeek V4 Pro context.',
            home_adjustment: 0.02,
            draw_adjustment: -0.01,
            away_adjustment: -0.01,
            confidence_delta: 2,
          }) } }],
        }),
      };
    }
    throw new Error('Unexpected URL ' + url);
  },
};

const code = contextApi
  .replace(/export default async function handler/, 'async function handler')
  + '\nmodule.exports = { handler };';

vm.createContext(sandbox);
vm.runInContext(code, sandbox);

const req = {
  method: 'POST',
  body: {
    home_team: 'Mexico',
    away_team: 'South Korea',
    apiKeys: { gemini: 'AIza-test', deepseek: 'sk-test' },
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
  const geminiCall = calls.find((item) => item.url.includes('generativelanguage.googleapis.com'));
  const deepseekCall = calls.find((item) => item.url.includes('api.deepseek.com'));
  assert.strictEqual(geminiCall.body.generationConfig.responseMimeType, 'application/json');
  assert.strictEqual(deepseekCall.body.model, 'deepseek-v4-pro');
  assert.deepStrictEqual(deepseekCall.body.thinking, { type: 'enabled' });
  assert.strictEqual(deepseekCall.body.reasoning_effort, 'high');
  assert(res.payload.connected.includes('gemini'));
  assert(res.payload.connected.includes('deepseek'));
  assert.strictEqual(res.payload.contexts.find((item) => item.provider === 'gemini').signal, 'neutral');
  assert.strictEqual(res.payload.contexts.find((item) => item.provider === 'deepseek').model, 'deepseek-v4-pro');
  console.log('PASS Gemini context forces JSON and falls back to neutral if non-JSON; DeepSeek uses V4 Pro.');
  console.table({
    connected: res.payload.connected.join(', '),
    deepseekModel: res.payload.contexts.find((item) => item.provider === 'deepseek').model,
    geminiSignal: res.payload.contexts.find((item) => item.provider === 'gemini').signal,
  });
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
