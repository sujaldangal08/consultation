import { motion } from 'framer-motion'

// ─── Corner Sigil ──────────────────────────────────────────────────────────────
type Position = 'tl' | 'tr' | 'bl' | 'br'
interface CornerSigilProps { position: Position }

export function CornerSigil({ position }: CornerSigilProps) {
  const posClass = {
    tl: 'top-6 left-6',
    tr: 'top-6 right-6',
    bl: 'bottom-6 left-6',
    br: 'bottom-6 right-6',
  }[position]

  const rotate = { tl: 0, tr: 90, bl: 270, br: 180 }[position]

  return (
    <motion.div
      className={`fixed ${posClass} pointer-events-none z-20`}
      style={{ width: 80, height: 80, rotate }}
      animate={{
        y: [0, -8, 0],
        filter: [
          'drop-shadow(0 0 4px rgba(212,175,55,0.5))',
          'drop-shadow(0 0 14px rgba(212,175,55,0.9))',
          'drop-shadow(0 0 4px rgba(212,175,55,0.5))',
        ],
      }}
      transition={{ duration: 4 + Math.random() * 2, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Outer circle */}
        <circle cx="40" cy="40" r="36" stroke="#d4af37" strokeWidth="0.6" strokeOpacity="0.7" />
        {/* Middle circle */}
        <circle cx="40" cy="40" r="26" stroke="#d4af37" strokeWidth="0.5" strokeOpacity="0.5" />
        {/* Inner circle */}
        <circle cx="40" cy="40" r="14" stroke="#d4af37" strokeWidth="0.5" strokeOpacity="0.6" />

        {/* Star of David - upward triangle */}
        <polygon
          points="40,8 66,52 14,52"
          stroke="#d4af37" strokeWidth="0.8" fill="rgba(212,175,55,0.04)"
          strokeOpacity="0.8"
        />
        {/* Star of David - downward triangle */}
        <polygon
          points="40,72 14,28 66,28"
          stroke="#d4af37" strokeWidth="0.8" fill="rgba(212,175,55,0.04)"
          strokeOpacity="0.8"
        />

        {/* Center dot */}
        <circle cx="40" cy="40" r="2.5" fill="#f4d77a" />

        {/* Corner accent dots */}
        <circle cx="40" cy="4" r="1.5" fill="#d4af37" fillOpacity="0.6" />
        <circle cx="40" cy="76" r="1.5" fill="#d4af37" fillOpacity="0.6" />
        <circle cx="4" cy="40" r="1.5" fill="#d4af37" fillOpacity="0.6" />
        <circle cx="76" cy="40" r="1.5" fill="#d4af37" fillOpacity="0.6" />
      </svg>
    </motion.div>
  )
}

// ─── Ornament Divider ──────────────────────────────────────────────────────────
export function OrnamentDivider() {
  return (
    <div className="flex items-center gap-4 my-8 px-4">
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)' }} />
      <motion.svg
        width="20" height="20" viewBox="0 0 20 20"
        animate={{ rotate: [0, 180, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        {/* 4-point star */}
        <path
          d="M10 0 L11.5 8.5 L20 10 L11.5 11.5 L10 20 L8.5 11.5 L0 10 L8.5 8.5 Z"
          fill="#d4af37"
          style={{ filter: 'drop-shadow(0 0 4px rgba(212,175,55,0.7))' }}
        />
      </motion.svg>
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)' }} />
    </div>
  )
}
