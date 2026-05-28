import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useSpring, AnimatePresence } from 'framer-motion'

// ─── Star field ────────────────────────────────────────────────────────────────
interface Star { x: number; y: number; r: number; delay: number; dur: number }
function makeStars(n: number): Star[] {
  return Array.from({ length: n }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    r: 0.3 + Math.random() * 1.6,
    delay: Math.random() * 6,
    dur: 2.5 + Math.random() * 5,
  }))
}
const BG_STARS = makeStars(120)
const FG_STARS = makeStars(50)

// ─── Constellation data ────────────────────────────────────────────────────────
interface ConstellationDef {
  name: string
  symbol: string
  stars: { x: number; y: number; r: number }[]
  edges: [number, number][]
  cx: number; cy: number; scale: number
  drift: { x: number; y: number }
  driftDur: number
}
const CONSTELLATIONS: ConstellationDef[] = [
  {
    name: 'Aries', symbol: '♈',
    stars: [
      { x: 0.5, y: 0.2, r: 2.2 }, { x: 0.35, y: 0.45, r: 1.6 },
      { x: 0.55, y: 0.65, r: 1.4 }, { x: 0.75, y: 0.55, r: 1.8 },
    ],
    edges: [[0,1],[1,2],[2,3]],
    cx: 0.08, cy: 0.18, scale: 120, drift: { x: 10, y: -8 }, driftDur: 16,
  },
  {
    name: 'Pisces', symbol: '♓',
    stars: [
      { x: 0.1, y: 0.5, r: 1.8 }, { x: 0.3, y: 0.2, r: 1.4 },
      { x: 0.5, y: 0.5, r: 2.0 }, { x: 0.7, y: 0.2, r: 1.4 },
      { x: 0.9, y: 0.5, r: 1.8 }, { x: 0.5, y: 0.8, r: 1.6 },
    ],
    edges: [[0,1],[1,2],[2,3],[3,4],[0,5],[4,5]],
    cx: 0.82, cy: 0.14, scale: 140, drift: { x: -12, y: 10 }, driftDur: 20,
  },
  {
    name: 'Scorpio', symbol: '♏',
    stars: [
      { x: 0.2, y: 0.1, r: 2.4 }, { x: 0.4, y: 0.3, r: 1.6 },
      { x: 0.55, y: 0.5, r: 1.4 }, { x: 0.65, y: 0.7, r: 1.8 },
      { x: 0.8, y: 0.85, r: 1.4 }, { x: 0.9, y: 0.75, r: 1.6 },
    ],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5]],
    cx: 0.12, cy: 0.72, scale: 160, drift: { x: 8, y: -12 }, driftDur: 18,
  },
  {
    name: 'Leo', symbol: '♌',
    stars: [
      { x: 0.15, y: 0.5, r: 2.0 }, { x: 0.3, y: 0.2, r: 1.8 },
      { x: 0.55, y: 0.15, r: 2.4 }, { x: 0.75, y: 0.35, r: 1.6 },
      { x: 0.8, y: 0.6, r: 1.4 }, { x: 0.5, y: 0.75, r: 1.8 },
      { x: 0.25, y: 0.7, r: 1.5 },
    ],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,0]],
    cx: 0.55, cy: 0.2, scale: 150, drift: { x: -10, y: 8 }, driftDur: 22,
  },
  {
    name: 'Aquarius', symbol: '♒',
    stars: [
      { x: 0.1, y: 0.3, r: 1.8 }, { x: 0.3, y: 0.2, r: 2.0 },
      { x: 0.5, y: 0.4, r: 1.6 }, { x: 0.7, y: 0.3, r: 1.8 },
      { x: 0.9, y: 0.5, r: 1.4 }, { x: 0.2, y: 0.7, r: 1.6 },
      { x: 0.5, y: 0.8, r: 2.0 }, { x: 0.8, y: 0.7, r: 1.6 },
    ],
    edges: [[0,1],[1,2],[2,3],[3,4],[5,6],[6,7],[1,5],[3,7]],
    cx: 0.75, cy: 0.72, scale: 140, drift: { x: -8, y: -10 }, driftDur: 19,
  },
]

