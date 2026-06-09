import { useState, useRef } from 'react'
import type { FormEvent, ChangeEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type SubmitState = 'idle' | 'loading' | 'done' | 'error'

const CONSULTATION_LABELS: Record<string, string> = {
  natal: 'Natal Chart — Birth Blueprint',
  synastry: 'Synastry — Relationship Dynamics',
  career: 'Career & Purpose — Soul Mission',
  year: 'Year Ahead — Celestial Forecast',
  spiritual: 'Spiritual Guidance — Cosmic Alignment',
  prashna: 'Prashna (Horary) — Answer Your Question',
}

interface FormValues {
  name: string
  email: string
  phone: string
  dob: string
  tob: string
  pob: string
  session: string
  type: string
  questions: string
}

const INITIAL: FormValues = {
  name: '', email: '', phone: '', dob: '', tob: '',
  pob: '', session: '', type: '', questions: '',
}

// Required fields (tob and questions are optional)
const REQUIRED_FIELDS: (keyof FormValues)[] = [
  'name', 'email', 'phone', 'dob', 'pob', 'session', 'type',
]

async function sendToDiscord(data: FormValues) {
  const webhookUrl = import.meta.env.VITE_DISCORD_WEBHOOK_URL
  if (!webhookUrl) throw new Error('Discord webhook URL not configured')

  const consultationType = CONSULTATION_LABELS[data.type] ?? data.type

  const embed = {
    title: '✦ New Consultation Request',
    color: 0xd4af37,
    fields: [
      { name: '👤 Full Name',            value: data.name,            inline: true  },
      { name: '📧 Email',                value: data.email,           inline: true  },
      { name: '📞 Phone Number',         value: data.phone,           inline: true  },
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
  const [values, setValues] = useState<FormValues>(INITIAL)
  const [touched, setTouched] = useState<Partial<Record<keyof FormValues, boolean>>>({})
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const getError = (field: keyof FormValues): string => {
    if (!REQUIRED_FIELDS.includes(field)) return ''
    const val = values[field].trim()
    if (!val) return 'This field is required'
    if (field === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Enter a valid email'
    if (field === 'phone' && !/^\+?[\d\s\-()]{7,15}$/.test(val)) return 'Enter a valid phone number'
    return ''
  }

  const isFormValid = REQUIRED_FIELDS.every(f => !getError(f))

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setValues(prev => ({ ...prev, [name]: value }))
  }

  const handleBlur = (field: keyof FormValues) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const showError = (field: keyof FormValues) =>
    (touched[field] || submitAttempted) ? getError(field) : ''

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitAttempted(true)

    // Mark all required fields as touched so errors show
    const allTouched = REQUIRED_FIELDS.reduce((acc, f) => ({ ...acc, [f]: true }), {})
    setTouched(allTouched)

    if (!isFormValid) return

    setSubmitState('loading')
    try {
      await sendToDiscord(values)
      setSubmitState('done')
      setValues(INITIAL)
      setTouched({})
      setSubmitAttempted(false)
    } catch (err) {
      console.error(err)
      setSubmitState('error')
      setTimeout(() => setSubmitState('idle'), 4000)
    }
  }

  const inputFields: { name: keyof FormValues; label: string; type: string; placeholder: string; required: boolean }[] = [
    { name: 'name',    label: 'Full Name',             type: 'text',  placeholder: 'Your celestial name',  required: true  },
    { name: 'email',   label: 'Email Address',          type: 'email', placeholder: 'your@cosmos.com',      required: true  },
    { name: 'phone',   label: 'Phone Number',           type: 'tel',   placeholder: '+977 98XXXXXXXX',      required: true  },
    { name: 'dob',     label: 'Date of Birth',          type: 'date',  placeholder: '',                     required: true  },
    { name: 'tob',     label: 'Time of Birth',          type: 'time',  placeholder: '',                     required: false },
    { name: 'pob',     label: 'Place of Birth',         type: 'text',  placeholder: 'City, Country',        required: true  },
    { name: 'session', label: 'Preferred Session Date', type: 'date',  placeholder: '',                     required: true  },
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
            {inputFields.map(f => {
              const err = showError(f.name)
              return (
                <div key={f.name}>
                  <label htmlFor={f.name} className="field-label">
                    {f.label}
                    {f.required && <span className="text-gold ml-1">*</span>}
                  </label>
                  <input
                    id={f.name}
                    name={f.name}
                    type={f.type}
                    placeholder={f.placeholder}
                    value={values[f.name]}
                    onChange={handleChange}
                    onBlur={() => handleBlur(f.name)}
                    className="cosmic-input"
                    style={{
                      colorScheme: 'dark',
                      borderColor: err ? 'rgba(239,68,68,0.6)' : undefined,
                      boxShadow: err ? '0 0 0 3px rgba(239,68,68,0.1)' : undefined,
                    }}
                  />
                  <AnimatePresence>
                    {err && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="text-red-400 text-xs mt-1.5 tracking-wide"
                      >
                        {err}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>

          {/* Consultation type */}
          <div className="mb-6">
            <label htmlFor="type" className="field-label">
              Type of Consultation <span className="text-gold ml-1">*</span>
            </label>
            <select
              id="type"
              name="type"
              value={values.type}
              onChange={handleChange}
              onBlur={() => handleBlur('type')}
              className="cosmic-input"
              style={{
                borderColor: showError('type') ? 'rgba(239,68,68,0.6)' : undefined,
                boxShadow: showError('type') ? '0 0 0 3px rgba(239,68,68,0.1)' : undefined,
              }}
            >
              <option value="">Select your session type…</option>
              {Object.entries(CONSULTATION_LABELS).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
            <AnimatePresence>
              {showError('type') && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="text-red-400 text-xs mt-1.5 tracking-wide"
                >
                  {showError('type')}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Questions */}
          <div className="mb-8">
            <label htmlFor="questions" className="field-label">Questions / Concerns</label>
            <textarea
              id="questions"
              name="questions"
              rows={4}
              placeholder="What do you seek from the stars? Share your questions, intentions, or areas of focus…"
              value={values.questions}
              onChange={handleChange}
              className="cosmic-input resize-none"
            />
          </div>

          {/* Required note */}
          <p className="text-xs text-stardust-dim tracking-wide mb-5" style={{ opacity: 0.6 }}>
            <span className="text-gold">*</span> Required fields
          </p>

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
                  background: submitState === 'loading'
                    ? 'linear-gradient(135deg, #a88a20 0%, #c9a83c 100%)'
                    : 'linear-gradient(135deg, #d4af37 0%, #f4d77a 50%, #a88a20 100%)',
                  boxShadow: '0 0 30px rgba(212,175,55,0.4), 0 4px 20px rgba(0,0,0,0.3)',
                  opacity: submitState === 'loading' ? 0.85 : 1,
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
