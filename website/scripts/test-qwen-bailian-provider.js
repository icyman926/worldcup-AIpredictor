const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const settings = fs.readFileSync(path.join(root, 'pages/settings.js'), 'utf8');
const testApi = fs.readFileSync(path.join(root, 'pages/api/integrations/test.js'), 'utf8');
const context = fs.readFileSync(path.join(root, 'pages/api/integrations/context.js'), 'utf8');

assert(settings.includes("qwen: ''"), 'settings stores Qwen API key');
assert(settings.includes("qwenModel: 'qwen3.7-plus'"), 'settings stores Qwen model');
assert(settings.includes('Alibaba Qwen / Tongyi'), 'settings shows Qwen provider');
assert(settings.includes('provider.modelOptions'), 'settings has model selector');
assert(testApi.includes('testQwen'), 'test API supports Qwen');
assert(testApi.includes('dashscope.aliyuncs.com/compatible-mode/v1/chat/completions'), 'Qwen uses Bailian OpenAI-compatible endpoint');
assert(context.includes('getQwenContext'), 'context API supports Qwen');
assert(context.includes("addJob('qwen'"), 'context API attempts Qwen');
assert(context.includes('[qwenRead, openaiWebRead, geminiRead, chatgptRead]'), 'reasoning includes Qwen in domestic context');
assert(context.includes('|| qwenRead || openaiWebRead'), 'tactical evidence can use Qwen context');

console.log('PASS Qwen/Bailian provider is wired with model selector, test API, and prediction context.');
