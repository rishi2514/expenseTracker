import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Read .env files so the dev proxy can be configured without shell exports.
  const env = loadEnv(mode, ".", "VITE_");

  // Origin the dev server proxies /api requests to (backend default port is 5000).
  const proxyTarget = env.VITE_PROXY_TARGET || "http://localhost:5000";

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        "/api": {
          target: proxyTarget,
          changeOrigin: true,
        },
      },
    },
  };
});
