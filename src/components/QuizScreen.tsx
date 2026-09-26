import { useEffect, useRef, useState } from 'react'
import { CATEGORY_LABELS, type Question } from '@/data/questions'
import { useScramble } from '@/hooks/useScramble'

const QUESTION_TIME = 30 // seconds

interface Props {
  questions: Question[]
  playerName: string
  onFinish: (score: number) => void
  onExit: () => void
}

export function QuizScreen({ questions, playerName, onFinish, onExit }: Props) {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [locked, setLocked] = useState(false)
  const [timedOut, setTimedOut] = useState(false)
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME)
  const [score, setScore] = useState(0)
  const scoreRef = useRef(0)

  const question = questions[index]
  const total = questions.length
  const scrambledQuestion = useScramble(question.question, true, 14)
  const scrambledCategory = useScramble(CATEGORY_LABELS[question.category], true, 30)

  // keep latest onFinish without re-triggering effects
  const onFinishRef = useRef(onFinish)
  onFinishRef.current = onFinish

  // debrief stays on screen until NEXT is clicked — timer is already
  // frozen because `locked` stops the countdown below
  const advance = () => {
    if (index + 1 >= total) {
      onFinishRef.current(scoreRef.current)
    } else {
      setIndex((i) => i + 1)
      setSelected(null)
      setLocked(false)
      setTimedOut(false)
      setTimeLeft(QUESTION_TIME)
    }
  }

  // countdown — stops the moment an answer is locked (or time runs out)
  useEffect(() => {
    if (locked) return
    const id = setInterval(() => {
      setTimeLeft((t) => {
        const next = Math.max(0, t - 0.1)
        if (next <= 0) {
          clearInterval(id)
          setLocked(true)
          setTimedOut(true)
        }
        return next
      })
    }, 100)
    return () => clearInterval(id)
  }, [locked, index])

  const pick = (i: number) => {
    if (locked) return
    setSelected(i)
    setLocked(true)
    if (i === question.answerIndex) {
      const next = scoreRef.current + 1
      scoreRef.current = next
      setScore(next)
    }
  }

  const danger = timeLeft <= 5 && !locked
  const pct = (timeLeft / QUESTION_TIME) * 100
  const wasCorrect = !timedOut && selected === question.answerIndex

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center px-4 py-8 sm:px-8">
      {/* HUD */}
      <div className="mb-4 flex items-center justify-between gap-4 text-[10px] tracking-[0.25em] text-[hsl(135,32%,58%)]">
        <span>
          OPERATOR: <span className="text-[#00ff41]">{playerName.toUpperCase()}</span>
        </span>
        <div className="flex items-center gap-4">
          <span>
            NEUTRALIZED: <span data-testid="hud-score" className="glow font-crt text-base text-[#00ff41]">{String(score).padStart(2, '0')}</span>
          </span>
          <button
            onClick={onExit}
            title="Abort session (score is discarded)"
            className="border border-red-500/50 bg-red-500/10 px-3 py-1.5 text-[9px] font-bold tracking-[0.25em] text-red-400 transition-colors hover:bg-red-500 hover:text-black"
          >
            ■ ABORT
          </button>
        </div>
      </div>

      {/* progress ticks */}
      <div className="mb-5 flex flex-wrap gap-1">
        {questions.map((_, i) => (
          <span
            key={i}
            className={`h-3 w-2 transition-all duration-300 ${
              i < index
                ? 'bg-[#00ff41] shadow-[0_0_6px_#00ff41]'
                : i === index
                  ? 'bg-[#00ff41]/50'
                  : 'bg-[hsl(135,60%,18%)]'
            }`}
          />
        ))}
      </div>

      <div className="bezel anim-pop overflow-hidden" key={question.id}>
        <div className="scan-band" />
        <div className="p-6 sm:p-9">
          {/* timer — CRT digit display with phosphor flicker under pressure */}
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="mb-1 text-[9px] tracking-[0.35em] text-[hsl(135,32%,58%)]">
                INTRUSION IN PROGRESS · {scrambledCategory}
              </p>
              <div
                className={`font-crt text-6xl leading-none tabular-nums sm:text-7xl ${
                  danger ? 'anim-crt-flicker glow-danger text-red-500' : 'glow text-[#00ff41]'
                }`}
              >
                {Math.ceil(timeLeft)}
                <span className="text-3xl text-[hsl(135,32%,58%)]">s</span>
              </div>
            </div>
            <div className="mb-2 h-2 flex-1 border border-[hsl(135,60%,18%)] bg-black/70">
              <div
                className={`h-full transition-[width] duration-100 ease-linear ${
                  danger ? 'bg-red-500' : 'bg-[#00ff41]'
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          {/* question — decrypts in */}
          <p data-testid="question" data-diff={question.difficulty} data-qid={question.id} className="halo min-h-[3.5rem] text-sm font-medium leading-relaxed text-white sm:text-base">
            <span className="font-crt text-lg text-[#00ff41]">Q{index + 1}/{total}$ </span>
            {scrambledQuestion}
          </p>

          {/* options — hover inverts to phosphor, underline draws in */}
          <div className="mt-6 grid gap-2">
            {question.options.map((opt, i) => {
              const isCorrect = locked && i === question.answerIndex
              const isPickedWrong = locked && selected === i && i !== question.answerIndex
              return (
                <button
                  key={i}
                  onClick={() => pick(i)}
                  disabled={locked}
                  className={`group flex items-center gap-3 border px-4 py-3 text-left text-sm font-medium transition-colors duration-150 ${
                    isCorrect
                      ? 'anim-pop border-[#00ff41] bg-[#00ff41] text-black'
                      : isPickedWrong
                        ? 'anim-shake border-red-500 bg-red-500/15 text-red-400'
                        : locked
                          ? 'border-[hsl(135,60%,16%)] text-[hsl(135,18%,48%)]'
                          : 'underline-draw border-[hsl(135,60%,20%)] bg-black/40 text-[hsl(136,70%,88%)] hover:border-[#00ff41] hover:bg-[#00ff41] hover:text-black'
                  }`}
                >
                  <span
                    className={`shrink-0 font-crt text-lg leading-none ${
                      isCorrect ? 'text-black' : isPickedWrong ? 'text-red-400' : 'text-[hsl(135,30%,50%)] group-hover:text-black'
                    }`}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="flex-1">{opt}</span>
                  {isCorrect && <span>✔</span>}
                  {isPickedWrong && <span>✘</span>}
                </button>
              )
            })}
          </div>

          {/* instant feedback */}
          {locked && (
            <div
              className={`anim-slide-up halo mt-6 border-l-2 py-1 pl-4 text-sm font-medium leading-relaxed ${
                wasCorrect
                  ? 'border-[#00ff41] text-[hsl(136,80%,80%)]'
                  : 'border-red-500 text-red-300'
              }`}
            >
              {wasCorrect ? (
                <span className="font-bold text-[#00ff41]">[✔] THREAT NEUTRALIZED. </span>
              ) : (
                <span
                  className="glitch glow-danger font-bold text-red-400"
                  data-text={timedOut ? '[!] TIMEOUT — CONNECTION EXPOSED. ' : '[✘] BREACH DETECTED. '}
                >
                  {timedOut ? '[!] TIMEOUT — CONNECTION EXPOSED. ' : '[✘] BREACH DETECTED. '}
                </span>
              )}
              {question.explanation}
            </div>
          )}

          {locked && (
            <div className="mt-5 flex justify-end">
              <button
                onClick={advance}
                className="border border-[#00ff41]/60 bg-black/50 px-6 py-2 text-[10px] font-bold tracking-[0.3em] text-[#00ff41] transition-colors hover:bg-[#00ff41] hover:text-black"
              >
                {index + 1 >= total ? 'FINISH ▸' : 'NEXT ▸'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
