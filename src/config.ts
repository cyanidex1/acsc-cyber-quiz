// Base URL of the leaderboard API origin (Cloudflare Worker), no path.
// Set VITE_API_URL in .env.production for the GitHub Pages build, e.g.:
//   VITE_API_URL=https://acsc-cyber-quiz-api.your-account.workers.dev
export const API_URL: string =
  (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:8787'

export const BOOTH_KEY_STORAGE = 'acsc-booth-key'
