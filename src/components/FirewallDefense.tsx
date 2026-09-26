import { useEffect, useRef, useState } from 'react'
import { submitScore } from '@/lib/api'
import { firewallRankForScore } from '@/lib/ranks'
import { useScramble } from '@/hooks/useScramble'

/* ── logical playfield (canvas scales to fit, coords stay logical) ── */
const W = 480
const H = 640
const LANES = 4
const LANE_W = W / LANES
const SERVER_Y = 556
const HIT_RADIUS = 48
const MAX_SHIELDS = 3
const COMBO_WINDOW_MS = 1600

type PacketKind = 'malware' | 'clean' | 'bonus'

/* named packet types — read the traffic like a real analyst */
const PACKET_NAMES: Record<PacketKind, string[]> = {
  malware: ['RANSOMWARE', 'TROJAN', 'SPYWARE', 'WORM', 'BOTNET', 'ROOTKIT'],
  clean: ['HTTPS WEB', 'EMAIL', 'BACKUP', 'UPDATE', 'DNS QUERY', 'VOIP CALL'],
  bonus: ['BOUNTY PATCH'],
}

interface Packet {
  id: number
  lane: number
  y: number
  kind: PacketKind
  name: string
  speedMul: number
  age: number
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  max: number
  color: string
}

interface World {
  packets: Packet[]
  particles: Particle[]
  score: number
  combo: number
  comboAt: number
  shields: number
  elapsed: number
  spawnAcc: number
  idCounter: number
  shake: number
  /** eased global packet speed — starts slow, ramps gradually, never jerks */
  speedSmooth: number
}

function freshWorld(): World {
  return {
    packets: [],
    particles: [],
    score: 0,
    combo: 0,
    comboAt: 0,
    shields: MAX_SHIELDS,
    elapsed: 0,
    spawnAcc: 0,
    idCounter: 1,
    shake: 0,
    speedSmooth: START_SPEED,
  }
}

/* speed model: brisk start, steep eased ramp, then a HARD plateau —
   at max speed packets cross in ~2s, which caps runs at 3-4 minutes */
const START_SPEED = 80
const SPEED_RAMP = 4.2 // px/s gained per second of play
const MAX_SPEED = 270 // the "hold" — reached around the 45s mark

const COLORS: Record<PacketKind, { stroke: string; fill: string; glyph: string; glyphColor: string; labelColor: string }> = {
  malware: { stroke: '#ff3b3b', fill: 'rgba(255,59,59,0.14)', glyph: '✕', glyphColor: '#ff7b7b', labelColor: '#ff9d9d' },
  clean: { stroke: '#00ff41', fill: 'rgba(0,255,65,0.10)', glyph: '✓', glyphColor: '#7bffa4', labelColor: '#9dffc0' },
  bonus: { stroke: '#ffb020', fill: 'rgba(255,176,32,0.16)', glyph: '★', glyphColor: '#ffd27b', labelColor: '#ffe0a3' },
}

function spawnPacket(w: World) {
  const r = Math.random()
  const bonusP = 0.05
  const malwareP = Math.min(0.58, 0.34 + w.elapsed * 0.002)
  const kind: PacketKind = r < bonusP ? 'bonus' : r < bonusP + malwareP ? 'malware' : 'clean'
  const names = PACKET_NAMES[kind]
  // avoid impossible walls: max 3 of 4 lanes occupied near the top
  const occupied = new Set(w.packets.filter((p) => p.y < 120).map((p) => p.lane))
  const free = Array.from({ length: LANES }, (_, i) => i).filter((i) => !occupied.has(i))
  const lanes = free.length > 0 ? free : [Math.floor(Math.random() * LANES)]
  w.packets.push({
    id: w.idCounter++,
    lane: lanes[Math.floor(Math.random() * lanes.length)],
    y: -30,
    kind,
    name: names[Math.floor(Math.random() * names.length)],
    speedMul: 0.85 + Math.random() * 0.3,
    age: 0,
  })
}

