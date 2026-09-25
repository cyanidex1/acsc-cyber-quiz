import { useState } from 'react'
import { QuizScreen } from '@/components/QuizScreen'
import { ResultScreen } from '@/components/ResultScreen'
import { KeyGate } from '@/components/KeyGate'
import { AdminPanel } from '@/components/AdminPanel'
import { ContestantStart } from '@/components/ContestantStart'
import { ContestantInvalid } from '@/components/ContestantInvalid'
import { GameSelect } from '@/components/GameSelect'
import { FirewallDefense } from '@/components/FirewallDefense'
import { buildQuiz, type Question } from '@/data/questions'
import { BOOTH_KEY_STORAGE } from '@/config'

function readStoredKey(): string | null {
  try {
    return localStorage.getItem(BOOTH_KEY_STORAGE)
  } catch {
    return null
  }
}

type ContestantStage = 'name' | 'select' | 'quiz' | 'game' | 'result' | 'invalid'

export default function App() {
  // participation token from the scanned QR (?t=...)
  const token = new URLSearchParams(window.location.search).get('t')

  if (token) {
    return <ContestantFlow token={token} />
  }
  return <AdminFlow />
}

/* ── contestant: one session per scanned QR ──────────────────── */

function ContestantFlow({ token }: { token: string }) {
  const [stage, setStage] = useState<ContestantStage>('name')
  const [playerName, setPlayerName] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [score, setScore] = useState(0)
  const [runKey, setRunKey] = useState(0)

  const start = (name: string) => {
    setPlayerName(name)
    setScore(0)
    setStage('select')
  }

  const playQuiz = () => {
    setQuestions(buildQuiz(10))
    setScore(0)
    setRunKey((k) => k + 1)
    setStage('quiz')
  }

  const playFirewall = () => {
    setRunKey((k) => k + 1)
    setStage('game')
  }

  if (stage === 'name') {
    return (
      <main className="relative">
        <ContestantStart onStart={start} onInvalid={() => setStage('invalid')} />
      </main>
    )
  }
  if (stage === 'invalid') {
    return (
      <main className="relative">
        <ContestantInvalid />
      </main>
    )
  }
  if (stage === 'select') {
    return (
      <main className="relative">
        <GameSelect
          playerName={playerName}
          token={token}
          onPlayQuiz={playQuiz}
          onPlayFirewall={playFirewall}
          onExit={() => setStage('invalid')}
        />
      </main>
    )
  }
  if (stage === 'quiz') {
    return (
      <main className="relative">
        <QuizScreen
          key={`${playerName}-${runKey}`}
          questions={questions}
          playerName={playerName}
          onFinish={(s) => {
            setScore(s)
            setStage('result')
          }}
          onExit={() => setStage('select')}
        />
      </main>
    )
  }
  if (stage === 'game') {
    return (
      <main className="relative">
        <FirewallDefense
          key={`fw-${runKey}`}
          playerName={playerName}
          token={token}
          onExit={() => setStage('select')}
        />
      </main>
    )
  }
  return (
    <main className="relative">
      <ResultScreen
        playerName={playerName}
        score={score}
        total={questions.length}
        token={token}
        onMenu={() => setStage('select')}
        onRetry={playQuiz}
      />
    </main>
  )
}

/* ── admin: key gate → booth control panel ───────────────────── */

function AdminFlow() {
  const [boothKey, setBoothKey] = useState<string | null>(readStoredKey)

  const unlock = (key: string) => {
    try {
      localStorage.setItem(BOOTH_KEY_STORAGE, key)
    } catch {
      /* storage unavailable — key lives for this session only */
    }
    setBoothKey(key)
  }

  const lock = () => {
    try {
      localStorage.removeItem(BOOTH_KEY_STORAGE)
    } catch {
      /* ignore */
    }
    setBoothKey(null)
  }

  if (!boothKey) {
    return (
      <main className="relative">
        <KeyGate onUnlock={unlock} />
      </main>
    )
  }
  return (
    <main className="relative">
      <AdminPanel boothKey={boothKey} onLock={lock} />
    </main>
  )
}
