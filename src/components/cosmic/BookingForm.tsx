import { useState, useRef } from 'react'
import type { FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type SubmitState = 'idle' | 'loading' | 'done' | 'error'

const CONSULTATION_LABELS: Record<string, string> = {
  natal: 'Natal Chart — Birth Blueprint',
  synastry: 'Synastry — Relationship Dynamics',
  career: 'Career & Purpose — Soul Mission',
  year: 'Year Ahead — Celestial Forecast',
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
      { name: '👤 Full Name',            value: data.name,            inline: true  },
      { name: '📧 Email',                value: data.email,           inline: true  },
      { name: '🎂 Date of Birth',        value: data.dob,             inline: true  },
      { name: '🕐 Time of Birth',        value: data.tob  || '—',     inline: true  },
      { name: '📍 Place of Birth',       value: data.pob,             inline: true  },
      { name: '📅 Preferred Session',    value: data.session,         inline: true  },
      { name: '🔮 Consultation Type',    value: consultationType,     inline: false },
      { name: '💬 Questions / Concerns', value: data.questions || '—',inline: false },
    ],
    footer: { text: 'Celestia · Astrology Consultation Platform' },
    timestamp: new Date().toISOString(),
  }

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'Celestia ✦',
      avatar_url: 'https://i.imgur.com/4M34hi2.png',
      embeds: [embed],
    }),
  })

  if (!res.ok) throw new Error(`Discord error: ${res.status}`)
}

export default function BookingForm() {
  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitState('loading')

    const form = e.currentTarget as HTMLFormElement
    const raw = Object.fromEntries(new FormData(form)) as Record<string, string>

    try {
      await sendToDiscord(raw)
      setSubmitState('done')
      formRef.current?.reset()
    } catch (err) {
      console.error(err)
      setSubmitState('error')
      setTimeout(() => setSubmitState('idle'), 4000)
    }
  }

  const fields = [
    { name: 'name',    label: 'Full Name',             type: 'text',  placeholder: 'Your celestial name' },
    { name: 'email',   label: 'Email Address',          type: 'email', placeholder: 'your@cosmos.com'     },
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
        {/* Top shimmer line */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.6), transparent)' }} />

        {/* Header */}
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
          {/* 2-col grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {fields.map(f => (
              <div key={f.name}>
                <label htmlFor={f.name} className="field-label">{f.label}</label>
                <input
                  id={f.name}
                  name={f.name}
                  type={f.type}
                  placeholder={f.placeholder}
                  className="cosmic-input"
                  required={f.name !== 'tob'}
                  style={{ colorScheme: 'dark' }}
                />
              </div>
            ))}
          </div>

          {/* Consultation type */}
          <div className="mb-6">
            <label htmlFor="type" className="field-label">Type of Consultation</label>
            <select id="type" name="type" className="cosmic-input" required>
              <option value="">Select your session type…</option>
              {Object.entries(CONSULTATION_LABELS).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>

          {/* Questions */}
          <div className="mb-8">
            <label htmlFor="questions" className="field-label">Questions / Concerns (Please include your contact number also) </label>
            <textarea
              id="questions"
              name="questions"
              rows={4}
              placeholder="What do you seek from the stars? Share your questions, intentions, or areas of focus…"
              className="cosmic-input resize-none"
            />
          </div>

          {/* Submit area */}
          <AnimatePresence mode="wait">
            {submitState === 'done' ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4"
              >
                <p className="font-serif-display text-xl text-glow-gold italic">✦ Received — the stars align ✦</p>
                <p className="text-stardust-dim text-sm mt-2">We'll reach out within 24 celestial hours</p>
              </motion.div>

            ) : submitState === 'error' ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-4"
              >
                <p className="text-red-400 font-serif-display text-lg">⚠ The stars are misaligned — please try again</p>
                <p className="text-stardust-dim text-sm mt-1">Check your connection and retry</p>
              </motion.div>

            ) : (
              <motion.button
                key="btn"
                type="submit"
                disabled={submitState === 'loading'}
                className="relative w-full overflow-hidden rounded-xl py-4 px-8 font-sans font-medium text-sm tracking-[0.2em] uppercase text-cosmic-deep"
                style={{
                  background: 'linear-gradient(135deg, #d4af37 0%, #f4d77a 50%, #a88a20 100%)',
                  boxShadow: '0 0 30px rgba(212,175,55,0.4), 0 4px 20px rgba(0,0,0,0.3)',
                }}
                whileTap={{ scale: 0.97 }}
                whileHover={{ boxShadow: '0 0 50px rgba(212,175,55,0.6), 0 4px 20px rgba(0,0,0,0.3)' }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                {/* Shimmer sweep */}
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
                      Request Consultation
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            )}
          </AnimatePresence>
        </form>

        {/* Bottom line */}
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)' }} />
      </div>
    </motion.div>
  )
}
