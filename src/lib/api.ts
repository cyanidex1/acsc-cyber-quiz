import { API_URL } from '@/config'
import type { LeaderboardEntry } from '@/types/leaderboard'

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function req(
  boothKey: string,
  init: RequestInit = {},
  query = '',
): Promise<LeaderboardEntry[]> {
  const res = await fetch(`${API_URL}${query}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'X-Booth-Key': boothKey,
      ...(init.headers ?? {}),
    },
  })
  if (res.status === 401 || res.status === 403) {
    throw new ApiError(res.status, 'invalid booth key')
  }
  if (!res.ok) {
    throw new ApiError(res.status, `api error ${res.status}`)
  }
  return (await res.json()) as LeaderboardEntry[]
}

/** validates the key and returns the board — used by the key gate */
export function getBoard(boothKey: string): Promise<LeaderboardEntry[]> {
  return req(boothKey)
}

export function submitScore(
  boothKey: string,
  entry: LeaderboardEntry,
): Promise<LeaderboardEntry[]> {
  return req(boothKey, { method: 'POST', body: JSON.stringify(entry) })
}

export function removeEntry(boothKey: string, ts: number): Promise<LeaderboardEntry[]> {
  return req(boothKey, { method: 'DELETE' }, `?ts=${ts}`)
}

export function clearBoard(boothKey: string): Promise<LeaderboardEntry[]> {
  return req(boothKey, { method: 'DELETE' })
}
