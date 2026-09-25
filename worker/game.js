/**
 * GameRoom — single Durable Object holding the leaderboard + token state.
 *
 * Strongly consistent: every read-after-write is immediate from any edge,
 * unlike KV (which is only consistent at the write location). This is what
 * makes the booth QR rotate the instant a contestant's scan lands, and the
 * leaderboard update immediately after a submission.
 *
 * State is kept in memory and mirrored to DO storage on every mutation,
 * so it survives restarts and hibernation.
 */

const MAX_ENTRIES = 10
const TOKEN_TTL_MS = 15 * 60 * 1000 // 15 minutes

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
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

function validToken(t) {
  return typeof t === 'string' && t.length >= 16 && t.length <= 64
}

export class GameRoom {
  constructor(state) {
    this.state = state
    this.board = []
    this.tokens = new Map()
    this.loaded = this.load()
  }

  async load() {
    const [board, tokens] = await Promise.all([
      this.state.storage.get('board'),
      this.state.storage.get('tokens'),
    ])
    if (Array.isArray(board)) this.board = board
    if (tokens) this.tokens = new Map(Object.entries(tokens))
  }

  persist() {
    return Promise.all([
      this.state.storage.put('board', this.board),
      this.state.storage.put('tokens', Object.fromEntries(this.tokens)),
    ])
  }

  /** drop expired tokens lazily on every access */
  gc() {
    const now = Date.now()
    for (const [t, v] of this.tokens) {
      if (v.expiresAt <= now) this.tokens.delete(t)
    }
  }

  getToken(token) {
    if (!validToken(token)) return null
    this.gc()
    return this.tokens.get(token) || null
  }

  async fetch(request) {
    await this.loaded
    const url = new URL(request.url)
    const method = request.method

    // ── admin: realtime push channel (WebSocket upgrade) ──────────
    if (url.pathname === '/ws') {
      if (request.headers.get('Upgrade') !== 'websocket') {
        return json({ error: 'expected websocket upgrade' }, 400)
      }
      const pair = new WebSocketPair()
      const [client, server] = Object.values(pair)
      this.state.acceptWebSocket(server)
      server.send(JSON.stringify({ type: 'hello', board: sortBoard(this.board).slice(0, MAX_ENTRIES) }))
      return new Response(null, { status: 101, webSocket: client })
    }

    let body = null
    if (method === 'POST') {
      const text = await request.text()
      if (text) {
        try {
          body = JSON.parse(text)
        } catch {
          return json({ error: 'bad json' }, 400)
        }
      }
    }

    // ── public: leaderboard read ──────────────────────────────────
    if (url.pathname === '/leaderboard' && method === 'GET') {
      return json(sortBoard(this.board).slice(0, MAX_ENTRIES))
    }

    // ── contestant: submit score (burns the token, one shot) ──────
    if (url.pathname === '/leaderboard' && method === 'POST') {
      const { token, entry } = body || {}
      const t = this.getToken(token)
      if (!t) return json({ error: 'invalid or expired token' }, 404)
      if (t.status === 'burned') return json({ error: 'token already used' }, 410)
      if (t.status !== 'active') return json({ error: 'token not claimed for a session' }, 409)
      if (!validEntry(entry)) return json({ error: 'invalid entry' }, 400)

      t.status = 'burned'
      const key = entry.name.trim().toLowerCase()
      this.board = sortBoard([
        ...this.board.filter((e) => e.name.trim().toLowerCase() !== key),
        entry,
      ]).slice(0, MAX_ENTRIES)
      await this.persist()
      this.broadcast('board', { board: this.board })
      return json(this.board)
    }

    // ── contestant: claim a token (fires the moment a scanned URL opens) ──
    if (url.pathname === '/session/start' && method === 'POST') {
      const t = this.getToken(body?.token)
      if (!t) return json({ error: 'invalid or expired token' }, 404)
      if (t.status === 'burned') return json({ error: 'token already used' }, 410)
      if (t.status === 'active') return json({ error: 'token already in use' }, 409)
      t.status = 'active'
      await this.persist()
      this.broadcast('claimed', { token: body.token })
      return json({ ok: true, expiresIn: TOKEN_TTL_MS / 1000 })
    }

    // ── admin: mint a token for the QR ────────────────────────────
    if (url.pathname === '/token' && method === 'POST') {
      this.gc()
      const token = crypto.randomUUID().replace(/-/g, '')
      this.tokens.set(token, { status: 'pending', expiresAt: Date.now() + TOKEN_TTL_MS })
      await this.persist()
      return json({ token })
    }

    // ── admin: check a token's status (drives QR rotation) ────────
    if (url.pathname === '/token/status' && method === 'POST') {
      const t = this.getToken(body?.token)
      return json({ status: t ? t.status : 'unknown' })
    }

    // ── admin: board management ───────────────────────────────────
    if (url.pathname === '/leaderboard' && method === 'DELETE') {
      const ts = url.searchParams.get('ts')
      this.board = ts === null ? [] : this.board.filter((e) => String(e.ts) !== ts)
      await this.persist()
      this.broadcast('board', { board: this.board })
      return json(this.board)
    }

    return json({ error: 'not found' }, 404)
  }

  /** push an event to every connected admin panel — realtime by default */
  broadcast(type, data) {
    const msg = JSON.stringify({ type, ...data })
    for (const ws of this.state.getWebSockets()) {
      try {
        ws.send(msg)
      } catch {
        /* connection already closing */
      }
    }
  }

  /** hibernation-safe message/close handlers (registered via acceptWebSocket) */
  webSocketMessage(_ws, message) {
    if (message === 'ping') {
      try {
        _ws.send('pong')
      } catch {
        /* ignore */
      }
    }
  }

  webSocketClose(ws) {
    try {
      ws.close()
    } catch {
      /* already closed */
    }
  }
}
