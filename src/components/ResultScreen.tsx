import { useEffect, useRef, useState } from 'react'
import { rankForScore } from '@/lib/ranks'
import { getBoard, submitScore } from '@/lib/api'
import { useScramble } from '@/hooks/useScramble'
import { Leaderboard } from '@/components/Leaderboard'
import type { LeaderboardEntry } from '@/types/leaderboard'

interface Props {
  playerName: string
  score: number
  total: number
  token: string
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

export function ResultScreen({ playerName, score, total, token }: Props) {
  const rank = rankForScore(score)
  const displayScore = useCountUp(score)
  const [rankRevealed, setRankRevealed] = useState(false)
  const scrambledRank = useScramble(rank.title, rankRevealed, 45)
  const [board, setBoard] = useState<LeaderboardEntry[]>([])
  const [boardStatus, setBoardStatus] = useState<'loading' | 'ok' | 'error'>('loading')
  const [syncError, setSyncError] = useState(false)
  const submittedRef = useRef(false)

  // decode the clearance once the score finishes counting
  useEffect(() => {
    const id = setTimeout(() => setRankRevealed(true), 1700)
    return () => clearTimeout(id)
  }, [])

  // transmit the score once — the token is BURNED by the server (one shot)
  useEffect(() => {
    if (submittedRef.current) return
    submittedRef.current = true
    const entry: LeaderboardEntry = {
      name: playerName,
      score,
      total,
      rankTitle: rank.title,
      ts: Date.now(),
    }
    submitScore(token, entry)
      .then((b) => {
        setBoard(b)
        setBoardStatus('ok')
      })
      .catch(() => {
        setSyncError(true)
        setBoardStatus('error')
      })
  }, [token, playerName, score, total, rank.title])

  /* keep the board fresh while the contestant admires their rank —
     new scores from other players appear without a reload */
  useEffect(() => {
    if (syncError) return
    const id = setInterval(() => {
      getBoard()
        .then((b) => {
          setBoard(b)
          setBoardStatus('ok')
        })
        .catch(() => {})
    }, 10000)
    return () => clearInterval(id)
  }, [syncError])

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

          <div className="mt-4">
            <div className="font-crt glow-strong text-[7rem] leading-none tabular-nums text-[#00ff41] sm:text-[9rem]">
              {displayScore}
              <span className="text-4xl text-[hsl(135,32%,55%)]">/{total}</span>
            </div>
            <p className="mt-2 text-[9px] tracking-[0.4em] text-[hsl(135,32%,58%)]">
              THREATS NEUTRALIZED
            </p>
          </div>

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

          <p className="blink-caret mt-8 text-[10px] tracking-[0.35em] text-[hsl(135,32%,58%)]">
            SCAN THE BOOTH QR TO PLAY AGAIN
          </p>
        </div>
      </div>

      <div className="anim-slide-up mt-6 w-full" style={{ animationDelay: '0.2s' }}>
        <Leaderboard entries={board} status={boardStatus} title="LEADERBOARD" />
      </div>
    </div>
  )
}