// ─── Single Constellation ──────────────────────────────────────────────────────
function Constellation({ def, mouseX, mouseY }: {
  def: ConstellationDef
  mouseX: number
  mouseY: number
}) {
  const [hovered, setHovered] = useState(false)
  const [dashOffset, setDashOffset] = useState(300)

  const w = window.innerWidth
  const h = window.innerHeight
  const ox = def.cx * w
  const oy = def.cy * h
  const sc = def.scale

  const dx = mouseX * w - ox
  const dy = mouseY * h - oy
  const dist = Math.sqrt(dx * dx + dy * dy)
  const proximity = dist < sc * 0.75

  const active = hovered || proximity

  useEffect(() => {
    if (!active) { setDashOffset(300); return }
    let v = 300
    const id = setInterval(() => {
      v = Math.max(0, v - 8)
      setDashOffset(v)
      if (v === 0) clearInterval(id)
    }, 16)
    return () => clearInterval(id)
  }, [active])

  const cursorPull = active
    ? { x: (mouseX * w - ox) * 0.04, y: (mouseY * h - oy) * 0.04 }
    : { x: 0, y: 0 }

  return (
    <motion.g
      animate={{
        x: [cursorPull.x, cursorPull.x + def.drift.x + cursorPull.x, cursorPull.x],
        y: [cursorPull.y, cursorPull.y + def.drift.y + cursorPull.y, cursorPull.y],
      }}
      transition={{ duration: def.driftDur, repeat: Infinity, ease: 'easeInOut' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: 'default' }}
    >
      <defs>
        <linearGradient id={`gold-line-${def.name}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#d4af37" stopOpacity="0" />
          <stop offset="50%" stopColor="#f4d77a" stopOpacity="1" />
          <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
        </linearGradient>
        {def.stars.map((_, i) => (
          <filter key={i} id={`star-glow-${def.name}-${i}`}>
            <feGaussianBlur stdDeviation={active ? "3" : "1.5"} result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        ))}
      </defs>

      {/* Lines */}
      {def.edges.map(([a, b], i) => {
        const s = def.stars[a], e2 = def.stars[b]
        const x1 = ox + (s.x - 0.5) * sc, y1 = oy + (s.y - 0.5) * sc
        const x2 = ox + (e2.x - 0.5) * sc, y2 = oy + (e2.y - 0.5) * sc
        const len = Math.sqrt((x2-x1)**2 + (y2-y1)**2)
        return (
          <motion.line
            key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={active ? `url(#gold-line-${def.name})` : 'rgba(212,175,55,0.25)'}
            strokeWidth={active ? 1.2 : 0.7}
            strokeDasharray={active ? `${len}` : 'none'}
            strokeDashoffset={active ? dashOffset : 0}
            strokeLinecap="round"
            animate={{ opacity: active ? 1 : 0.6 }}
            transition={{ duration: 0.4 }}
          />
        )
      })}

      {/* Stars */}
      {def.stars.map((s, i) => {
        const sx = ox + (s.x - 0.5) * sc
        const sy = oy + (s.y - 0.5) * sc
        return (
          <motion.circle
            key={i} cx={sx} cy={sy} r={s.r}
            fill={active ? '#f4d77a' : '#ffffff'}
            filter={`url(#star-glow-${def.name}-${i})`}
            animate={{ r: active ? s.r * 1.6 : s.r, opacity: active ? 1 : 0.8 }}
            transition={{ duration: 0.4 }}
          />
        )
      })}

      {/* Tooltip */}
      <AnimatePresence>
        {active && (
          <motion.g
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3 }}
          >
            <text
              x={ox} y={oy + sc * 0.55 + 20}
              textAnchor="middle"
              fill="#f4d77a"
              fontSize="13"
              fontFamily="Cormorant Garamond, serif"
              letterSpacing="0.12em"
              style={{ filter: 'drop-shadow(0 0 6px rgba(212,175,55,0.8))' }}
            >
              {def.symbol} {def.name}
            </text>
          </motion.g>
        )}
      </AnimatePresence>
    </motion.g>
  )
}

// ─── Shooting Star ─────────────────────────────────────────────────────────────
interface ShootingStar { id: number; x: number; y: number }
function ShootingStarEl({ star }: { star: ShootingStar }) {
  return (
    <motion.div
      className="fixed pointer-events-none z-10"
      style={{
        left: `${star.x}%`,
        top: `${star.y}%`,
        width: 120,
        height: 1.5,
        background: 'linear-gradient(90deg, transparent, #f4d77a, transparent)',
        borderRadius: 2,
        rotate: 30,
        transformOrigin: 'left center',
      }}
      initial={{ opacity: 0, x: 0, y: 0, scaleX: 0 }}
      animate={{ opacity: [0, 1, 0.8, 0], x: 600, y: 280, scaleX: [0, 1, 1, 0.3] }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2, ease: 'easeOut' }}
    />
  )
}

