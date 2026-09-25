import { useState } from 'react'
import { StartScreen } from '@/components/StartScreen'
import { QuizScreen } from '@/components/QuizScreen'
import { ResultScreen } from '@/components/ResultScreen'
import { KeyGate } from '@/components/KeyGate'
import { buildQuiz, type Question } from '@/data/questions'
import { BOOTH_KEY_STORAGE } from '@/config'

type Stage = 'start' | 'quiz' | 'result'

function readStoredKey(): string | null {
  try {
    return localStorage.getItem(BOOTH_KEY_STORAGE)
  } catch {
    return null
  }
}

export default function App() {
  const [boothKey, setBoothKey] = useState<string | null>(readStoredKey)
  const [stage, setStage] = useState<Stage>('start')
  const [playerName, setPlayerName] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [score, setScore] = useState(0)

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

  const start = (name: string) => {
    setPlayerName(name)
    setQuestions(buildQuiz(10))
    setScore(0)
    setStage('quiz')
  }

  const finish = (finalScore: number) => {
    setScore(finalScore)
    setStage('result')
  }

  const replay = () => {
    setStage('start')
    setQuestions([])
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
      {stage === 'start' && (
        <StartScreen boothKey={boothKey} onStart={start} onLock={lock} />
      )}
      {stage === 'quiz' && (
        <QuizScreen
          key={`${playerName}-${questions[0]?.id ?? 'q'}`}
          questions={questions}
          playerName={playerName}
          onFinish={finish}
          onExit={replay}
        />
      )}
      {stage === 'result' && (
        <ResultScreen
          playerName={playerName}
          score={score}
          total={questions.length}
          boothKey={boothKey}
          onReplay={replay}
        />
      )}
    </main>
  )
}
