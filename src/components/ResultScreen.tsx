import { useEffect, useRef, useState } from 'react'
import { rankForScore } from '@/lib/ranks'
import { submitScore } from '@/lib/api'
import { useScramble } from '@/hooks/useScramble'
import type { LeaderboardEntry } from '@/types/leaderboard'

interface Props {
  playerName: string
  score: number
  total: number
  boothKey: string
  onReplay: () => void
}

function useCountUp(target: number, duration = 1300, delay = 400) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    let raf: number
    const start = performance.now() + delay
    const tick = (now: number) => {
      if (now < start) {
        raf = requestAnimationFrame(tick)
        return
      }
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(Math.round(eased * target))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration, delay])
  return value
}

export function ResultScreen({ playerName, score, total, boothKey, onReplay }: Props) {
  const rank = rankForScore(score)
  const displayScore = useCountUp(score)
  const [rankRevealed, setRankRevealed] = useState(false)
  const scrambledRank = useScramble(rank.title, rankRevealed, 45)
  const [board, setBoard] = useState<LeaderboardEntry[]>([])
  const [syncError, setSyncError] = useState(false)
  const savedRef = useRef(false)

  // decode the clearance once the score finishes counting
  useEffect(() => {
    const id = setTimeout(() => setRankRevealed(true), 1700)
    return () => clearTimeout(id)
  }, [])

  // transmit the score to the server exactly once (ref survives StrictMode double-invoke)
  useEffect(() => {
    if (savedRef.current) return
    savedRef.current = true
    const entry: LeaderboardEntry = {
      name: playerName,
      score,
      total,
      rankTitle: rank.title,
      ts: Date.now(),
    }
    submitScore(boothKey, entry)
      .then(setBoard)
      .catch(() => setSyncError(true))
  }, [boothKey, playerName, score, total, rank.title])

  const position = board.findIndex(
    (e) => e.name === playerName && e.score === score && e.rankTitle === rank.title,
  )

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center px-4 py-10 sm:px-8">
      <div className="bezel anim-pop w-full overflow-hidden">
        <div className="scan-band" />
        <div className="p-6 text-center sm:p-10">
          <p className="text-[9px] tracking-[0.4em] text-[hsl(135,32%,58%)]">
            ▸ EVALUATION COMPLETE — SESSION TERMINATED
          </p>

          {/* animated score — CRT digits */}
          <div className="mt-4">
            <div className="font-crt glow-strong text-[7rem] leading-none tabular-nums text-[#00ff41] sm:text-[9rem]">
              {displayScore}
              <span className="text-4xl text-[hsl(135,32%,55%)]">/{total}</span>
            </div>
            <p className="mt-2 text-[9px] tracking-[0.4em] text-[hsl(135,32%,58%)]">
              THREATS NEUTRALIZED
            </p>
          </div>

          {/* rank — decrypts in after the count-up */}
          <div
            className="anim-slide-up mx-auto mt-8 max-w-md border border-[#00ff41]/40 bg-black/50 px-6 py-5"
            style={{ animationDelay: '1.6s' }}
          >
            <p className="text-[9px] tracking-[0.4em] text-[hsl(135,32%,58%)]">CLEARANCE GRANTED</p>
            <h2 className="font-crt glow mt-1 min-h-[2.6rem] text-4xl tracking-widest text-[#00ff41] sm:text-5xl">
              {rankRevealed ? scrambledRank : '· · · · · · · ·'}
            </h2>
            <p className="halo mt-2 text-sm font-medium leading-relaxed text-[hsl(136,75%,82%)]">{rank.blurb}</p>
            {position >= 0 && (
              <p className="mt-3 text-[9px] tracking-[0.3em] text-[hsl(135,32%,58%)]">
                ▸ HALL OF FAME RANK: #{position + 1}
              </p>
            )}
            {syncError && (
              <p className="glow-danger mt-3 text-[9px] font-bold tracking-[0.3em] text-red-400">
                [!] TRANSMISSION FAILED — SCORE NOT SAVED ON SERVER
              </p>
            )}
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={onReplay}
              className="border border-[#00ff41]/60 bg-black/50 px-8 py-3 text-[10px] font-bold tracking-[0.3em] text-[#00ff41] transition-colors hover:bg-[#00ff41] hover:text-black"
            >
              RUN IT BACK ▸
            </button>
          </div>
        </div>
      </div>

      <p className="blink-caret mt-8 text-[10px] tracking-[0.35em] text-[hsl(135,32%,58%)]">
        AWAITING NEXT OPERATOR
      </p>
    </div>
  )
}
