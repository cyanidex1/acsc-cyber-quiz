/**
 * ACSC Cyber Quiz — leaderboard API (Cloudflare Worker + KV).
 *
 * Endpoints (all require header `X-Booth-Key`):
 *   GET    /leaderboard        -> top 10
 *   POST   /leaderboard        -> save entry (same-name entries are replaced), returns new board
 *   DELETE /leaderboard?ts=N   -> remove one entry, returns new board
 *   DELETE /leaderboard        -> wipe the board, returns []
 *
 * Setup:
 *   wrangler kv namespace create LEADERBOARD   # paste the id into wrangler.toml
 *   wrangler secret put BOOTH_KEY              # the shared booth key
 *   npx wrangler deploy
 */

const MAX_ENTRIES = 10

function json(data, status, cors) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...cors },
  })
}

function sortBoard(board) {
  return [...board].sort((a, b) => b.score - a.score || a.ts - b.ts)
}

function validEntry(e) {
  return (
    e &&
    typeof e.name === 'string' &&
    e.name.trim().length > 0 &&
    e.name.length <= 24 &&
    typeof e.score === 'number' &&
    e.score >= 0 &&
    e.score <= 10 &&
    typeof e.total === 'number' &&
    typeof e.rankTitle === 'string' &&
    typeof e.ts === 'number'
  )
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    const cors = {
      'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Booth-Key',
    }

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors })
    if (url.pathname !== '/leaderboard') return json({ error: 'not found' }, 404, cors)

    // ── platform lock: every operation needs the shared booth key ──
    if (request.headers.get('X-Booth-Key') !== env.BOOTH_KEY) {
      return json({ error: 'invalid or missing booth key' }, 401, cors)
    }

    const board = sortBoard((await env.LEADERBOARD.get('board', 'json')) || [])

    if (request.method === 'GET') {
      return json(board.slice(0, MAX_ENTRIES), 200, cors)
    }

    if (request.method === 'POST') {
      let entry
      try {
        entry = await request.json()
      } catch {
        return json({ error: 'bad json' }, 400, cors)
      }
      if (!validEntry(entry)) return json({ error: 'invalid entry' }, 400, cors)

      // one slot per codename: latest run replaces the previous record
      const key = entry.name.trim().toLowerCase()
      const next = sortBoard([
        ...board.filter((e) => e.name.trim().toLowerCase() !== key),
        entry,
      ]).slice(0, MAX_ENTRIES)
      await env.LEADERBOARD.put('board', JSON.stringify(next))
      return json(next, 200, cors)
    }

    if (request.method === 'DELETE') {
      const ts = url.searchParams.get('ts')
      const next = ts === null ? [] : board.filter((e) => String(e.ts) !== ts)
      await env.LEADERBOARD.put('board', JSON.stringify(next))
      return json(next, 200, cors)
    }

    return json({ error: 'method not allowed' }, 405, cors)
  },
}
