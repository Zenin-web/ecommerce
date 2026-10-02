import { baseApi } from "@/store/api/baseApi/baseApi";
import { store } from "@/store/store";
import { useSyncExternalStore } from "react";

const TOKEN_KEY = "token";
const listeners = new Set();

function emitChange() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => { listeners.delete(listener); window.removeEventListener("storage", listener); };
}

function getSnapshot() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
  store.dispatch(baseApi.util.resetApiState());
  emitChange();
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  store.dispatch(baseApi.util.resetApiState());
  emitChange();
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Foydalanuvchi tizimga kirganmi yo'qmi — komponent ichida
 * reaktiv tarzda kuzatish uchun hook.
 */
export function useAuth() {
  const token = useSyncExternalStore(subscribe, getSnapshot);
  return { token, isAuthenticated: Boolean(token) };
}
