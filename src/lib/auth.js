export const TOKEN_KEY = "token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated() {
  return Boolean(getToken());
}

export function extractToken(response) {
  return response?.token || response?.accessToken || response?.data?.token;
}

export function extractUser(response) {
  return response?.user || response?.data?.user || response?.data || response;
}

export function getApiErrorMessage(error, fallback = "Xatolik yuz berdi") {
  if (typeof error?.data === "string") return error.data;
  return error?.data?.message || error?.data?.error || fallback;
}
