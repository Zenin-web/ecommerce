// Development uses the Vite proxy; production uses the configured backend origin.
export const API_BASE_URL = import.meta.env.DEV
  ? "/api"
  : (import.meta.env.VITE_API_BASE_URL || "http://localhost:8989").replace(/\/+$/, "");
