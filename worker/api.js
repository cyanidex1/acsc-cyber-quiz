/**
 * ACSC Cyber Quiz — leaderboard + single-use participation tokens.
 * (Cloudflare Worker + KV)
 *
 * CONTESTANT side (no booth key needed):
 *   GET  /leaderboard              -> top 10 (public read)
 *   POST /session/start  {token}   -> claim a pending token for an attempt
 *   POST /leaderboard    {token, entry} -> save score, BURNS the token (one shot)
 *
 * ADMIN side (requires X-Booth-Key):
 *   POST /token                    -> mint a fresh single-use token for the QR
 *   POST /token/status   {token}   -> {status: pending|active|burned|unknown}
 *   DELETE /leaderboard?ts=N       -> remove one entry
 *   DELETE /leaderboard            -> wipe the board
 *
 * Token lifecycle: pending → active (claimed at quiz start) → burned (submitted).
 * Tokens expire after TOKEN_TTL seconds.
 */

const MAX_ENTRIES = 10
const TOKEN_TTL = 900 // 15 minutes

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

async function getBoard(env) {
  return sortBoard((await env.LEADERBOARD.get('board', 'json')) || [])
}

async function putBoard(env, board) {
  await env.LEADERBOARD.put('board', JSON.stringify(board))
}

const tokenKey = (t) => `t:${t}`

async function getToken(env, token) {
  if (typeof token !== 'string' || token.length < 16 || token.length > 64) return null
  return (await env.LEADERBOARD.get(tokenKey(token), 'json')) || null
}

async function putToken(env, token, status) {
  await env.LEADERBOARD.put(tokenKey(token), JSON.stringify({ status }), {
    expirationTtl: TOKEN_TTL,
  })
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

    const authed = request.headers.get('X-Booth-Key') === env.BOOTH_KEY
    let body = null
    if (request.method === 'POST') {
      try {
        body = await request.json()
      } catch {
        return json({ error: 'bad json' }, 400, cors)
      }
    }

    // ── public: leaderboard read ──────────────────────────────────
    if (url.pathname === '/leaderboard' && request.method === 'GET') {
      return json((await getBoard(env)).slice(0, MAX_ENTRIES), 200, cors)
    }

    // ── contestant: submit score (burns the token, one shot) ──────
    if (url.pathname === '/leaderboard' && request.method === 'POST') {
      const { token, entry } = body || {}
      const t = await getToken(env, token)
      if (!t) return json({ error: 'invalid or expired token' }, 404, cors)
      if (t.status === 'burned') return json({ error: 'token already used' }, 410, cors)
      if (t.status !== 'active') return json({ error: 'token not claimed for a session' }, 409, cors)
      if (!validEntry(entry)) return json({ error: 'invalid entry' }, 400, cors)

      await putToken(env, token, 'burned')
      const key = entry.name.trim().toLowerCase()
      const board = sortBoard([
        ...(await getBoard(env)).filter((e) => e.name.trim().toLowerCase() !== key),
        entry,
      ]).slice(0, MAX_ENTRIES)
      await putBoard(env, board)
      return json(board, 200, cors)
    }

    // ── contestant: claim a token to start an attempt ─────────────
    if (url.pathname === '/session/start' && request.method === 'POST') {
      const t = await getToken(env, body?.token)
      if (!t) return json({ error: 'invalid or expired token' }, 404, cors)
      if (t.status === 'burned') return json({ error: 'token already used' }, 410, cors)
      if (t.status === 'active') return json({ error: 'token already in use' }, 409, cors)
      await putToken(env, body.token, 'active')
      return json({ ok: true, expiresIn: TOKEN_TTL }, 200, cors)
    }

    // ── admin: mint a token for the QR ────────────────────────────
    if (url.pathname === '/token' && request.method === 'POST') {
      if (!authed) return json({ error: 'invalid or missing booth key' }, 401, cors)
      const token = crypto.randomUUID().replace(/-/g, '')
      await putToken(env, token, 'pending')
      return json({ token }, 200, cors)
    }

    // ── admin: check a token's status (drives QR rotation) ────────
    if (url.pathname === '/token/status' && request.method === 'POST') {
      if (!authed) return json({ error: 'invalid or missing booth key' }, 401, cors)
      const t = await getToken(env, body?.token)
      return json({ status: t ? t.status : 'unknown' }, 200, cors)
    }

    // ── admin: board management ───────────────────────────────────
    if (url.pathname === '/leaderboard' && request.method === 'DELETE') {
      if (!authed) return json({ error: 'invalid or missing booth key' }, 401, cors)
      const ts = url.searchParams.get('ts')
      const board =
        ts === null ? [] : (await getBoard(env)).filter((e) => String(e.ts) !== ts)
      await putBoard(env, board)
      return json(board, 200, cors)
    }

    return json({ error: 'not found' }, 404, cors)
  },
}
