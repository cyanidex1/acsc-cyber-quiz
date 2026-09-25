import { useEffect, useState } from 'react'
import { Leaderboard } from '@/components/Leaderboard'
import { getBoard } from '@/lib/api'
import type { LeaderboardEntry } from '@/types/leaderboard'

/** shown when the scanned QR is used, expired, or invalid */
export function ContestantInvalid() {
  const [board, setBoard] = useState<LeaderboardEntry[]>([])
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading')

  useEffect(() => {
    getBoard()
      .then((b) => {
        setBoard(b)
        setStatus('ok')
      })
      .catch(() => setStatus('error'))
  }, [])

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center px-4 py-10 sm:px-8">
      <div className="bezel anim-pop w-full overflow-hidden">
        <div className="scan-band" />
        <div className="p-8 text-center sm:p-10">
          <p className="text-[9px] tracking-[0.4em] text-[hsl(135,32%,58%)]">▸ SESSION TERMINATED</p>
          <h1 className="font-crt glow-danger mt-3 text-5xl leading-none text-red-500 sm:text-6xl">
            QR CODE REJECTED
          </h1>
          <p className="halo mx-auto mt-4 max-w-md text-sm font-medium leading-relaxed text-[hsl(136,70%,85%)]">
            This QR session is already used, claimed by another player, or expired.
            Every run needs a fresh scan — that's what keeps the contest fair.
          </p>
          <p className="blink-caret mt-6 text-[10px] tracking-[0.35em] text-[hsl(135,32%,58%)]">
            SCAN THE BOOTH QR TO PLAY
          </p>
        </div>
      </div>

      <div className="anim-slide-up mt-6 w-full" style={{ animationDelay: '0.15s' }}>
        <Leaderboard entries={board} status={status} title="LEADERBOARD" />
      </div>
    </div>
  )
}
