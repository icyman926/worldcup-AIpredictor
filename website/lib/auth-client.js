export const AUTH_COOKIE = 'wc_auth';
export const USER_KEY = 'wc_user';
export const USERS_KEY = 'wc_registered_users';

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 180;

function isBrowser() {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

export function calculateAge(dateOfBirth) {
  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) return 0;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const month = today.getMonth() - dob.getMonth();
  if (month < 0 || (month === 0 && today.getDate() < dob.getDate())) age -= 1;
  return age;
}

export function writeAuthCookie() {
  if (!isBrowser()) return;
  const expires = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000).toUTCString();
  document.cookie = AUTH_COOKIE + '=1; path=/; max-age=' + SESSION_MAX_AGE_SECONDS + '; expires=' + expires + '; SameSite=Lax';
}

export function hasAuthCookie() {
  if (!isBrowser()) return false;
  return document.cookie.split(';').some((item) => item.trim().startsWith(AUTH_COOKIE + '=1'));
}

export function readRegisteredUsers() {
  if (!isBrowser()) return [];
  try {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    return Array.isArray(users) ? users : [];
  } catch {
    localStorage.removeItem(USERS_KEY);
    return [];
  }
}

export function saveRegisteredUser(user) {
  if (!isBrowser()) return user;
  const email = normalizeEmail(user.email);
  const safeUser = { ...user, email };
  const users = readRegisteredUsers().filter((item) => normalizeEmail(item.email) !== email);
  users.push(safeUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return safeUser;
}

export function findRegisteredUser(email) {
  const target = normalizeEmail(email);
  return readRegisteredUsers().find((item) => normalizeEmail(item.email) === target) || null;
}

export function setAuthSession(user) {
  if (!isBrowser()) return;
  const safeUser = saveRegisteredUser(user);
  localStorage.setItem(USER_KEY, JSON.stringify(safeUser));
  localStorage.removeItem('user');
  localStorage.removeItem('isLoggedIn');
  writeAuthCookie();
}

export function clearAuthSession({ keepRegisteredUser = true } = {}) {
  if (!isBrowser()) return;
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('user');
  if (!keepRegisteredUser) localStorage.removeItem(USERS_KEY);
  document.cookie = AUTH_COOKIE + '=; path=/; max-age=0; SameSite=Lax';
}

export function getStoredUser() {
  if (!isBrowser()) return null;
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

export function restoreSessionFromLocalUser() {
  const user = getStoredUser();
  if (user?.ageVerified) {
    writeAuthCookie();
    return user;
  }
  return null;
}

export function getAuthState() {
  if (!isBrowser()) return { authed: false, user: null };
  const user = getStoredUser();
  const cookie = hasAuthCookie();

  if (user?.ageVerified && !cookie) {
    writeAuthCookie();
    return { authed: true, user, restored: true };
  }

  return { authed: Boolean(cookie && user?.ageVerified), user };
}

export function createOwnerUser() {
  return {
    username: 'Owner',
    email: 'owner@local.dev',
    password: 'Owner2026!',
    dateOfBirth: '1990-01-01',
    ageVerified: true,
    plan: 'Owner',
    createdAt: new Date().toISOString(),
  };
}
