import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, projectDir, "VITE_");
  const apiTarget = (
    env.VITE_API_BASE_URL || "http://localhost:8989"
  ).replace(/\/+$/, "");

  return {
    plugins: [react(), tailwindcss()],

    resolve: {
      alias: {
        "@": path.resolve(projectDir, "./src"),
      },
    },

    server: {
      port: 5173,
      strictPort: true,

      proxy: {
        "/api": {
          target: apiTarget,
          changeOrigin: true,
          rewrite: (url) => url.replace(/^\/api(?=\/|$)/, ""),
        },

        "/uploads": {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
  };
});