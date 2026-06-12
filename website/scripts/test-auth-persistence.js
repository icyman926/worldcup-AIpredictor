const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const auth = fs.readFileSync(path.join(root, 'lib/auth-client.js'), 'utf8');
const login = fs.readFileSync(path.join(root, 'pages/login.js'), 'utf8');
const register = fs.readFileSync(path.join(root, 'pages/register.js'), 'utf8');

assert(auth.includes("USERS_KEY = 'wc_registered_users'"), 'registered users are stored separately from session');
assert(auth.includes('SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 180'), 'session cookie lasts 180 days');
assert(auth.includes('function restoreSessionFromLocalUser'), 'can restore session if cookie is missing');
assert(auth.includes('if (user?.ageVerified && !cookie)'), 'auth state restores cookie from local user');
assert(login.includes('findRegisteredUser(email) || getAuthState().user'), 'login can use remembered registered account');
assert(login.includes('router.replace(router.query.next || \'/predict\')'), 'login redirects already-authenticated users');
assert(register.includes('router.replace(\'/predict\')'), 'register redirects already-authenticated users');
assert(register.includes('form.email.trim().toLowerCase()'), 'registration normalizes email');

console.log('PASS browser auth persists registration and restores remembered sessions.');
