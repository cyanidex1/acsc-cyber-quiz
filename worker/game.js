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
export const MAX_QUIZ_ATTEMPTS = 3
const GAMES = new Set(['quiz', 'firewall'])
const MAX_SCORE = 1000000

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
    e.score <= MAX_SCORE &&
    typeof e.total === 'number' &&
    e.total >= 0 &&
    e.total <= MAX_SCORE &&
    typeof e.rankTitle === 'string' &&
    e.rankTitle.length <= 40 &&
    typeof e.ts === 'number' &&
    (e.game === undefined || GAMES.has(e.game))
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

    // ── contestant: submit a score ────────────────────────────────
    // quiz consumes one of MAX_QUIZ_ATTEMPTS; firewall is unlimited.
    // Best score per (name, game) stays on the board.
    if (url.pathname === '/leaderboard' && method === 'POST') {
      const { token, entry } = body || {}
      const t = this.getToken(token)
      if (!t) return json({ error: 'invalid or expired token' }, 404)
      if (t.status !== 'active') {
        return json(
          { error: t.status === 'pending' ? 'token not claimed for a session' : 'token already used' },
          t.status === 'pending' ? 409 : 410,
        )
      }
      if (!validEntry(entry)) return json({ error: 'invalid entry' }, 400)

      const game = entry.game || 'quiz'
      if (game === 'quiz') {
        const used = t.quizAttempts || 0
        if (used >= MAX_QUIZ_ATTEMPTS) {
          return json({ error: 'quiz attempts exhausted', attemptsLeft: 0 }, 410)
        }
        t.quizAttempts = used + 1
      }
      const attemptsLeft = game === 'quiz' ? MAX_QUIZ_ATTEMPTS - (t.quizAttempts || 0) : null

      const key = entry.name.trim().toLowerCase()
      const incoming = { ...entry, game }
      const existing = this.board.find(
        (e) => e.name.trim().toLowerCase() === key && (e.game || 'quiz') === game,
      )
      // keep the better score for this name+game; a fresh ts wins ties so
      // the player's own view always reflects their latest run
      const kept =
        existing && existing.score > incoming.score ? existing : { ...incoming, ts: Date.now() }
      this.board = sortBoard([
        ...this.board.filter(
          (e) => !(e.name.trim().toLowerCase() === key && (e.game || 'quiz') === game),
        ),
        kept,
      ]).slice(0, MAX_ENTRIES)
      await this.persist()
      this.broadcast('board', { board: this.board })
      return json({ board: this.board, attemptsLeft, best: kept.score })
    }

    // ── contestant: claim a token (fires the moment a scanned URL opens) ──
    // Idempotent on 'active' — a page reload mid-session must not kill a
    // contestant who still has attempts left.
    if (url.pathname === '/session/start' && method === 'POST') {
      const t = this.getToken(body?.token)
      if (!t) return json({ error: 'invalid or expired token' }, 404)
      if (t.status === 'active') return json({ ok: true, expiresIn: Math.max(0, (t.expiresAt - Date.now()) / 1000) })
      t.status = 'active'
      await this.persist()
      this.broadcast('claimed', { token: body.token })
      return json({ ok: true, expiresIn: TOKEN_TTL_MS / 1000 })
    }

    // ── contestant: session state for the game-select screen ──────
    if (url.pathname === '/session/info' && method === 'POST') {
      const t = this.getToken(body?.token)
      if (!t) return json({ error: 'invalid or expired token' }, 404)
      return json({
        status: t.status,
        quizAttempts: t.quizAttempts || 0,
        maxQuizAttempts: MAX_QUIZ_ATTEMPTS,
        expiresAt: t.expiresAt,
      })
    }

    // ── admin: mint a token for the QR ────────────────────────────
    if (url.pathname === '/token' && method === 'POST') {
      this.gc()
      const token = crypto.randomUUID().replace(/-/g, '')
      this.tokens.set(token, { status: 'pending', expiresAt: Date.now() + TOKEN_TTL_MS, quizAttempts: 0 })
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
