import { useEffect, useState } from 'react'
import type { LeaderboardEntry } from '@/types/leaderboard'

interface Props {
  entries: LeaderboardEntry[]
  status: 'loading' | 'ok' | 'error'
  /** admin controls — omitted for contestant read-only view */
  admin?: {
    onRemove: (ts: number) => void
    onReset: () => void
  }
  title?: string
}

export function Leaderboard({ entries, status, admin, title = 'HALL OF FAME' }: Props) {
  const [confirming, setConfirming] = useState(false)

  useEffect(() => {
    if (!confirming) return
    const id = setTimeout(() => setConfirming(false), 3000)
    return () => clearTimeout(id)
  }, [confirming])

  return (
    <div className="panel p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xs font-bold tracking-[0.3em] text-[#00ff41]">
          ▸ {title} <span className="text-[hsl(135,32%,58%)]">(ACSC SERVER)</span>
        </h2>
        {admin && status === 'ok' && entries.length > 0 && (
          <button
            onClick={() => (confirming ? admin.onReset() : setConfirming(true))}
            className={`border px-3 py-1 text-[10px] tracking-[0.2em] transition-all ${
              confirming
                ? 'border-red-500 bg-red-500/15 text-red-400'
                : 'border-[hsl(135,60%,20%)] text-[hsl(135,32%,58%)] hover:border-red-500/60 hover:text-red-400'
            }`}
          >
            {confirming ? 'CONFIRM WIPE?' : 'RESET'}
          </button>
        )}
      </div>

      {status === 'loading' && (
        <p className="py-3 text-center text-xs text-[hsl(135,32%,58%)]">
          <span className="blink-caret">ESTABLISHING UPLINK</span>
        </p>
      )}

      {status === 'error' && (
        <p className="glow-danger py-3 text-center text-xs font-bold text-red-400">
          [!] UPLINK FAILED — SERVER UNREACHABLE
        </p>
      )}

      {status === 'ok' && entries.length === 0 && (
        <p className="py-3 text-center text-xs text-[hsl(135,25%,50%)]">
          ── no operators on record. be the first. ──
        </p>
      )}

      {status === 'ok' && entries.length > 0 && (
        <ol className="space-y-1.5">
          {entries.map((e, i) => (
            <li
              key={e.ts}
              className="group flex items-center gap-3 border-b border-[hsl(135,50%,12%)] pb-1.5 text-sm last:border-0"
            >
              <span className={`w-8 font-bold ${i === 0 ? 'glow text-[#00ff41]' : 'text-[hsl(135,32%,58%)]'}`}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="halo flex-1 truncate font-medium text-[hsl(136,70%,85%)]">{e.name}</span>
              <span className="hidden text-[10px] tracking-widest text-[hsl(135,32%,58%)] sm:inline">
                {e.rankTitle}
              </span>
              <span className={`font-crt text-lg leading-none tabular-nums ${i === 0 ? 'glow text-[#00ff41]' : 'text-[hsl(136,70%,65%)]'}`}>
                {e.score}<span className="text-[hsl(135,32%,58%)]">/{e.total}</span>
              </span>
              {admin && (
                <button
                  onClick={() => admin.onRemove(e.ts)}
                  title={`Remove ${e.name}`}
                  aria-label={`Remove ${e.name} from hall of fame`}
                  className="shrink-0 border border-transparent px-1.5 text-xs text-[hsl(135,20%,45%)] opacity-60 transition-all hover:border-red-500/60 hover:text-red-400 group-hover:opacity-100"
                >
                  ✕
                </button>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
