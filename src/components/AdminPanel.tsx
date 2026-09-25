import { useCallback, useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { Leaderboard } from '@/components/Leaderboard'
import { clearBoard, getBoard, mintToken, removeEntry, tokenStatus } from '@/lib/api'
import type { LeaderboardEntry } from '@/types/leaderboard'

const STATUS_POLL_MS = 1500
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
        width: 480,
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
    <div className="flex min-h-screen w-full">
      {/* LEFT — participation QR */}
      <section className="relative flex flex-col items-center justify-center gap-6 border-r border-[hsl(135,50%,12%)] px-6 py-8 md:w-1/2">
        <div className="scan-band" />
        <p className="text-[9px] tracking-[0.4em] text-[hsl(135,32%,58%)]">
          ▸ SCAN TO PLAY
        </p>
        <div
          className={`anim-slide-up border p-4 transition-all ${
            qrState === 'pending'
              ? 'border-[#00ff41]/60 shadow-[0_0_40px_rgba(0,255,65,0.2)]'
              : 'border-red-500/50'
          }`}
        >
          {qr ? (
            <img
              src={qr}
              alt="Participation QR code"
              className="h-64 w-64 sm:h-80 sm:w-80 lg:h-96 lg:w-96"
            />
          ) : (
            <div className="flex h-64 w-64 items-center justify-center text-xs text-[hsl(135,32%,58%)] sm:h-80 sm:w-80 lg:h-96 lg:w-96">
              <span className="blink-caret">GENERATING</span>
            </div>
          )}
        </div>
        <p
          className={`text-xs font-bold tracking-[0.35em] ${
            qrState === 'pending' ? 'glow text-[#00ff41]' : 'glow-danger text-red-400'
          }`}
        >
          {stateLabel}
        </p>
        <p className="max-w-xs text-center text-[10px] leading-relaxed text-[hsl(135,32%,58%)]">
          ONE SCAN · ONE RUN · AUTO-ROTATES AFTER EVERY PLAY
        </p>
        <button
          onClick={onLock}
          className="absolute bottom-4 left-4 border border-[hsl(135,60%,20%)] px-3 py-1 text-[9px] tracking-[0.3em] text-[hsl(135,32%,58%)] transition-colors hover:border-red-500/60 hover:text-red-400"
        >
          ■ LOCK
        </button>
      </section>

      {/* RIGHT — live scoreboard */}
      <section className="anim-slide-up flex flex-col px-6 py-8 md:w-1/2" style={{ animationDelay: '0.15s' }}>
        <Leaderboard
          entries={board}
          status={boardStatus}
          admin={{ onRemove: handleRemove, onReset: handleReset }}
        />
      </section>
    </div>
  )
}
