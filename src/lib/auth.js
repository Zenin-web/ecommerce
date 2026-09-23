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

/**
 * AuthModel'da profil rasmi maydoni `profile_image` (snake_case) deb
 * saqlanadi. Boshqa nomlar bilan ham moslikni saqlash uchun barchasi
 * tekshiriladi.
 */
export function extractProfileImage(user) {
  return user?.profile_image || user?.profileImg || user?.profileImage || user?.avatar || "";
}

export function getApiErrorMessage(error, fallback = "Xatolik yuz berdi") {
  if (typeof error?.data === "string") return error.data;
  // Backend (errorMiddleware) har doim { success:false, msg } ko'rinishida
  // xato qaytaradi, shuning uchun `msg` birinchi tekshiriladi.
  return (
    error?.data?.msg ||
    error?.data?.message ||
    error?.data?.error ||
    fallback
  );
}

/**
 * Backend /upload/file javobidan fayl yo'lini (file_path) ajratib oladi.
 * Haqiqiy backend javobi: { success: true, file: { file_type, file_path } }
 * Boshqa mumkin bo'lgan shakllar bilan ham moslikni saqlash uchun
 * bir nechta variant tekshiriladi.
 */
export function extractUploadPath(response) {
  return (
    response?.file?.file_path ||
    response?.file?.path ||
    response?.file_path ||
    response?.path ||
    response?.filePath ||
    response?.url ||
    response?.data?.file_path ||
    response?.data?.path ||
    response?.data?.filePath ||
    response?.data?.url
  );
}
