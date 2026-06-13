const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const auth = fs.readFileSync(path.join(root, 'lib/auth-client.js'), 'utf8');
const login = fs.readFileSync(path.join(root, 'pages/login.js'), 'utf8');
const settings = fs.readFileSync(path.join(root, 'pages/settings.js'), 'utf8');

assert(auth.includes("OWNER_EMAIL = 'owner@worldcup.ai'"), 'owner email is fixed');
assert(auth.includes("OWNER_PASSWORD = 'owner2026'"), 'owner password is fixed');
assert(auth.includes('isOwnerCredentials'), 'owner credential helper exists');
assert(login.includes('isOwnerCredentials(email, password)'), 'login accepts built-in owner credentials');
assert(settings.includes('API configuration migration'), 'settings has API migration panel');
assert(settings.includes('exportApiConfig'), 'settings can export API config');
assert(settings.includes('importApiConfig'), 'settings can import API config');
assert(settings.includes('without committing secrets to GitHub'), 'settings warns not to commit secrets');

console.log('PASS owner login and API migration are wired.');
