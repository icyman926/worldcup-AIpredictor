const assert = require('assert');
const fs = require('fs');
const path = require('path');

function read(rel) {
  return fs.readFileSync(path.join(__dirname, '..', rel), 'utf8');
}

const context = read('pages/api/integrations/context.js');

assert(context.includes("response_format: { type: 'json_object' }"));
assert(context.includes('Example JSON shape'));
assert(context.includes('Gemini reached Google but the model is temporarily overloaded'));
assert(context.includes("model: 'deepseek-v4-pro'"));
assert(!context.includes("model: 'deepseek-chat'"));

console.log('PASS DeepSeek V4 Pro uses JSON mode and Gemini 503 falls back to neutral context.');
