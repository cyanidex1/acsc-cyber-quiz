import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { useScramble } from '@/hooks/useScramble'
import { useTypewriter } from '@/hooks/useTypewriter'
import { startSession } from '@/lib/api'

interface Props {
  onStart: (name: string) => void
  onInvalid: () => void
}

function BootLine({ text }: { text: string }) {
  const { typed, done } = useTypewriter(text, 26, 300)
  return <span className={done ? '' : 'blink-caret'}>{typed || ' '}</span>
}

export function ContestantStart({ onStart, onInvalid }: Props) {
  const [name, setName] = useState('')
  const [error, setError] = useState(false)
  const [claiming, setClaiming] = useState(true)
  const title = useScramble('CYBER_AWARENESS.EXE', true, 40)

  /* await the boot claim fired by the inline script — it started the moment
     this HTML parsed. If that script never ran (stale cache), fall back to
     claiming here. Exactly one claim ever reaches the server. */
  useEffect(() => {
    let cancelled = false
    const token = new URLSearchParams(window.location.search).get('t') ?? ''
    const boot = (window as unknown as { __acscClaim?: Promise<boolean> }).__acscClaim
    const claim: Promise<boolean> =
      boot ?? startSession(token).then(() => true).catch(() => false)
    claim.then((ok) => {
      if (cancelled) return
      if (ok) setClaiming(false)
      else onInvalid()
    })
    return () => {
      cancelled = true
    }
  }, [onInvalid])

  const submit = () => {
    const trimmed = name.trim()
    if (!trimmed || claiming) {
      if (!trimmed) setError(true)
      return
    }
    onStart(trimmed)
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-4 py-10 sm:px-8">
      <div className="bezel anim-slide-up w-full overflow-hidden">
        <div className="scan-band" />
        <div className="p-6 sm:p-10">
          <div className="mb-3 flex items-center gap-2 text-[10px] tracking-[0.3em] text-[hsl(135,32%,58%)]">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[#00ff41] shadow-[0_0_8px_#00ff41]" />
            <BootLine
              text={claiming ? 'VERIFYING SESSION…' : 'SESSION VERIFIED · 3 QUIZ ATTEMPTS · ACSC ORIENTATION'}
            />
          </div>

          <h1 className="font-crt glow-strong text-5xl leading-none tracking-tight text-[#00ff41] sm:text-7xl">
            {title}
          </h1>
          <p className="mt-2 text-[10px] tracking-[0.35em] text-[hsl(135,32%,58%)]">
            ── THREAT READINESS EVALUATION ──
          </p>

          <div className="halo mt-7 space-y-1.5 text-sm font-medium leading-relaxed text-[hsl(136,70%,85%)]">
            <p><span className="text-[#00ff41]">$</span> whoami --verify <span className="text-white">// prove you are not the weak link</span></p>
            <p><span className="text-[#00ff41]">&gt;</span> Two training sims: the 10-question Cyber Quiz and the arcade-style Firewall Defense</p>
            <p><span className="text-[#00ff41]">&gt;</span> Quiz: 20 seconds per question, 3 attempts — best score hits the board.</p>
            <p><span className="text-[#00ff41]">&gt;</span> Firewall Defense: unlimited runs — quarantine the malware, protect the server.</p>
            <p><span className="text-[#00ff41]">&gt;</span> Your session stays live for 15 minutes per scan.</p>
          </div>

          <div className="mt-8">
            <label htmlFor="codename" className="mb-2 block text-[10px] tracking-[0.35em] text-[hsl(135,32%,58%)]">
              ENTER CODENAME_
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                id="codename"
                value={name}
                maxLength={18}
                disabled={claiming}
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
              <button
                onClick={submit}
                disabled={claiming}
                className="h-12 shrink-0 rounded-none border border-[#00ff41]/60 bg-[#00ff41]/10 px-8 font-mono text-xs font-bold tracking-[0.25em] text-[#00ff41] transition-all hover:bg-[#00ff41] hover:text-black disabled:opacity-50"
              >
                {claiming ? 'VERIFYING…' : 'INITIALIZE ▸'}
              </button>
            </div>
            {error && (
              <p className="anim-pop mt-2 text-xs text-red-400">
                [!] ERROR: codename required. Even Anonymous has a name.
              </p>
            )}
          </div>
        </div>
      </div>
      <p className="mt-8 text-center text-[9px] tracking-[0.35em] text-[hsl(135,25%,48%)]">
        ACSC UNIVERSITY ORIENTATION · ONE SESSION PER SCAN
      </p>
    </div>
  )
}
