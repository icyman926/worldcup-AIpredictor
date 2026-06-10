const assert = require('assert');
const fs = require('fs');
const path = require('path');

const context = fs.readFileSync(path.join(__dirname, '..', 'pages/api/integrations/context.js'), 'utf8');
const predict = fs.readFileSync(path.join(__dirname, '..', 'pages/predict.js'), 'utf8');

assert(!context.includes('probability_rationale: rationale.slice(0, 1900)'), 'fallback rationale is not hard-truncated');
assert(context.includes('summary: publicReasoningText(item.summary || \'\', 1400)'), 'provider summaries passed to synthesis are expanded and cleaned');
assert(context.includes('max_tokens: 1800'), 'DeepSeek synthesis token budget is expanded');
assert(context.includes('max_output_tokens: 2600'), 'OpenAI Web Research token budget is expanded');
assert(context.includes('do not truncate the reasoning'), 'DeepSeek prompt asks for full reasoning');
assert(predict.includes('whitespace-pre-wrap break-words text-sm leading-6 text-sky-50/90'), 'summary display wraps long text');
assert(predict.includes('evidence_items.slice(0, 24)'), 'more evidence cards are displayed');
assert(predict.includes('whitespace-pre-wrap break-words text-xs leading-5 text-slate-300'), 'evidence text wraps long URLs');

console.log('PASS full reasoning summary generation and display are expanded.');
