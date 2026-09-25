import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { getBoard } from '@/lib/api'

interface Props {
  onUnlock: (key: string) => void
}

export function KeyGate({ onUnlock }: Props) {
  const [key, setKey] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [checking, setChecking] = useState(false)

  const submit = async () => {
    const trimmed = key.trim()
    if (!trimmed || checking) return
    setChecking(true)
    setError(null)
    try {
      await getBoard(trimmed) // key is valid only if the API accepts it
      onUnlock(trimmed)
    } catch (e) {
      setError(e instanceof Error && e.message === 'invalid booth key'
        ? 'ACCESS DENIED — invalid booth key'
        : 'LINK DOWN — cannot reach the leaderboard server')
      setChecking(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center px-4 py-10">
      <div className="bezel anim-slide-up w-full overflow-hidden">
        <div className="scan-band" />
        <div className="p-8 text-center sm:p-12">
          <p className="text-[9px] tracking-[0.4em] text-[hsl(135,32%,58%)]">
            ▸ RESTRICTED TERMINAL · AUTHORIZED PERSONNEL ONLY
          </p>
          <h1 className="font-crt glow-strong mt-3 text-5xl leading-none text-[#00ff41] sm:text-6xl">
            ACSC_SOC
          </h1>
          <p className="blink-caret mt-2 text-[10px] tracking-[0.35em] text-[hsl(135,32%,58%)]">
            ENTER ACCESS KEY TO POWER UP TERMINAL
          </p>

          <div className="mx-auto mt-8 max-w-sm">
            <Input
              value={key}
              type="password"
              maxLength={64}
              onChange={(e) => {
                setKey(e.target.value)
                setError(null)
              }}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              placeholder="••••••••••••"
              autoFocus
              className={`h-12 rounded-none border-[hsl(135,60%,20%)] bg-black/60 text-center font-mono text-lg tracking-[0.3em] text-[#00ff41] placeholder:text-[hsl(135,25%,48%)] focus-visible:ring-[#00ff41]/60 ${
                error ? 'anim-shake border-red-500' : ''
              }`}
            />
            <button
              onClick={submit}
              disabled={checking}
              className="mt-4 w-full border border-[#00ff41]/60 bg-[#00ff41]/10 px-8 py-3 text-xs font-bold tracking-[0.3em] text-[#00ff41] transition-colors hover:bg-[#00ff41] hover:text-black disabled:opacity-50"
            >
              {checking ? 'VERIFYING…' : 'AUTHENTICATE ▸'}
            </button>
            {error && (
              <p className="anim-pop glow-danger mt-3 text-xs font-bold text-red-400">
                [!] {error}
              </p>
            )}
          </div>
        </div>
      </div>
      <p className="mt-8 text-center text-[9px] tracking-[0.35em] text-[hsl(135,25%,48%)]">
        SCORES ARE STORED ON THE ACSC SERVER · ASK BOOTH STAFF FOR THE KEY
      </p>
    </div>
  )
}
