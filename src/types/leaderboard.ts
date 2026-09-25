export type GameMode = 'quiz' | 'firewall'

export interface LeaderboardEntry {
  name: string
  score: number
  total: number
  rankTitle: string
  ts: number
  /** which game produced this score — defaults to 'quiz' for old entries */
  game?: GameMode
}
