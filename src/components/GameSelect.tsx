import { useEffect, useState } from 'react'
import { sessionInfo } from '@/lib/api'
import { useScramble } from '@/hooks/useScramble'

interface Props {
  playerName: string
  token: string
  onPlayQuiz: () => void
  onPlayFirewall: () => void
  onExit: () => void
}

export function GameSelect({ playerName, token, onPlayQuiz, onPlayFirewall, onExit }: Props) {
  const [attempts, setAttempts] = useState<number | null>(null)
  const [maxAttempts, setMaxAttempts] = useState(3)
  const [expired, setExpired] = useState(false)
  const title = useScramble('SELECT_SIMULATION.EXE', true, 40)

  useEffect(() => {
    let cancelled = false
    sessionInfo(token)
      .then((info) => {
        if (cancelled) return
        setAttempts(info.quizAttempts)
        setMaxAttempts(info.maxQuizAttempts)
      })
      .catch(() => {
        if (!cancelled) setExpired(true)
      })
    return () => {
      cancelled = true
    }
  }, [token])

  const quizLeft = attempts === null ? null : Math.max(0, maxAttempts - attempts)
  const quizExhausted = quizLeft === 0

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-4 py-10 sm:px-8">
      {/* HUD */}
      <div className="mb-4 flex w-full items-center justify-between gap-4 text-[10px] tracking-[0.25em] text-[hsl(135,32%,58%)]">
        <span>
          OPERATOR: <span className="text-[#00ff41]">{playerName.toUpperCase()}</span>
        </span>
        <button
          onClick={onExit}
          title="End session"
          className="border border-red-500/50 bg-red-500/10 px-3 py-1.5 text-[9px] font-bold tracking-[0.25em] text-red-400 transition-colors hover:bg-red-500 hover:text-black"
        >
          ■ END SESSION
        </button>
      </div>

      <div className="bezel anim-slide-up w-full overflow-hidden">
        <div className="scan-band" />
        <div className="p-6 sm:p-10">
          <p className="text-[9px] tracking-[0.4em] text-[hsl(135,32%,58%)]">
            ▸ SESSION ACTIVE · CHOOSE YOUR TRAINING SIM
          </p>
          <h1 className="font-crt glow-strong mt-2 text-4xl leading-none tracking-tight text-[#00ff41] sm:text-6xl">
            {title}
          </h1>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {/* ── CYBER QUIZ ── */}
            <button
              onClick={quizExhausted ? undefined : onPlayQuiz}
              disabled={quizExhausted || attempts === null}
              className={`group border p-6 text-left transition-all duration-150 ${
                quizExhausted || attempts === null
                  ? 'cursor-not-allowed border-[hsl(135,60%,14%)] bg-black/40 opacity-50'
                  : 'underline-draw border-[hsl(135,60%,20%)] bg-black/40 hover:border-[#00ff41] hover:bg-[#00ff41] hover:text-black'
              }`}
            >
              <p className="text-[9px] tracking-[0.35em] text-[hsl(135,32%,58%)] group-hover:text-black/70">
                SIM 01 · KNOWLEDGE
              </p>
              <h2 className="font-crt glow mt-1 text-3xl text-[#00ff41] group-hover:text-black group-hover:[text-shadow:none]">
                CYBER QUIZ
              </h2>
              <p className="halo mt-3 text-sm font-medium leading-relaxed text-[hsl(136,70%,85%)] group-hover:text-black">
                10 questions — 20 seconds each. Spot the threats before they spot you.
              </p>
              <p
                className={`mt-4 text-[10px] font-bold tracking-[0.3em] ${
                  quizExhausted ? 'glow-danger text-red-400' : 'text-[#00ff41] group-hover:text-black'
                }`}
              >
                {attempts === null
                  ? 'SYNCING…'
                  : quizExhausted
                    ? '✘ ATTEMPTS EXHAUSTED'
                    : `▸ ATTEMPTS LEFT: ${quizLeft}/${maxAttempts}`}
              </p>
            </button>

            {/* ── FIREWALL DEFENSE ── */}
            <button
              onClick={onPlayFirewall}
              className="group underline-draw border border-[hsl(135,60%,20%)] bg-black/40 p-6 text-left transition-all duration-150 hover:border-[#00ff41] hover:bg-[#00ff41] hover:text-black"
            >
              <p className="text-[9px] tracking-[0.35em] text-[hsl(135,32%,58%)] group-hover:text-black/70">
                SIM 02 · REFLEXES
              </p>
              <h2 className="font-crt glow mt-1 text-3xl text-[#00ff41] group-hover:text-black group-hover:[text-shadow:none]">
                FIREWALL DEFENSE
              </h2>
              <p className="halo mt-3 text-sm font-medium leading-relaxed text-[hsl(136,70%,85%)] group-hover:text-black">
                Malware is flooding the network. Quarantine the red packets, spare the clean
                traffic, keep your 3 shields alive.
              </p>
              <p className="mt-4 text-[10px] font-bold tracking-[0.3em] text-[#00ff41] group-hover:text-black">
                ▸ UNLIMITED RUNS
              </p>
            </button>
          </div>

          {expired && (
            <p className="glow-danger anim-pop mt-5 text-center text-xs font-bold tracking-[0.25em] text-red-400">
              [!] SESSION EXPIRED — SCAN THE BOOTH QR AGAIN
            </p>
          )}

          <p className="mt-8 text-center text-[9px] tracking-[0.35em] text-[hsl(135,25%,48%)]">
            SAME SESSION · SAME CODENAME · BOTH SIMS FEED THE HALL OF FAME
          </p>
        </div>
      </div>
    </div>
  )
}
