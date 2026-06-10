const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const context = fs.readFileSync(path.join(root, 'pages', 'api', 'integrations', 'context.js'), 'utf8');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(context.includes('function stripSourceReferences(text)'), 'missing source stripping helper');
assert(context.includes('function sanitizeSynthesisForDisplay(synthesis)'), 'missing synthesis sanitizer');
assert(context.includes('summary: publicReasoningText(item.summary || \'\', 1400)'), 'DeepSeek synthesis input should use cleaned provider summaries');
assert(context.includes('return sanitizeSynthesisForDisplay({'), 'DeepSeek synthesis return should be sanitized for display');
assert(context.includes('synthesis = sanitizeSynthesisForDisplay(synthesis);'), 'API response should sanitize fallback synthesis');
assert(context.includes("source_url ? 'URL: ' + item.source_url : ''"), 'evidence cards should keep source URLs for verification');
assert(context.includes('evidence_items: Array.isArray(enriched.evidence_items) ? enriched.evidence_items.slice(0, 24) : collectEvidenceItems(contexts)'), 'evidence items should remain available');
assert(!context.includes('summary: String(item.summary || \'\').slice(0, 1200)'), 'raw provider summary should not be sent to final synthesis');

console.log('PASS final synthesis hides source URLs while evidence cards keep citations.');
