export const PASSWORD_HINT = "Parol kamida 8 belgi, katta va kichik harf, raqam va maxsus belgi bo‘lishi kerak";

export function isStrongPassword(value) {
  return value.length >= 8 && /[a-z]/.test(value) && /[A-Z]/.test(value)
    && /[0-9]/.test(value) && /[^a-zA-Z0-9\s]/.test(value);
}

export function validateImage(file) {
  if (!file.type.startsWith("image/")) return "Faqat rasm faylini tanlang";
  if (file.size > 10 * 1024 * 1024) return "Rasm hajmi 10 MB dan oshmasligi kerak";
  return "";
}

export function escapeSearch(value) {
  return value.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
