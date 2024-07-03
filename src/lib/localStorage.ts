const AUTH_TOKEN = 'auth-token';
const OAUTH_TOKEN = 'oauth-token';

export const cacheAuthToken = (token: string) => {
  localStorage.setItem(AUTH_TOKEN, token);
};
export const getCachedAuthToken = () => {
  return localStorage.getItem(AUTH_TOKEN) || '';
};

export const cacheOauthToken = (token: string) => {
  localStorage.setItem(OAUTH_TOKEN, token);
};
export const getCachedOauthToken = () => {
  return localStorage.getItem(OAUTH_TOKEN) || '';
};

export const clearCache = () => {
  localStorage.removeItem(AUTH_TOKEN);
  localStorage.removeItem(OAUTH_TOKEN);
};
