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
  if (!path) return "";
  if (path.startsWith("http")) return path;

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (import.meta.env.DEV) {
    return normalizedPath;
  }

  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5757";
  return `${baseUrl}${normalizedPath}`;
}
