export const AUTH_COOKIE = 'wc_auth';
export const USER_KEY = 'wc_user';

export function calculateAge(dateOfBirth) {
  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) return 0;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const month = today.getMonth() - dob.getMonth();
  if (month < 0 || (month === 0 && today.getDate() < dob.getDate())) age -= 1;
  return age;
}

export function setAuthSession(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.removeItem('user');
  localStorage.removeItem('isLoggedIn');
  document.cookie = AUTH_COOKIE + '=1; path=/; max-age=2592000; SameSite=Lax';
}

export function clearAuthSession() {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('user');
  document.cookie = AUTH_COOKIE + '=; path=/; max-age=0; SameSite=Lax';
}

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

export function getAuthState() {
  if (typeof document === 'undefined') return { authed: false, user: null };
  const hasCookie = document.cookie.split(';').some((item) => item.trim().startsWith(AUTH_COOKIE + '=1'));
  const user = getStoredUser();
  if (hasCookie && !user) {
    clearAuthSession();
    return { authed: false, user: null };
  }
  return { authed: Boolean(hasCookie && user?.ageVerified), user };
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
