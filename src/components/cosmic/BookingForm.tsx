import { useState, useRef } from 'react'
import type { FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type SubmitState = 'idle' | 'loading' | 'payment' | 'done' | 'error'

const CONSULTATION_LABELS: Record<string, string> = {
  natal:     'Natal Chart — Birth Blueprint',
  synastry:  'Synastry — Relationship Dynamics',
  career:    'Career & Purpose — Soul Mission',
  year:      'Year Ahead — Celestial Forecast',
  spiritual: 'Spiritual Guidance — Cosmic Alignment',
}

async function sendToDiscord(data: Record<string, string>) {
  const webhookUrl = import.meta.env.VITE_DISCORD_WEBHOOK_URL
  if (!webhookUrl) throw new Error('Discord webhook URL not configured')

  const consultationType = CONSULTATION_LABELS[data.type] ?? data.type

  const embed = {
    title: '✦ New Consultation Request',
    color: 0xd4af37,
    fields: [
      { name: '👤 Full Name',            value: data.name,             inline: true  },
      { name: '📧 Email',                value: data.email,            inline: true  },
      { name: '🎂 Date of Birth',        value: data.dob,              inline: true  },
      { name: '🕐 Time of Birth',        value: data.tob  || '—',      inline: true  },
      { name: '📍 Place of Birth',       value: data.pob,              inline: true  },
      { name: '📅 Preferred Session',    value: data.session,          inline: true  },
      { name: '🔮 Consultation Type',    value: consultationType,      inline: false },
      { name: '💬 Questions / Concerns', value: data.questions || '—', inline: false },
      { name: '💳 Payment',              value: 'QR shown to client — awaiting confirmation', inline: false },
    ],
    footer: { text: 'astrologywithsujal · Astrology Consultation Platform' },
    timestamp: new Date().toISOString(),
  }

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'Celestia ✦',
      embeds: [embed],
    }),
  })

  if (!res.ok) throw new Error(`Discord error: ${res.status}`)
}

