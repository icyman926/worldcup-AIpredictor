const fs = require('fs');
const path = require('path');
const vm = require('vm');

const source = fs.readFileSync(path.join(__dirname, '../pages/api/integrations/context.js'), 'utf8');
if (!source.includes("const GEMINI_MODEL = 'gemini-2.5-flash'")) {
  throw new Error('Gemini model is not pinned to gemini-2.5-flash.');
}
if (/gemini-1\.5-flash|gemini-2\.0-flash/.test(source)) {
  throw new Error('Forbidden old Gemini model reference found.');
}

let requestedUrl = '';
let requestedHeaders = {};
const sandbox = {
  console,
  setTimeout,
  clearTimeout,
  AbortController,
  fetch: async (url, options) => {
    requestedUrl = url;
    requestedHeaders = options.headers || {};
    return {
      ok: true,
      status: 200,
      text: async () => JSON.stringify({
        candidates: [{
          content: {
            parts: [{
              text: JSON.stringify({
                summary: 'Gemini 2.5 Flash mock context applied.',
                home_adjustment: 0.02,
                draw_adjustment: -0.01,
                away_adjustment: -0.01,
                confidence_delta: 2,
              }),
            }],
          },
        }],
      }),
    };
  },
  module: { exports: {} },
  exports: {},
};

const runnable = source
  .replace(/export default async function handler/, 'async function handler')
  + '\nmodule.exports = { handler };';

vm.runInNewContext(runnable, sandbox);

const req = {
  method: 'POST',
  body: {
    home_team: 'Spain',
    away_team: 'France',
    apiKeys: { gemini: 'test-key' },
  },
};

let statusCode = null;
let payload = null;
const res = {
  status(code) {
    statusCode = code;
    return this;
  },
  json(data) {
    payload = data;
  },
};

sandbox.module.exports.handler(req, res).then(() => {
  if (statusCode !== 200) throw new Error('Expected status 200.');
  if (!requestedUrl.includes('/models/gemini-2.5-flash:generateContent')) {
    throw new Error('Gemini request did not use gemini-2.5-flash endpoint: ' + requestedUrl);
  }
  if (requestedHeaders['x-goog-api-key'] !== 'test-key') {
    throw new Error('Gemini request did not use x-goog-api-key header.');
  }
  if (!payload.applied || payload.connected[0] !== 'gemini') {
    throw new Error('Gemini context was not applied.');
  }
  if (payload.contexts[0].model !== 'gemini-2.5-flash') {
    throw new Error('Response model was not gemini-2.5-flash.');
  }
  console.log('PASS Gemini 2.5 Flash mock integration uses the correct endpoint and changes context.');
  console.table(payload.contexts.map((item) => ({
    provider: item.provider,
    model: item.model,
    home_adjustment: item.home_adjustment,
    draw_adjustment: item.draw_adjustment,
    away_adjustment: item.away_adjustment,
  })));
}).catch((error) => {
  console.error(error);
  process.exit(1);
});
