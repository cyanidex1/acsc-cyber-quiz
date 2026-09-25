import { useCallback, useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { Leaderboard } from '@/components/Leaderboard'
import { clearBoard, getBoard, mintToken, removeEntry, tokenStatus } from '@/lib/api'
import type { LeaderboardEntry } from '@/types/leaderboard'

const STATUS_POLL_MS = 3000
const HARD_ROTATE_MS = 60000
const BOARD_POLL_MS = 5000

type QrState = 'pending' | 'active' | 'burned' | 'unknown' | 'error' | 'loading'

interface Props {
  boothKey: string
  onLock: () => void
}

function joinUrl(token: string): string {
  const base = `${window.location.origin}${window.location.pathname}`
  return `${base}?t=${token}`
}

export function AdminPanel({ boothKey, onLock }: Props) {
  const [board, setBoard] = useState<LeaderboardEntry[]>([])
  const [boardStatus, setBoardStatus] = useState<'loading' | 'ok' | 'error'>('loading')
  const [token, setToken] = useState<string | null>(null)
  const [qr, setQr] = useState<string | null>(null)
  const [qrState, setQrState] = useState<QrState>('loading')
  const qrRef = useRef<{ token: string; born: number } | null>(null)

  /* live leaderboard */
  const refreshBoard = useCallback(async () => {
    try {
      setBoard(await getBoard())
      setBoardStatus('ok')
    } catch {
      setBoardStatus('error')
    }
  }, [])

  useEffect(() => {
    refreshBoard()
    const id = setInterval(refreshBoard, BOARD_POLL_MS)
    return () => clearInterval(id)
  }, [refreshBoard])

  /* rotating QR: mint → display; rotate once scanned/used or after 60s */
  const rotate = useCallback(async () => {
    setQrState('loading')
    try {
      const { token: fresh } = await mintToken(boothKey)
      const url = joinUrl(fresh)
      const dataUrl = await QRCode.toDataURL(url, {
        errorCorrectionLevel: 'M',
        margin: 1,
        width: 320,
        color: { dark: '#00ff41', light: '#00000000' },
      })
      qrRef.current = { token: fresh, born: Date.now() }
      setToken(fresh)
      setQr(dataUrl)
      setQrState('pending')
    } catch {
      setQrState('error')
    }
  }, [boothKey])

  useEffect(() => {
    rotate()
  }, [rotate])

  useEffect(() => {
    if (!token) return
    const id = setInterval(async () => {
      const current = qrRef.current
      if (!current) return
      // hard rotation safety net
      if (Date.now() - current.born > HARD_ROTATE_MS) return rotate()
      try {
        const { status } = await tokenStatus(boothKey, current.token)
        setQrState(status)
        if (status !== 'pending') rotate()
      } catch {
        /* network blip — keep current QR */
      }
    }, STATUS_POLL_MS)
    return () => clearInterval(id)
  }, [token, boothKey, rotate])

  const handleRemove = async (ts: number) => {
    try {
      setBoard(await removeEntry(boothKey, ts))
    } catch {
      setBoardStatus('error')
    }
  }

  const handleReset = async () => {
    try {
      setBoard(await clearBoard(boothKey))
    } catch {
      setBoardStatus('error')
    }
  }

  const stateLabel =
    qrState === 'pending'
      ? 'AWAITING SCAN'
      : qrState === 'active'
        ? 'IN USE — ROTATING…'
        : qrState === 'burned'
          ? 'USED — ROTATING…'
          : qrState === 'error'
            ? 'UPLINK ERROR — RETRYING'
            : 'GENERATING…'

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center px-4 py-8 sm:px-8">
      <div className="w-full">
        <div className="bezel anim-slide-up overflow-hidden">
          <div className="scan-band" />
          <div className="flex flex-col items-center gap-8 p-6 sm:p-10 md:flex-row md:items-start md:justify-between">
            <div className="text-center md:text-left">
              <p className="text-[9px] tracking-[0.4em] text-[hsl(135,32%,58%)]">
                ▸ ACSC SOC · BOOTH CONTROL
              </p>
              <h1 className="font-crt glow-strong mt-2 text-5xl leading-none text-[#00ff41] sm:text-6xl">
                ADMIN_PANEL
              </h1>
              <p className="mt-3 max-w-xs text-xs leading-relaxed text-[hsl(136,70%,85%)]">
                Contestants scan the QR to get a single-use session. Each scan works once —
                the code rotates after every play.
              </p>
              <button
                onClick={onLock}
                className="mt-5 border border-[hsl(135,60%,20%)] px-4 py-1.5 text-[9px] tracking-[0.3em] text-[hsl(135,32%,58%)] transition-colors hover:border-red-500/60 hover:text-red-400"
              >
                ■ LOCK TERMINAL
              </button>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div
                className={`border p-3 transition-all ${
                  qrState === 'pending'
                    ? 'border-[#00ff41]/60 shadow-[0_0_30px_rgba(0,255,65,0.15)]'
                    : 'border-red-500/50'
                }`}
              >
                {qr ? (
                  <img src={qr} alt="Participation QR code" className="h-52 w-52 sm:h-64 sm:w-64" />
                ) : (
                  <div className="flex h-52 w-52 items-center justify-center text-xs text-[hsl(135,32%,58%)] sm:h-64 sm:w-64">
                    <span className="blink-caret">GENERATING</span>
                  </div>
                )}
              </div>
              <p
                className={`text-[10px] font-bold tracking-[0.3em] ${
                  qrState === 'pending' ? 'glow text-[#00ff41]' : 'glow-danger text-red-400'
                }`}
              >
                {stateLabel}
              </p>
            </div>
          </div>
        </div>

        <div className="anim-slide-up mt-6" style={{ animationDelay: '0.15s' }}>
          <Leaderboard
            entries={board}
            status={boardStatus}
            admin={{ onRemove: handleRemove, onReset: handleReset }}
          />
        </div>
      </div>
    </div>
  )
}