// ─── Zodiac Wheel ──────────────────────────────────────────────────────────────
function ZodiacWheel() {
  const spokes = 12
  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
      <motion.svg
        width="min(90vw,90vh)" height="min(90vw,90vh)"
        viewBox="0 0 400 400"
        style={{ opacity: 0.07 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
      >
        {[80, 130, 175, 195].map(r => (
          <circle key={r} cx="200" cy="200" r={r} fill="none" stroke="#d4af37" strokeWidth="0.6" />
        ))}
        {Array.from({ length: spokes }, (_, i) => {
          const a = (i / spokes) * Math.PI * 2
          return (
            <line key={i}
              x1={200 + Math.cos(a) * 80} y1={200 + Math.sin(a) * 80}
              x2={200 + Math.cos(a) * 195} y2={200 + Math.sin(a) * 195}
              stroke="#d4af37" strokeWidth="0.6"
            />
          )
        })}
        {/* Pentagram */}
        {Array.from({ length: 5 }, (_, i) => {
          const a = (i * 2 / 5) * Math.PI * 2 - Math.PI / 2
          const b = ((i * 2 + 2) / 5) * Math.PI * 2 - Math.PI / 2
          return (
            <line key={i}
              x1={200 + Math.cos(a) * 60} y1={200 + Math.sin(a) * 60}
              x2={200 + Math.cos(b) * 60} y2={200 + Math.sin(b) * 60}
              stroke="#d4af37" strokeWidth="0.5"
            />
          )
        })}
        <circle cx="200" cy="200" r="4" fill="#d4af37" />
      </motion.svg>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function ConstellationSky() {
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 })
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([])
  const counterRef = useRef(0)

  const springConfig = { stiffness: 25, damping: 20 }
  const springX = useSpring(0, springConfig)
  const springY = useSpring(0, springConfig)

  const onMouseMove = useCallback((e: MouseEvent) => {
    const nx = e.clientX / window.innerWidth
    const ny = e.clientY / window.innerHeight
    const px = (nx - 0.5) * 2
    const py = (ny - 0.5) * 2
    springX.set(px * 12)
    springY.set(py * 12)
    setMouse({ x: nx, y: ny })
  }, [springX, springY])

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [onMouseMove])

  useEffect(() => {
    const id = setInterval(() => {
      const star: ShootingStar = {
        id: counterRef.current++,
        x: 10 + Math.random() * 60,
        y: 5 + Math.random() * 40,
      }
      setShootingStars(prev => [...prev, star])
      setTimeout(() => {
        setShootingStars(prev => prev.filter(s => s.id !== star.id))
      }, 2500)
    }, 6000)
    return () => clearInterval(id)
  }, [])

  const w = typeof window !== 'undefined' ? window.innerWidth : 1440
  const h = typeof window !== 'undefined' ? window.innerHeight : 900

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base cosmic gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 40%, #0a0f2e 0%, #050816 65%, #020408 100%)',
        }}
      />

      {/* Nebula glows */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 700, height: 500, left: '5%', top: '10%',
            background: 'radial-gradient(ellipse, rgba(88,28,135,0.18) 0%, transparent 70%)',
            filter: 'blur(40px)',
            x: springX,
            y: springY,
          }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 500, height: 600, right: '5%', top: '20%',
            background: 'radial-gradient(ellipse, rgba(212,175,55,0.09) 0%, transparent 70%)',
            filter: 'blur(50px)',
            x: springX,
            y: springY,
          }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 600, height: 400, left: '30%', bottom: '10%',
            background: 'radial-gradient(ellipse, rgba(29,78,216,0.12) 0%, transparent 70%)',
            filter: 'blur(45px)',
            x: springX,
            y: springY,
          }}
        />
      </div>

      {/* Zodiac wheel */}
      <ZodiacWheel />

      {/* Background star field (slow parallax) */}
      <motion.svg
        className="absolute inset-0"
        width="100%" height="100%"
        style={{ x: springX.get() * 0.4, y: springY.get() * 0.4 }}
      >
        {BG_STARS.map((s, i) => (
          <circle
            key={i}
            cx={`${s.x}%`} cy={`${s.y}%`} r={s.r}
            fill="white"
            style={{
              animation: `twinkle ${s.dur}s ${s.delay}s infinite ease-in-out`,
              opacity: 0.4,
            }}
          />
        ))}
      </motion.svg>

      {/* Foreground star field (full parallax) */}
      <motion.svg
        className="absolute inset-0"
        width="100%" height="100%"
        style={{ x: springX, y: springY }}
      >
        {FG_STARS.map((s, i) => (
          <circle
            key={i}
            cx={`${s.x}%`} cy={`${s.y}%`} r={s.r * 0.7}
            fill="white"
            style={{
              animation: `twinkle ${s.dur}s ${s.delay}s infinite ease-in-out`,
              opacity: 0.7,
            }}
          />
        ))}
      </motion.svg>

      {/* Constellations */}
      <motion.svg
        className="absolute inset-0"
        width={w} height={h}
        style={{ x: springX, y: springY }}
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="xMidYMid slice"
      >
        {CONSTELLATIONS.map(def => (
          <Constellation key={def.name} def={def} mouseX={mouse.x} mouseY={mouse.y} />
        ))}
      </motion.svg>

      {/* Shooting stars */}
      <AnimatePresence>
        {shootingStars.map(s => <ShootingStarEl key={s.id} star={s} />)}
      </AnimatePresence>

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(2,4,8,0.75) 100%)',
        }}
      />
    </div>
  )
}
