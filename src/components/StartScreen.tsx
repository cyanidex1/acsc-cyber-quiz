import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Leaderboard } from '@/components/Leaderboard'
import { useTypewriter } from '@/hooks/useTypewriter'
import { useScramble } from '@/hooks/useScramble'

interface Props {
  boothKey: string
  onStart: (name: string) => void
  onLock: () => void
}

function BootLine({ text }: { text: string }) {
  const { typed, done } = useTypewriter(text, 26, 300)
  return (
    <span className={done ? '' : 'blink-caret'}>
      {typed || ' '}
    </span>
  )
}

export function StartScreen({ boothKey, onStart, onLock }: Props) {
  const [name, setName] = useState('')
  const [error, setError] = useState(false)
  const title = useScramble('CYBER_AWARENESS.EXE', true, 40)

  const submit = () => {
    const trimmed = name.trim()
    if (!trimmed) {
      setError(true)
      return
    }
    onStart(trimmed)
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-4 py-10 sm:px-8">
      <div className="bezel anim-slide-up w-full overflow-hidden">
        <div className="scan-band" />
        <div className="p-6 sm:p-10">
          {/* HUD status line, typed on boot */}
          <div className="mb-3 flex items-center gap-2 text-[10px] tracking-[0.3em] text-[hsl(135,32%,58%)]">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[#00ff41] shadow-[0_0_8px_#00ff41]" />
            <BootLine text="SOC TERMINAL // ACSC ORIENTATION BOOTH v2.4 // PHOSPHOR-9 CRT" />
          </div>

          <h1 className="font-crt glow-strong text-5xl leading-none tracking-tight text-[#00ff41] sm:text-7xl">
            {title}
          </h1>
          <p className="mt-2 text-[10px] tracking-[0.35em] text-[hsl(135,32%,58%)]">
            ── THREAT READINESS EVALUATION ──
          </p>

          <div className="halo mt-7 space-y-1.5 text-sm font-medium leading-relaxed text-[hsl(136,70%,85%)]">
            <p><span className="text-[#00ff41]">$</span> whoami --verify <span className="text-white">// prove you are not the weak link</span></p>
            <p><span className="text-[#00ff41]">&gt;</span> 10 randomized questions — phishing · passwords · 2FA · malware · public Wi-Fi</p>
            <p><span className="text-[#00ff41]">&gt;</span> 15 seconds per question. No pressure. Okay, some pressure.</p>
            <p><span className="text-[#00ff41]">&gt;</span> Instant debrief after every answer.</p>
          </div>

          {/* Name input */}
          <div className="mt-8">
            <label htmlFor="codename" className="mb-2 block text-[10px] tracking-[0.35em] text-[hsl(135,32%,58%)]">
              ENTER CODENAME_
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                id="codename"
                value={name}
                maxLength={18}
                onChange={(e) => {
                  setName(e.target.value)
                  setError(false)
                }}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
                placeholder="e.g. n1ght_owl"
                autoFocus
                className={`h-12 rounded-none border-[hsl(135,60%,20%)] bg-black/60 font-mono text-base text-[#00ff41] placeholder:text-[hsl(135,25%,48%)] focus-visible:ring-[#00ff41]/60 ${
                  error ? 'anim-shake border-red-500' : ''
                }`}
              />
              <Button
                onClick={submit}
                className="h-12 shrink-0 rounded-none border border-[#00ff41]/60 bg-[#00ff41]/10 px-8 font-mono text-xs font-bold tracking-[0.25em] text-[#00ff41] transition-all hover:bg-[#00ff41] hover:text-black"
              >
                INITIALIZE ▸
              </Button>
            </div>
            {error && (
              <p className="anim-pop mt-2 text-xs text-red-400">
                [!] ERROR: codename required. Even Anonymous has a name.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="anim-slide-up mt-8 w-full sm:px-3" style={{ animationDelay: '0.15s' }}>
        <Leaderboard boothKey={boothKey} />
      </div>

      <div className="mt-8 flex flex-col items-center gap-3">
        <p className="text-center text-[9px] tracking-[0.35em] text-[hsl(135,25%,48%)]">
          ACSC UNIVERSITY ORIENTATION · SCORES SYNC TO THE ACSC SERVER
        </p>
        <button
          onClick={onLock}
          className="border border-[hsl(135,60%,20%)] px-4 py-1.5 text-[9px] tracking-[0.3em] text-[hsl(135,32%,58%)] transition-colors hover:border-red-500/60 hover:text-red-400"
        >
          ■ LOCK TERMINAL
        </button>
      </div>
    </div>
  )
}
