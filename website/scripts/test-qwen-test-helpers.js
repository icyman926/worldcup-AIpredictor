const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const testApi = fs.readFileSync(path.join(root, 'pages/api/integrations/test.js'), 'utf8');

assert(testApi.includes('function describeProviderNetworkError'), 'network error helper exists');
assert(testApi.includes('async function fetchText'), 'fetchText helper exists');
assert(testApi.includes('function ok'), 'ok helper exists');
assert(testApi.includes('function fail'), 'fail helper exists');
assert(testApi.includes("async function testQwen(apiKey, model = 'qwen3.7-plus')"), 'Qwen defaults to qwen3.7-plus');
assert(testApi.includes('dashscope.aliyuncs.com/compatible-mode/v1/chat/completions'), 'Qwen uses Bailian compatible endpoint');

console.log('PASS Qwen test helpers are self-contained.');
