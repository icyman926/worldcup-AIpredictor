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

export function isBrowserAuthenticated() {
  if (typeof document === 'undefined') return false;
  return document.cookie.split(';').some((item) => item.trim().startsWith(AUTH_COOKIE + '=1'));
}
