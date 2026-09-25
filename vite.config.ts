import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [inspectAttr(), react()],
  server: {
    port: 3000,
    proxy: {
      // dev-only: route API calls to the live worker without CORS friction
      '/leaderboard': 'https://acsc-cyber-quiz-api.rayhangeno.workers.dev',
      '/token': 'https://acsc-cyber-quiz-api.rayhangeno.workers.dev',
      '/session/start': 'https://acsc-cyber-quiz-api.rayhangeno.workers.dev',
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
