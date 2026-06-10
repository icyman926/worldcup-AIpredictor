const assert = require('assert');
const fs = require('fs');
const path = require('path');

function read(rel) {
  return fs.readFileSync(path.join(__dirname, '..', rel), 'utf8');
}

const context = read('pages/api/integrations/context.js');

assert(!context.includes("addJob('deepseek', () => getDeepSeekContext"));
assert(context.includes("attempted.includes('deepseek'"));
assert(context.includes('}, 75000);'));
assert(context.includes("max_tokens: 700"));
assert(context.includes("summary: String(item.summary || '').slice(0, 260)"));
assert(context.includes("synthesis?.model === 'deepseek-v4-pro'"));
assert(context.includes("fallback-rationale-after-deepseek-timeout"));

const synthesisStart = context.indexOf('async function getDeepSeekSynthesis');
const synthesisEnd = context.indexOf('async function getOddsApiContext', synthesisStart);
const synthesisBlock = context.slice(synthesisStart, synthesisEnd);
assert.strictEqual((synthesisBlock.match(/response_format: { type: 'json_object' }/g) || []).length, 1);

console.log('PASS DeepSeek V4 Pro is used once as the final synthesis layer with a longer timeout.');
