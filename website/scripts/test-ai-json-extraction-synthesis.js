const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'pages/api/integrations/context.js'), 'utf8');

assert(source.includes('function extractOpenAiMessageText'));
assert(source.includes('function extractGeminiCandidateText'));
assert(source.includes('The final reasoning model returned prose instead of strict JSON'));
assert(source.includes("extractOpenAiMessageText(data?.choices?.[0]?.message)"));
assert(source.includes('extractGeminiCandidateText(data?.candidates?.[0])'));
assert(!source.includes("addJob('deepseek', () => getDeepSeekContext"));

const parseBlock = source.match(/function parseJsonText\(output\) \{[\s\S]*?function extractOpenAiMessageText/)[0]
  .replace('function extractOpenAiMessageText', '');
const sandboxModule = { exports: {} };
new Function('sandboxModule', parseBlock + '\nsandboxModule.exports = { parseJsonText };')(sandboxModule);
const { parseJsonText } = sandboxModule.exports;

assert.deepStrictEqual(parseJsonText('prefix {"a":1} suffix'), { a: 1 });
assert.deepStrictEqual(parseJsonText('\`\`\`json\n{"summary":"ok","nested":{"x":1}}\n\`\`\`'), { summary: 'ok', nested: { x: 1 } });
assert.deepStrictEqual(parseJsonText('{"summary":"brace } inside string","home_adjustment":0.01} trailing'), { summary: 'brace } inside string', home_adjustment: 0.01 });

async function runHandlerMock() {
  const apiSource = source
    .replace(/export default async function handler/, 'async function handler')
    + '\nsandboxModule.exports.handler = handler;';

  const calls = [];
  const sandbox = {
    sandboxModule: { exports: {} },
    console,
    URLSearchParams,
    setTimeout,
    clearTimeout,
    AbortController,
    fetch: async (url, options = {}) => {
      calls.push({ url: String(url), body: options.body ? JSON.parse(options.body) : null });

      if (String(url).includes('generativelanguage.googleapis.com')) {
        return {
          ok: true,
          status: 200,
          text: async () => JSON.stringify({
            candidates: [{
              content: {
                parts: [{
                  text: 'Here is the JSON: {"summary":"Gemini wrapped JSON still parsed.","home_adjustment":0.012,"draw_adjustment":-0.004,"away_adjustment":-0.008,"confidence_delta":0.7}',
                }],
              },
            }],
          }),
        };
      }

      if (String(url).includes('api.deepseek.com')) {
        return {
          ok: true,
          status: 200,
          text: async () => JSON.stringify({
            choices: [{
              message: {
                content: 'DeepSeek V4 Pro synthesis: Mexico edge is small after Gemini context and market context. Injuries are limited, locker-room signal is neutral, and political or capital factors are not evidence-backed.',
              },
            }],
          }),
        };
      }

      return { ok: false, status: 404, text: async () => 'not found' };
    },
  };

  vm.runInNewContext(apiSource, sandbox, { filename: 'context.js' });

  let payload = null;
  const req = {
    method: 'POST',
    body: {
      home_team: 'Mexico',
      away_team: 'South Korea',
      apiKeys: { gemini: 'AIza-test', deepseek: 'sk-test' },
    },
  };
  const res = {
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      payload = data;
    },
  };

  await sandbox.sandboxModule.exports.handler(req, res);

  assert.strictEqual(res.statusCode, 200);
  assert(payload.contexts.some((item) => item.provider === 'gemini' && item.signal !== 'neutral'));
  assert.strictEqual(payload.synthesis.model, 'deepseek-v4-pro');
  assert.strictEqual(payload.synthesis.role, 'final-synthesis');
  assert(payload.synthesis.probability_rationale.includes('baseline Elo and Poisson') || payload.synthesis.probability_rationale.includes('Mexico edge'));
  assert(payload.synthesis.key_factors.length >= 2);
  assert(calls.some((call) => call.body?.model === 'deepseek-v4-pro'));
}

runHandlerMock().then(() => {
  console.log('PASS AI JSON extraction tolerates provider wrappers and keeps DeepSeek V4 synthesis visible.');
}).catch((error) => {
  console.error(error);
  process.exit(1);
});
