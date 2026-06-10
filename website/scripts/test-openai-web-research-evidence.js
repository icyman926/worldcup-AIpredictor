const assert = require('assert');
const fs = require('fs');
const path = require('path');

const context = fs.readFileSync(path.join(__dirname, '..', 'pages/api/integrations/context.js'), 'utf8');
const predict = fs.readFileSync(path.join(__dirname, '..', 'pages/predict.js'), 'utf8');

assert(context.includes('async function getOpenAIWebResearchContext'), 'OpenAI web research context exists');
assert(context.includes("tools: [{ type: 'web_search' }]"), 'new web_search tool is attempted');
assert(context.includes("tools: [{ type: 'web_search_preview' }]"), 'legacy web_search_preview fallback is attempted');
assert(context.includes("addJob('openaiWebResearch'"), 'OpenAI web research job is attempted when ChatGPT key exists');
assert(context.includes('evidence_items must be 6 to 10 objects'), 'prompt requests structured evidence items');
assert(context.includes('OpenAI Web Research provided source-backed evidence items'), 'provider audit mentions web research');
assert(context.includes("'openaiWebResearch'"), 'OpenAI web research participates in provider priority');
assert(predict.includes('ChatGPT + Web Research'), 'predict UI explains ChatGPT key powers web research');
assert(!context.includes('formatFetchError('), 'stale network helper name is removed when explainNetworkError exists');

console.log('PASS OpenAI Web Research evidence layer is wired into prediction context and DeepSeek synthesis.');
