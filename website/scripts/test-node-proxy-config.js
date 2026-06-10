const assert = require('assert');
const fs = require('fs');
const path = require('path');

for (const file of ['check-ai-proxy.ps1', 'dev-with-proxy.ps1', 'build-with-proxy.ps1']) {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');
  assert(content.includes('NODE_USE_ENV_PROXY'));
  assert(content.includes('HTTPS_PROXY'));
}

console.log('PASS Node proxy helper scripts are installed.');
