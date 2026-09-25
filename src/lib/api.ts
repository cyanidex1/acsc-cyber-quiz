import { API_URL } from '@/config'
import type { LeaderboardEntry } from '@/types/leaderboard'

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function raw(path: string, init: RequestInit = {}, key?: string): Promise<Response> {
  return fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(key ? { 'X-Booth-Key': key } : {}),
      ...(init.headers ?? {}),
    },
  })
}

async function toJson(res: Response): Promise<unknown> {
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    const msg =
      data && typeof data === 'object' && 'error' in data
        ? String((data as { error: unknown }).error)
        : `api error ${res.status}`
    throw new ApiError(res.status, msg)
  }
  return data
}

/* ── public (contestant) ─────────────────────────────────────── */

export function getBoard(): Promise<LeaderboardEntry[]> {
  return raw('/leaderboard').then(toJson) as Promise<LeaderboardEntry[]>
}

export function startSession(token: string): Promise<void> {
  return raw('/session/start', { method: 'POST', body: JSON.stringify({ token }) })
    .then(toJson)
    .then(() => undefined)
}

export function submitScore(token: string, entry: LeaderboardEntry): Promise<LeaderboardEntry[]> {
  return raw('/leaderboard', { method: 'POST', body: JSON.stringify({ token, entry }) }).then(
    toJson,
  ) as Promise<LeaderboardEntry[]>
}

/* ── admin (booth key) ───────────────────────────────────────── */

export function mintToken(boothKey: string): Promise<{ token: string }> {
  return raw('/token', { method: 'POST' }, boothKey).then(toJson) as Promise<{ token: string }>
}

export function tokenStatus(
  boothKey: string,
  token: string,
): Promise<{ status: 'pending' | 'active' | 'burned' | 'unknown' }> {
  return raw('/token/status', { method: 'POST', body: JSON.stringify({ token }) }, boothKey).then(
    toJson,
  ) as Promise<{ status: 'pending' | 'active' | 'burned' | 'unknown' }>
}

/** validates the key — used by the admin key gate */
export async function checkAdminKey(boothKey: string): Promise<void> {
  await raw('/leaderboard').then(toJson) // public sanity check
  const res = await raw('/token/status', { method: 'POST', body: '{}' }, boothKey)
  if (res.status === 401 || res.status === 403) throw new ApiError(401, 'invalid booth key')
  if (!res.ok) throw new ApiError(res.status, 'api error')
}

export function removeEntry(boothKey: string, ts: number): Promise<LeaderboardEntry[]> {
  return raw(`/leaderboard?ts=${ts}`, { method: 'DELETE' }, boothKey).then(toJson) as Promise<
    LeaderboardEntry[]
  >
}

export function clearBoard(boothKey: string): Promise<LeaderboardEntry[]> {
  return raw('/leaderboard', { method: 'DELETE' }, boothKey).then(toJson) as Promise<
    LeaderboardEntry[]
  >
}
