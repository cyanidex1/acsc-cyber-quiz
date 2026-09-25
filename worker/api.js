/**
 * ACSC Cyber Quiz — edge entry point.
 *
 * Handles CORS + booth-key auth at the edge, then forwards game traffic to
 * the GameRoom Durable Object (worker/game.js) for strongly-consistent state.
 *
 * CONTESTANT side (no booth key needed):
 *   GET  /leaderboard              -> top 10 (public read)
 *   POST /session/start  {token}   -> claim a pending token (fires on QR-open)
 *   POST /leaderboard    {token, entry} -> save score, BURNS the token (one shot)
 *
 * ADMIN side (requires X-Booth-Key):
 *   POST /token                    -> mint a fresh single-use token for the QR
 *   POST /token/status   {token}   -> {status: pending|active|burned|unknown}
 *   DELETE /leaderboard?ts=N       -> remove one entry
 *   DELETE /leaderboard            -> wipe the board
 *
 * Token lifecycle: pending → active (claimed when the scanned URL opens)
 * → burned (score submitted). Tokens expire after 15 minutes.
 */

import { GameRoom } from './game.js'

export { GameRoom }

const GAME_PATHS = ['/leaderboard', '/session/start', '/token', '/token/status', '/ws']
const ADMIN_PATHS = new Set(['/token', '/token/status'])

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    const cors = {
      'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Booth-Key',
      'Access-Control-Max-Age': '86400',
    }

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors })

    // ── admin realtime channel: websocket upgrade, key + origin checked ──
    if (url.pathname === '/ws') {
      if (request.headers.get('Origin') !== env.ALLOWED_ORIGIN) {
        return new Response(JSON.stringify({ error: 'origin not allowed' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json', ...cors },
        })
      }
      if (url.searchParams.get('k') !== env.BOOTH_KEY) {
        return new Response(JSON.stringify({ error: 'invalid or missing booth key' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json', ...cors },
        })
      }
      const stub = env.GAME.get(env.GAME.idFromName('global'))
      return stub.fetch(request)
    }

    if (GAME_PATHS.includes(url.pathname)) {
      // booth-key auth for admin endpoints, checked at the edge
      if (
        ADMIN_PATHS.has(url.pathname) ||
        (url.pathname === '/leaderboard' && request.method === 'DELETE')
      ) {
        if (request.headers.get('X-Booth-Key') !== env.BOOTH_KEY) {
          return new Response(JSON.stringify({ error: 'invalid or missing booth key' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json', ...cors },
          })
        }
      }
      const stub = env.GAME.get(env.GAME.idFromName('global'))
      const res = await stub.fetch(request)
      const out = new Response(res.body, res)
      out.headers.set('Content-Type', 'application/json')
      for (const [k, v] of Object.entries(cors)) out.headers.set(k, v)
      return out
    }

    return new Response(JSON.stringify({ error: 'not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...cors },
    })
  },
}
