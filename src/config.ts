// Base URL of the leaderboard API (Cloudflare Worker).
// Set VITE_API_URL in .env.production for the GitHub Pages build, e.g.:
//   VITE_API_URL=https://acsc-cyber-quiz-api.your-account.workers.dev/leaderboard
export const API_URL: string =
  (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:8787/leaderboard'

export const BOOTH_KEY_STORAGE = 'acsc-booth-key'