function burst(w: World, x: number, y: number, color: string, n: number) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2
    const s = 60 + Math.random() * 160
    w.particles.push({
      x,
      y,
      vx: Math.cos(a) * s,
      vy: Math.sin(a) * s,
      life: 0.5,
      max: 0.5,
      color,
    })
  }
}

function drawFrame(ctx: CanvasRenderingContext2D, w: World, t: number) {
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#040a06'
  ctx.fillRect(0, 0, W, H)

  ctx.save()
  if (w.shake > 0) {
    const s = w.shake * 10
    ctx.translate((Math.random() - 0.5) * s, (Math.random() - 0.5) * s)
  }

  /* lane separators + soft lane tints + scrolling flow dashes —
     the dashes glide downward with traffic speed for a smooth track feel */
  ctx.strokeStyle = 'rgba(0,255,65,0.07)'
  ctx.lineWidth = 1
  for (let i = 1; i < LANES; i++) {
    ctx.beginPath()
    ctx.moveTo(i * LANE_W, 0)
    ctx.lineTo(i * LANE_W, SERVER_Y)
    ctx.stroke()
  }
  ctx.strokeStyle = 'rgba(0,255,65,0.06)'
  ctx.lineWidth = 10
  for (let i = 0; i < LANES; i++) {
    const cx = i * LANE_W + LANE_W / 2
    ctx.beginPath()
    ctx.moveTo(cx, 0)
    ctx.lineTo(cx, SERVER_Y)
    ctx.stroke()
  }
  ctx.strokeStyle = 'rgba(0,255,65,0.16)'
  ctx.lineWidth = 2
  ctx.setLineDash([4, 22])
  ctx.lineDashOffset = -((t * 60) % 26)
  for (let i = 0; i < LANES; i++) {
    const cx = i * LANE_W + LANE_W / 2
    ctx.beginPath()
    ctx.moveTo(cx, 0)
    ctx.lineTo(cx, SERVER_Y)
    ctx.stroke()
  }
  ctx.setLineDash([])
  ctx.fillStyle = 'rgba(0,255,65,0.35)'
  ctx.font = '11px "JetBrains Mono", monospace'
  ctx.textAlign = 'center'
  ctx.fillText('— INBOUND TRAFFIC —', W / 2, 22)

  /* packets — named: glyph + traffic type label, bold for legibility */
  for (const p of w.packets) {
    const c = COLORS[p.kind]
    const x = p.lane * LANE_W + LANE_W / 2
    ctx.save()
    ctx.shadowColor = c.stroke
    ctx.shadowBlur = 12
    ctx.fillStyle = c.fill
    ctx.strokeStyle = c.stroke
    ctx.lineWidth = 2
    const pw = 78
    const ph = 54
    ctx.beginPath()
    ctx.roundRect(x - pw / 2, p.y - ph / 2, pw, ph, 7)
    ctx.fill()
    ctx.stroke()
    ctx.shadowBlur = 0
    ctx.fillStyle = c.glyphColor
    ctx.font = 'bold 24px "JetBrains Mono", monospace'
    ctx.fillText(c.glyph, x, p.y - 3)
    ctx.fillStyle = c.labelColor
    ctx.font = 'bold 11px "JetBrains Mono", monospace'
    ctx.fillText(p.name, x, p.y + 17)
    ctx.restore()
  }

  /* particles */
  for (const pt of w.particles) {
    ctx.globalAlpha = Math.max(0, pt.life / pt.max)
    ctx.fillStyle = pt.color
    ctx.fillRect(pt.x - 2, pt.y - 2, 4, 4)
  }
  ctx.globalAlpha = 1

  /* server perimeter wall */
  ctx.fillStyle = 'rgba(0,255,65,0.12)'
  ctx.fillRect(0, SERVER_Y, W, 6)
  ctx.fillStyle = 'rgba(0,255,65,0.5)'
  const block = 10
  for (let x = 4 + ((t * 30) % (block * 2)); x < W; x += block * 2) {
    ctx.fillRect(x, SERVER_Y + 10, block, 8)
  }
  ctx.fillStyle = 'rgba(0,255,65,0.55)'
  ctx.font = '12px "JetBrains Mono", monospace'
  ctx.fillText('▲ SERVER PERIMETER ▲', W / 2, SERVER_Y + 40)

  ctx.restore()
}