// ─── Payment Step ──────────────────────────────────────────────────────────────
function PaymentStep({ onConfirmed }: { onConfirmed: () => void }) {
  const [copied, setCopied] = useState(false)
  const amount = 'Rs. 2,250'
  const accountName = 'Sujal Dangal'

  const handleCopy = () => {
    navigator.clipboard.writeText('2250')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      key="payment"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center gap-6"
    >
      {/* Header */}
      <div className="text-center">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="text-4xl mb-3"
        >
          🔮
        </motion.div>
        <h3 className="font-serif-display text-2xl md:text-3xl text-stardust-bright mb-2">
          Complete Your <em className="italic text-glow-gold">Booking</em>
        </h3>
        <p className="text-stardust-dim text-sm leading-relaxed">
          Scan the QR below to pay via your bank app, then click confirm.
        </p>
      </div>

      {/* Amount badge */}
      <div
        className="flex items-center gap-3 px-6 py-3 rounded-full"
        style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.35)' }}
      >
        <span className="text-stardust-dim text-xs tracking-widest uppercase">Consultation Fee</span>
        <span className="text-glow-gold font-serif-display text-2xl font-semibold">{amount}</span>
        <button
          onClick={handleCopy}
          className="text-xs text-stardust-dim hover:text-gold transition-colors duration-200 ml-1"
          title="Copy amount"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>

      {/* QR Card */}
      <motion.div
        className="relative p-4 rounded-2xl"
        style={{
          background: 'rgba(255,255,255,0.97)',
          boxShadow: '0 0 60px rgba(212,175,55,0.4), 0 0 0 1px rgba(212,175,55,0.3)',
        }}
        animate={{
          boxShadow: [
            '0 0 40px rgba(212,175,55,0.3), 0 0 0 1px rgba(212,175,55,0.25)',
            '0 0 70px rgba(212,175,55,0.55), 0 0 0 1px rgba(212,175,55,0.5)',
            '0 0 40px rgba(212,175,55,0.3), 0 0 0 1px rgba(212,175,55,0.25)',
          ],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={{ scale: 1.03 }}
      >
        <img
          src="/qr.jpg"
          alt="Bank Payment QR"
          className="w-56 h-56 md:w-64 md:h-64 object-contain rounded-xl"
        />
        {/* Gold corner accents */}
        {['top-1 left-1', 'top-1 right-1', 'bottom-1 left-1', 'bottom-1 right-1'].map((pos, i) => (
          <div
            key={i}
            className={`absolute ${pos} w-5 h-5`}
            style={{
              borderTop: i < 2 ? '2px solid #d4af37' : 'none',
              borderBottom: i >= 2 ? '2px solid #d4af37' : 'none',
              borderLeft: i % 2 === 0 ? '2px solid #d4af37' : 'none',
              borderRight: i % 2 === 1 ? '2px solid #d4af37' : 'none',
              borderRadius: i === 0 ? '4px 0 0 0' : i === 1 ? '0 4px 0 0' : i === 2 ? '0 0 0 4px' : '0 0 4px 0',
            }}
          />
        ))}
      </motion.div>

      {/* Account info */}
      <div className="text-center space-y-1">
        <p className="text-xs tracking-widest uppercase text-stardust-dim">Pay to</p>
        <p className="font-serif-display text-lg text-stardust-bright">{accountName}</p>
        <p className="text-xs text-stardust-dim">Open your bank app → Scan QR → Enter {amount}</p>
      </div>

      {/* Instructions */}
      <div
        className="w-full rounded-xl p-4 space-y-2"
        style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)' }}
      >
        {[
          '1. Open your bank or wallet app (Hamro Pay, IME Pay, etc.)',
          '2. Tap "Scan QR" and point at the code above',
          `3. Enter the amount: ${amount}`,
          '4. Complete the payment and take a screenshot',
          '5. Click "I have paid" below',
        ].map((step, i) => (
          <p key={i} className="text-xs text-stardust-dim leading-relaxed">
            <span className="text-gold">{step.slice(0, 2)}</span>{step.slice(2)}
          </p>
        ))}
      </div>

      {/* Confirm button */}
      <motion.button
        onClick={onConfirmed}
        className="relative w-full overflow-hidden rounded-xl py-4 px-8 font-sans font-medium text-sm tracking-[0.2em] uppercase text-cosmic-deep"
        style={{
          background: 'linear-gradient(135deg, #d4af37 0%, #f4d77a 50%, #a88a20 100%)',
          boxShadow: '0 0 30px rgba(212,175,55,0.4), 0 4px 20px rgba(0,0,0,0.3)',
        }}
        whileTap={{ scale: 0.97 }}
        whileHover={{ boxShadow: '0 0 50px rgba(212,175,55,0.6), 0 4px 20px rgba(0,0,0,0.3)' }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        {/* Shimmer */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)', width: '40%' }}
          animate={{ x: ['-100%', '350%'] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1 }}
        />
        ✦ I have paid — Confirm Booking
      </motion.button>

      <p className="text-xs text-stardust-dim text-center opacity-60">
        Having trouble? Email us and we'll confirm manually.
      </p>
    </motion.div>
  )
}

// ─── Main Form ─────────────────────────────────────────────────────────────────
export default function BookingForm() {
  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const formRef = useRef<HTMLFormElement>(null)
  const formDataRef = useRef<Record<string, string>>({})

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitState('loading')

    const form = e.currentTarget as HTMLFormElement
    formDataRef.current = Object.fromEntries(new FormData(form)) as Record<string, string>

    try {
      await sendToDiscord(formDataRef.current)
      setSubmitState('payment')
    } catch (err) {
      console.error(err)
      setSubmitState('error')
      setTimeout(() => setSubmitState('idle'), 4000)
    }
  }

  const handlePaymentConfirmed = () => {
    setSubmitState('done')
    formRef.current?.reset()
  }

  const fields = [
    { name: 'name',    label: 'Full Name',             type: 'text',  placeholder: 'Your name' },
    { name: 'email',   label: 'Email Address',          type: 'email', placeholder: 'your@email.com'     },
    { name: 'dob',     label: 'Date of Birth',          type: 'date',  placeholder: ''                    },
    { name: 'tob',     label: 'Time of Birth',          type: 'time',  placeholder: ''                    },
    { name: 'pob',     label: 'Place of Birth',         type: 'text',  placeholder: 'City, Country'       },
    { name: 'session', label: 'Preferred Session Date', type: 'date',  placeholder: ''                    },
  ]

  return (
    <motion.div
      className="relative w-full max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Card halo */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.15) 0%, transparent 65%)',
          filter: 'blur(30px)',
          transform: 'translateY(-20px) scaleX(0.9)',
        }}
      />

      <div className="glass-card rounded-2xl p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.6), transparent)' }} />

        {/* Step indicator */}
        <AnimatePresence mode="wait">
          {submitState !== 'payment' && submitState !== 'done' && (
            <motion.div
              key="step-indicator"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center gap-3 mb-8"
            >
              {['Details', 'Payment', 'Confirmed'].map((step, i) => {
                const stepIndex = submitState === 'idle' || submitState === 'loading' || submitState === 'error' ? 0 : submitState === 'payment' ? 1 : 2
                return (
                  <div key={step} className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-500"
                        style={{
                          background: i <= stepIndex ? 'linear-gradient(135deg, #d4af37, #f4d77a)' : 'rgba(255,255,255,0.05)',
                          color: i <= stepIndex ? '#050816' : 'rgba(200,208,232,0.4)',
                          border: i <= stepIndex ? 'none' : '1px solid rgba(255,255,255,0.1)',
                        }}
                      >
                        {i + 1}
                      </div>
                      <span className="text-xs tracking-widest uppercase" style={{ color: i <= stepIndex ? '#d4af37' : 'rgba(122,133,168,0.5)' }}>
                        {step}
                      </span>
                    </div>
                    {i < 2 && <div className="w-8 h-px" style={{ background: i < stepIndex ? 'rgba(212,175,55,0.5)' : 'rgba(255,255,255,0.1)' }} />}
                  </div>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">

          {/* ── Form ── */}
          {(submitState === 'idle' || submitState === 'loading' || submitState === 'error') && (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.4 }}>
              <div className="text-center mb-10">
                <p className="field-label mb-3">✦ Your Consultation ✦</p>
                <h3 className="font-serif-display text-3xl md:text-4xl text-stardust-bright">
                  Begin the <em className="text-glow-gold" style={{ fontStyle: 'italic' }}>Reading</em>
                </h3>
                <p className="text-stardust-dim text-sm mt-3 leading-relaxed">
                  Share your details and the cosmos will prepare your session
                </p>
              </div>

              <form ref={formRef} onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {fields.map(f => (
                    <div key={f.name}>
                      <label htmlFor={f.name} className="field-label">{f.label}</label>
                      <input
                        id={f.name} name={f.name} type={f.type}
                        placeholder={f.placeholder}
                        className="cosmic-input"
                        required={f.name !== 'tob'}
                        style={{ colorScheme: 'dark' }}
                      />
                    </div>
                  ))}
                </div>

                <div className="mb-6">
                  <label htmlFor="type" className="field-label">Type of Consultation</label>
                  <select id="type" name="type" className="cosmic-input" required>
                    <option value="">Select your session type…</option>
                    {Object.entries(CONSULTATION_LABELS).map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-8">
                  <label htmlFor="questions" className="field-label">Questions / Concerns (Please include your contact number also)</label>
                  <textarea
                    id="questions" name="questions" rows={4}
                    placeholder="What do you seek from the stars?…"
                    className="cosmic-input resize-none"
                  />
                </div>

                {submitState === 'error' && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm text-center mb-4">
                    ⚠ Something went wrong — please try again
                  </motion.p>
                )}

                <motion.button
                  type="submit"
                  disabled={submitState === 'loading'}
                  className="relative w-full overflow-hidden rounded-xl py-4 px-8 font-sans font-medium text-sm tracking-[0.2em] uppercase text-cosmic-deep"
                  style={{
                    background: 'linear-gradient(135deg, #d4af37 0%, #f4d77a 50%, #a88a20 100%)',
                    boxShadow: '0 0 30px rgba(212,175,55,0.4), 0 4px 20px rgba(0,0,0,0.3)',
                  }}
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ boxShadow: '0 0 50px rgba(212,175,55,0.6)' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)', width: '40%' }}
                    animate={{ x: ['-100%', '350%'] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1 }}
                  />
                  <AnimatePresence mode="wait">
                    {submitState === 'loading' ? (
                      <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center gap-2">
                        <motion.span animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }} className="inline-block">✦</motion.span>
                        Sending to the cosmos…
                      </motion.span>
                    ) : (
                      <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        Continue to Payment →
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </form>
            </motion.div>
          )}

          {/* ── Payment Step ── */}
          {submitState === 'payment' && (
            <PaymentStep key="payment" onConfirmed={handlePaymentConfirmed} />
          )}

          {/* ── Done ── */}
          {submitState === 'done' && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-4 py-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                className="text-5xl"
              >
                ✦
              </motion.div>
              <p className="font-serif-display text-2xl text-glow-gold italic">Received — the stars align</p>
              <p className="text-stardust-dim text-sm max-w-sm leading-relaxed">
                Your booking and payment are confirmed. We'll reach out to you within 24 hours to schedule your session.
              </p>
              <div className="h-px w-32 mt-2" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)' }} />
              <p className="text-xs text-stardust-dim opacity-60 tracking-widest uppercase">
                astrologywithsujal · As above, so below
              </p>
            </motion.div>
          )}

        </AnimatePresence>

        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)' }} />
      </div>
    </motion.div>
  )
}
