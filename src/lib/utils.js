import { API_BASE_URL } from "./apiConfig";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatPrice(value = 0) {
  return new Intl.NumberFormat("uz-UZ").format(value) + " so'm";
}

export function getDiscountedPrice(price = 0, discount = 0) {
  if (!discount) return price;

  return Math.round(price - (price * discount) / 100);
}

export function getImageUrl(path) {
  if (!path || typeof path !== "string") return "";
  if (/^https?:\/\//i.test(path)) return path;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}