interface Props {
  playerName: string
  token: string
  onExit: () => void
}

type Phase = 'ready' | 'playing' | 'over'

export function FirewallDefense({ playerName, token, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>('ready')
  const [hud, setHud] = useState({ score: 0, shields: MAX_SHIELDS, level: 1, combo: 0 })
  const [finalScore, setFinalScore] = useState(0)
  const [best, setBest] = useState<number | null>(null)
  const [syncError, setSyncError] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const worldRef = useRef<World>(freshWorld())
  const phaseRef = useRef<Phase>('ready')
  phaseRef.current = phase
  const hudRef = useRef(hud)
  hudRef.current = hud
  const title = useScramble('FIREWALL_DEFENSE.EXE', true, 40)

  /* mirror the world into the DOM HUD only when values change */
  const syncHud = (w: World) => {
    const next = {
      score: w.score,
      shields: w.shields,
      level: 1 + Math.floor(w.elapsed / 10),
      combo: w.combo,
    }
    const prev = hudRef.current
    if (
      next.score !== prev.score ||
      next.shields !== prev.shields ||
      next.level !== prev.level ||
      next.combo !== prev.combo
    ) {
      setHud(next)
    }
  }

  /* paint a static frame for ready/over phases */
  const paintStatic = () => {
    const ctx = canvasRef.current?.getContext('2d')
    if (ctx) drawFrame(ctx, worldRef.current, 0)
  }
  useEffect(paintStatic, [phase])

  /* main loop */
  useEffect(() => {
    if (phase !== 'playing') return
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    let raf = 0
    let last = performance.now()

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const w = worldRef.current

      w.elapsed += dt
      w.shake = Math.max(0, w.shake - dt * 2)

      /* spawn — tightens faster so the plateau stays crowded */
      w.spawnAcc += dt
      const interval = Math.max(0.36, 1.05 - w.elapsed * 0.009)
      while (w.spawnAcc >= interval) {
        w.spawnAcc -= interval
        spawnPacket(w)
      }

      /* global speed — slow start, gradual ramp, eased toward target so
         the acceleration itself never lurches */
      const targetSpeed = Math.min(START_SPEED + w.elapsed * SPEED_RAMP, MAX_SPEED)
      w.speedSmooth += (targetSpeed - w.speedSmooth) * Math.min(1, dt * 1.2)

      /* advance packets — each one smoothsteps in from the top edge so
         nothing pops into existence at full velocity */
      const survivors: Packet[] = []
      for (const p of w.packets) {
        p.age += dt
        const k = Math.min(1, p.age / 0.7)
        const ease = k * k * (3 - 2 * k)
        p.y += w.speedSmooth * p.speedMul * (0.2 + 0.8 * ease) * dt
        if (p.y > SERVER_Y + 16) {
          if (p.kind === 'malware') {
            w.shields -= 1
            w.combo = 0
            w.shake = 0.4
            burst(w, p.lane * LANE_W + LANE_W / 2, SERVER_Y, '#ff3b3b', 14)
          }
          /* clean/bonus slips are free — no penalty */
        } else {
          survivors.push(p)
        }
      }
      w.packets = survivors

      /* particles */
      w.particles = w.particles.filter((pt) => {
        pt.life -= dt
        pt.x += pt.vx * dt
        pt.y += pt.vy * dt
        return pt.life > 0
      })

      drawFrame(ctx, w, w.elapsed)
      syncHud(w)

      if (w.shields <= 0) {
        setFinalScore(w.score)
        setPhase('over')
        const rank = firewallRankForScore(w.score)
        submitScore(token, {
          name: playerName,
          score: w.score,
          total: 0,
          rankTitle: rank.title,
          ts: Date.now(),
          game: 'firewall',
        })
          .then((res) => setBest(res.best))
          .catch(() => setSyncError(true))
        return
      }
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, token, playerName])

  /* tap / click — generous hit radius for fingers */
  const handlePointer = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (phaseRef.current !== 'playing') return
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * W
    const y = ((e.clientY - rect.top) / rect.height) * H
    const w = worldRef.current

    let hit: Packet | null = null
    let hitDist = HIT_RADIUS
    for (const p of w.packets) {
      const px = p.lane * LANE_W + LANE_W / 2
      const d = Math.hypot(px - x, p.y - y)
      if (d < hitDist) {
        hitDist = d
        hit = p
      }
    }
    if (!hit) return

    w.packets = w.packets.filter((p) => p.id !== hit!.id)
    const px = hit.lane * LANE_W + LANE_W / 2
    const now = performance.now()
    w.combo = now - w.comboAt < COMBO_WINDOW_MS ? w.combo + 1 : 1
    w.comboAt = now

    if (hit.kind === 'malware') {
      w.score += 100 + Math.min(w.combo, 10) * 10
      burst(w, px, hit.y, '#00ff41', 10)
    } else if (hit.kind === 'clean') {
      w.score = Math.max(0, w.score - 50)
      w.combo = 0
      w.shake = 0.25
      burst(w, px, hit.y, '#ff3b3b', 8)
    } else {
      w.score += 250
      burst(w, px, hit.y, '#ffb020', 16)
    }
    syncHud(w)
  }

  const startRun = () => {
    worldRef.current = freshWorld()
    setHud({ score: 0, shields: MAX_SHIELDS, level: 1, combo: 0 })
    setSyncError(false)
    setBest(null)
    setPhase('playing')
  }

  const rank = firewallRankForScore(finalScore)
  const lowShields = hud.shields === 1 && phase === 'playing'

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center px-4 py-8 sm:px-8">
      {/* HUD */}
      <div className="mb-3 flex items-center justify-between gap-4 text-[10px] tracking-[0.25em] text-[hsl(135,32%,58%)]">
        <span>
          OPERATOR: <span className="text-[#00ff41]">{playerName.toUpperCase()}</span>
        </span>
        <div className="flex items-center gap-4">
          <span>
            SHIELDS:{' '}
            <span
              className={`font-crt text-base ${hud.shields <= 1 ? 'glow-danger text-red-500' : 'text-[#00ff41]'}`}
            >
              {'▮'.repeat(Math.max(0, hud.shields))}
              {'▯'.repeat(Math.max(0, MAX_SHIELDS - hud.shields))}
            </span>
          </span>
          <span>
            WAVE: <span className="glow font-crt text-base text-[#00ff41]">{hud.level}</span>
          </span>
          <button
            onClick={onExit}
            title="Back to menu (run is discarded)"
            className="border border-red-500/50 bg-red-500/10 px-3 py-1.5 text-[9px] font-bold tracking-[0.25em] text-red-400 transition-colors hover:bg-red-500 hover:text-black"
          >
            ■ ABORT
          </button>
        </div>
      </div>

      <div className="bezel anim-pop relative w-full overflow-hidden">
        <div className="scan-band" />
        <div className="p-4 sm:p-6">
          <div className="mb-3 flex items-end justify-between">
            <div>
              <p className="text-[9px] tracking-[0.35em] text-[hsl(135,32%,58%)]">
                ▸ PERIMETER BREACH IMMINENT
              </p>
              <div
                className={`font-crt glow text-5xl leading-none tabular-nums text-[#00ff41] ${
                  hud.combo >= 3 ? 'glow-strong' : ''
                }`}
              >
                {hud.score}
                {hud.combo >= 2 && (
                  <span className="ml-3 text-xl text-[#ffb020]">×{hud.combo} COMBO</span>
                )}
              </div>
            </div>
            {lowShields && (
              <p className="anim-crt-flicker glow-danger text-[10px] font-bold tracking-[0.3em] text-red-500">
                [!] CRITICAL
              </p>
            )}
          </div>

          <div className="relative">
            <canvas
              ref={canvasRef}
              onPointerDown={handlePointer}
              width={W}
              height={H}
              className="block w-full cursor-crosshair touch-none select-none"
              style={{ aspectRatio: `${W} / ${H}` }}
            />

            {/* ready overlay */}
            {phase === 'ready' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 px-6 text-center">
                <h1 className="font-crt glow-strong text-4xl text-[#00ff41] sm:text-5xl">{title}</h1>
                <div className="halo mt-5 space-y-1.5 text-sm font-medium leading-relaxed text-[hsl(136,70%,85%)]">
                  <p>
                    <span className="text-[#ff6b6b]">✕ RED packets</span> = malware — tap to
                    quarantine (<span className="text-[#00ff41]">+100</span>, combos stack)
                  </p>
                  <p>
                    <span className="text-[#00ff41]">✓ GREEN packets</span> = clean traffic — do
                    NOT touch (<span className="text-red-400">−50</span>)
                  </p>
                  <p>
                    <span className="text-[#ffb020]">★ GOLD packets</span> = bounty (
                    <span className="text-[#ffb020]">+250</span>)
                  </p>
                  <p>Every malware that crosses the wall burns a shield. 3 shields. Then it's over.</p>
                  <p className="text-[hsl(135,32%,58%)]">
                    Every packet is labeled with its traffic type — read the flow, know your enemy.
                  </p>
                </div>
                <button
                  onClick={startRun}
                  className="mt-6 border border-[#00ff41]/60 bg-[#00ff41]/10 px-10 py-3 font-mono text-xs font-bold tracking-[0.3em] text-[#00ff41] transition-all hover:bg-[#00ff41] hover:text-black"
                >
                  ENGAGE DEFENSES ▸
                </button>
              </div>
            )}

            {/* game over overlay */}
            {phase === 'over' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 px-6 text-center">
                <p className="glow-danger text-[10px] font-bold tracking-[0.4em] text-red-400">
                  [!] PERIMETER BREACHED — RUN TERMINATED
                </p>
                <div className="font-crt glow-strong mt-3 text-7xl leading-none tabular-nums text-[#00ff41]">
                  {finalScore}
                </div>
                <p className="mt-2 text-[9px] tracking-[0.4em] text-[hsl(135,32%,58%)]">
                  MALWARE QUARANTINED
                </p>
                <div className="mt-5 max-w-sm border border-[#00ff41]/40 bg-black/50 px-6 py-4">
                  <p className="text-[9px] tracking-[0.4em] text-[hsl(135,32%,58%)]">RATING</p>
                  <h2 className="font-crt glow mt-1 text-3xl tracking-widest text-[#00ff41]">
                    {rank.title}
                  </h2>
                  <p className="halo mt-1 text-sm font-medium leading-relaxed text-[hsl(136,75%,82%)]">
                    {rank.blurb}
                  </p>
                  {best !== null && (
                    <p className="mt-2 text-[9px] tracking-[0.3em] text-[hsl(135,32%,58%)]">
                      ▸ PERSONAL BEST ON BOARD: {best}
                    </p>
                  )}
                  {syncError && (
                    <p className="glow-danger mt-2 text-[9px] font-bold tracking-[0.3em] text-red-400">
                      [!] TRANSMISSION FAILED — SCORE NOT SAVED
                    </p>
                  )}
                </div>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <button
                    onClick={startRun}
                    className="border border-[#00ff41]/60 bg-[#00ff41]/10 px-8 py-2.5 font-mono text-xs font-bold tracking-[0.3em] text-[#00ff41] transition-all hover:bg-[#00ff41] hover:text-black"
                  >
                    RUN IT BACK ▸
                  </button>
                  <button
                    onClick={onExit}
                    className="border border-[hsl(135,60%,20%)] px-8 py-2.5 font-mono text-xs font-bold tracking-[0.3em] text-[hsl(135,32%,58%)] transition-all hover:border-[#00ff41] hover:text-[#00ff41]"
                  >
                    MAIN MENU
                  </button>
                </div>
              </div>
            )}
          </div>

          <p className="mt-3 text-center text-[9px] tracking-[0.35em] text-[hsl(135,25%,48%)]">
            TAP THE RED ONES · SPEED RAMPS EVERY WAVE · UNLIMITED RUNS THIS SESSION
          </p>
        </div>
      </div>
    </div>
  )
}
