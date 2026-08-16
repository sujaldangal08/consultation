import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ConstellationSky from './components/cosmic/ConstellationSky'
import BookingForm from './components/cosmic/BookingForm'
import { CornerSigil, OrnamentDivider } from './components/cosmic/Ornaments'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] },
})

const navLinks = ['About', 'Services', 'Book', 'Research']

const services = [
  {
    icon: '☽',
    title: 'General Consultation',
    subtitle: 'Natal Chart',
    desc: 'A deep dive into your natal chart, exploring divisional charts to hep you with your strength and weaknesses.',
    duration: '60 min',
    price: 'NPR 2,250',
  },
  {
    icon: '♀',
    title: 'Pending Karma Reading',
    subtitle: 'Nakshatra Reading',
    desc: 'Reading based on Nakshatra to help you undestand the pending karma that you have and can rectify for a better journey of a soul.',
    duration: '75 min',
    price: 'NPR 3,000',
  },
  {
    icon: '☉',
    title: 'Career & Purpose',
    subtitle: 'Career Guidance',
    desc: 'Align your professional path with cosmic timing. Discover your dharma, optimal career periods, and the planetary forces guiding your life\'s work.',
    duration: '60 min',
    price: 'NPR 2,250',
  }
]

const testimonials = [
  {
    name: 'Prasanna T.',
    location: 'Kathmandu',
    text: 'Sujal\'s reading gave me clarity I couldn\'t find anywhere else. He decoded my chart with such precision — the career guidance he gave me changed my life\'s direction.',
    stars: 5,
  },
  {
    name: 'Aarav J.',
    location: 'Pokhara',
    text: 'I was skeptical at first, but the accuracy of my natal chart reading left me speechless. Every detail resonated deeply. Highly recommend.',
    stars: 5,
  },
  {
    name: 'Lokendra B.',
    location: 'Lalitpur',
    text: 'The synastry reading for my relationship was incredibly eye-opening. Sujal explains complex planetary dynamics in a way that truly makes sense.',
    stars: 5,
  },
]

// ── Theme system ──────────────────────────────────────────────────────────
// Everything below drives the dark "cosmic" theme (default) and a creamy,
// warm-parchment light theme via CSS custom properties. The variables are
// defined at :root so they cascade to every existing utility class
// (.text-stardust, .text-gold, .glass-card, etc.) without needing to touch
// your Tailwind config or hunt down every color reference by hand.
type Theme = 'dark' | 'light'

const themeStyleSheet = `
  :root[data-theme='dark'] {
    --bg-grad: radial-gradient(ellipse at top, #0d1330 0%, #050816 55%, #030510 100%);
    --nav-bg: linear-gradient(180deg, rgba(5,8,22,0.92) 0%, rgba(5,8,22,0) 100%);
    --overlay-bg: rgba(5,8,22,0.97);
    --text: #c7c3d9;
    --text-bright: #f5f3fa;
    --text-dim: #8b87a3;
    --gold: #d4af37;
    --gold-glow: rgba(212,175,55,0.6);
    --gold-dim: rgba(212,175,55,0.35);
    --glass-bg: rgba(255,255,255,0.03);
    --glass-border: rgba(212,175,55,0.18);
    --glass-shadow: rgba(0,0,0,0.35);
  }

  :root[data-theme='light'] {
    /* A warm, creamy parchment tone rather than flat white — closer to old
       star-charts and candlelight than a sterile UI background. */
    --bg-grad: radial-gradient(ellipse at top, #fdf7ea 0%, #f8edd6 55%, #f1e1bd 100%);
    --nav-bg: linear-gradient(180deg, rgba(253,247,234,0.94) 0%, rgba(253,247,234,0) 100%);
    --overlay-bg: rgba(253,247,234,0.97);
    --text: #5a4b3a;
    --text-bright: #2e2115;
    --text-dim: #8d7a60;
    --gold: #b07d1f;
    --gold-glow: rgba(176,125,31,0.5);
    --gold-dim: rgba(176,125,31,0.32);
    --glass-bg: rgba(255,252,244,0.62);
    --glass-border: rgba(176,125,31,0.28);
    --glass-shadow: rgba(120,86,30,0.14);
  }

  html, body {
    background: var(--bg-grad);
    transition: background 0.7s ease;
  }

  .text-stardust { color: var(--text) !important; }
  .text-stardust-bright { color: var(--text-bright) !important; }
  .text-stardust-dim { color: var(--text-dim) !important; }
  .text-gold { color: var(--gold) !important; }
  .text-glow-gold { color: var(--gold) !important; text-shadow: 0 0 30px var(--gold-glow); }
  .field-label { color: var(--gold) !important; opacity: 0.85; }
  .bg-gold { background-color: var(--gold) !important; }
  .border-gold { border-color: var(--gold) !important; }
  .bg-gold-dim, .gold-dim { background-color: var(--gold-dim) !important; }

  .glass-card {
    background: var(--glass-bg) !important;
    border-color: var(--glass-border) !important;
    box-shadow: 0 8px 32px var(--glass-shadow) !important;
    transition: background 0.6s ease, border-color 0.6s ease, box-shadow 0.6s ease;
  }
`

// Simple, dependency-free bulb icon so switching themes doesn't require
// adding an icon library to the project.
function BulbIcon({ lit }: { lit: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      style={{ color: 'var(--gold)' }}
    >
      <path
        d="M12 3a6.5 6.5 0 00-3.9 11.7c.55.42.9 1.03.9 1.7v.6a1 1 0 001 1h4a1 1 0 001-1v-.6c0-.67.35-1.28.9-1.7A6.5 6.5 0 0012 3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity={lit ? 0.28 : 0}
      />
      <path d="M10 20.5h4M10.5 22h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

// Warm ambient backdrop shown behind the light theme instead of the
// starfield — soft halos rather than literal stars, so it still reads as
// "celestial" without looking like a night sky pasted onto daylight.
function CreamGlow() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div
        className="absolute -top-40 -left-32 w-[520px] h-[520px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(176,125,31,0.16) 0%, transparent 70%)', filter: 'blur(70px)' }}
      />
      <div
        className="absolute top-1/4 -right-40 w-[460px] h-[460px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.14) 0%, transparent 70%)', filter: 'blur(80px)' }}
      />
      <div
        className="absolute bottom-0 left-1/3 w-[500px] h-[500px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(176,125,31,0.1) 0%, transparent 70%)', filter: 'blur(90px)' }}
      />
    </div>
  )
}

export default function App() {
  const [activeSection, setActiveSection] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'dark'
    const stored = window.localStorage.getItem('astrology-theme')
    return stored === 'light' || stored === 'dark' ? stored : 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    window.localStorage.setItem('astrology-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'))

  // Track scroll for active nav + scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'services', 'booking']
      for (const id of sections) {
        const el = document.getElementById(id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 120 && rect.bottom > 120) {
            setActiveSection(id)
            break
          }
        }
      }
      setShowScrollTop(window.scrollY > 500)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Auto-rotate testimonials
  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(p => (p + 1) % testimonials.length), 5000)
    return () => clearInterval(t)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMobileMenuOpen(false)
  }

  const sectionId = (link: string) =>
    link === 'Book' ? 'booking' : link.toLowerCase()

  // "Research" leaves the page entirely; every other link scrolls in-page.
  const handleNavClick = (link: string) => {
    if (link === 'Research') {
      setMobileMenuOpen(false)
      window.location.href = 'https://research.sujaldangal.com.np'
      return
    }
    scrollTo(sectionId(link))
  }

  return (
    <div className="relative min-h-screen text-stardust overflow-x-hidden">
      <style>{themeStyleSheet}</style>

      {theme === 'dark' ? <ConstellationSky /> : <CreamGlow />}
      <CornerSigil position="tl" />
      <CornerSigil position="tr" />
      <CornerSigil position="bl" />
      <CornerSigil position="br" />

      {/* ── Nav ─────────────────────────────────────────────────────────────── */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-16 py-5"
        style={{ background: 'var(--nav-bg)', backdropFilter: 'blur(10px)' }}
      >
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2 group"
        >
          <span className="text-gold text-xl group-hover:scale-110 transition-transform duration-300">✦</span>
          <span className="font-serif-display text-xl text-stardust-bright" style={{ letterSpacing: '0.25em' }}>astrologywithsujal</span>
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map(link => (
            <button
              key={link}
              onClick={() => handleNavClick(link)}
              className={`text-xs tracking-[0.2em] uppercase transition-colors duration-300 ${
                activeSection === sectionId(link) ? 'text-gold' : 'text-stardust-dim hover:text-gold'
              }`}
            >
              {link}
            </button>
          ))}
          <button
            onClick={() => scrollTo('booking')}
            className="text-xs tracking-[0.2em] uppercase px-5 py-2 rounded-full border border-gold text-gold hover:bg-gold hover:text-cosmic-deep transition-all duration-300"
            style={{ boxShadow: '0 0 15px rgba(212,175,55,0.2)' }}
          >
            Book Now
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            className="w-9 h-9 rounded-full flex items-center justify-center glass-card transition-transform duration-300 hover:scale-110"
          >
            <BulbIcon lit={theme === 'light'} />
          </button>
        </div>

        {/* Mobile controls */}
        <div className="md:hidden flex items-center gap-3 z-50">
          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            className="w-9 h-9 rounded-full flex items-center justify-center glass-card"
          >
            <BulbIcon lit={theme === 'light'} />
          </button>
          <button
            className="flex flex-col gap-1.5 p-1"
            onClick={() => setMobileMenuOpen(o => !o)}
          >
            {[0, 1, 2].map(i => (
              <motion.span
                key={i}
                className="block h-px bg-gold"
                style={{ width: i === 1 ? 20 : 28 }}
                animate={mobileMenuOpen
                  ? i === 0 ? { rotate: 45, y: 8, width: 28 }
                  : i === 1 ? { opacity: 0 }
                  : { rotate: -45, y: -8, width: 28 }
                  : { rotate: 0, y: 0, opacity: 1, width: i === 1 ? 20 : 28 }
                }
                transition={{ duration: 0.3 }}
              />
            ))}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8"
            style={{ background: 'var(--overlay-bg)', backdropFilter: 'blur(20px)' }}
          >
            {navLinks.map((link, i) => (
              <motion.button
                key={link}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => handleNavClick(link)}
                className="font-serif-display text-3xl text-stardust-bright hover:text-gold transition-colors"
              >
                {link}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center text-center px-6" style={{ minHeight: '92vh', paddingTop: '7rem' }}>
        <motion.p {...fadeUp(0.2)} className="field-label mb-8 tracking-[0.4em]">
          Vedic Astrology · Soul Mapping · Cosmic Counsel
        </motion.p>
        <motion.h1 {...fadeUp(0.4)} className="font-serif-display font-light leading-[1.08] mb-8" style={{ fontSize: 'clamp(2.8rem, 8vw, 6.5rem)' }}>
          <span className="text-stardust-bright">The stars have been</span>
          <br />
          <em className="text-glow-gold" style={{ fontStyle: 'italic' }}>waiting</em>
          <span className="text-stardust-bright"> for your</span>
          <br />
          <span className="text-stardust-bright">question.</span>
        </motion.h1>
        <motion.p {...fadeUp(0.55)} className="max-w-lg text-stardust-dim leading-relaxed text-base md:text-lg">
          Every birth chart is a map of your soul's journey. Let a master Vedic astrologer reveal
          the cosmic forces shaping your destiny — past, present, and what the universe holds next.
        </motion.p>
        <motion.div {...fadeUp(0.65)} className="w-full max-w-xs my-8">
          <OrnamentDivider />
        </motion.div>

        {/* Trust badges */}
        <motion.div {...fadeUp(0.7)} className="flex items-center gap-6 mb-10 text-center flex-wrap justify-center">
          {[['500+', 'Readings'], ['5★', 'Rated'], ['2+', 'Years Experience']].map(([n, l]) => (
            <div key={l} className="flex flex-col items-center">
              <span className="font-serif-display text-2xl text-gold">{n}</span>
              <span className="text-xs tracking-[0.2em] uppercase text-stardust-dim">{l}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          {...fadeUp(0.8)}
          className="flex flex-col items-center gap-3 cursor-pointer group"
          onClick={() => scrollTo('about')}
        >
          <span className="text-xs tracking-[0.25em] uppercase text-stardust-dim group-hover:text-gold transition-colors duration-300">Discover more</span>
          <motion.div
            className="w-px bg-gold-dim"
            animate={{ scaleY: [0.4, 1, 0.4], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ height: 50, transformOrigin: 'top' }}
          />
          <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-gold text-lg">✦</motion.div>
        </motion.div>
      </section>

      {/* ── About Me ─────────────────────────────────────────────────────────── */}
      <section id="about" className="relative py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="text-center mb-16"
          >
            <p className="field-label mb-4">The Astrologer</p>
            <h2 className="font-serif-display text-4xl md:text-5xl text-stardust-bright font-light">
              Meet <em className="italic text-gold">Sujal Dangal</em>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Portrait / sigil area */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="flex justify-center"
            >
              <div className="relative">
                {/* Outer glow ring */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, rgba(212,175,55,0.25) 0%, transparent 70%)',
                    filter: 'blur(30px)',
                    transform: 'scale(1.3)',
                  }}
                />
                {/* Rotating orbit ring */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ border: '1px solid rgba(212,175,55,0.3)' }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ border: '1px dashed rgba(212,175,55,0.15)', transform: 'scale(1.12)' }}
                  animate={{ rotate: -360 }}
                  transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
                />
                {/* Avatar placeholder with initials */}
                <div
                  className="relative w-56 h-56 md:w-72 md:h-72 rounded-full flex items-center justify-center glass-card"
                  style={{ border: '2px solid rgba(212,175,55,0.4)' }}
                >
                  <span className="font-serif-display text-7xl md:text-8xl text-gold" style={{ textShadow: '0 0 40px rgba(212,175,55,0.6)' }}>
                    SD
                  </span>
                  {/* Orbit dots */}
                  {[0, 72, 144, 216, 288].map((deg, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 rounded-full bg-gold"
                      style={{
                        top: '50%',
                        left: '50%',
                        transform: `rotate(${deg}deg) translateX(140px) translateY(-50%)`,
                        opacity: 0.6,
                      }}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 2, delay: i * 0.4, repeat: Infinity }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Bio text */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-6"
            >
              <p className="text-stardust leading-relaxed text-base md:text-lg">
                Namaste. I am <span className="text-gold font-medium">Sujal Dangal</span>, a dedicated Vedic astrologer based in the sacred valley of{' '}
                <span className="text-stardust-bright">Kathmandu, Nepal</span>. For over 3 years, I have studied the ancient science of Jyotish and have helped many get the light they have been missing!
              </p>
              <p className="text-stardust-dim leading-relaxed">
                My approach bridges classical Vedic wisdom with the deeply personal. Whether you seek guidance on relationships, career, health, or spiritual evolution, I read your birth chart as a living cosmic map — unique to you, precise in its timing, and profound in its counsel.
              </p>
              <p className="text-stardust-dim leading-relaxed">
                Every reading is conducted with care, confidentiality, and a genuine desire to help you align with your highest path. The stars do not lie — they simply await your willingness to listen.
              </p>

              {/* Specialties tags */}
              <div className="flex flex-wrap gap-2 pt-2">
                {['Vedic Jyotish', 'Nakshatra Analysis', 'Dasha Timing', 'Prashna', 'Relationship Charts', 'Spiritual Guidance'].map(tag => (
                  <span
                    key={tag}
                    className="text-xs tracking-[0.15em] uppercase px-3 py-1.5 rounded-full text-gold"
                    style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Social links */}
              <div className="flex items-center gap-4 pt-2">
                <a
                  href="https://instagram.com/astrologywithsujal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-stardust-dim hover:text-gold transition-colors duration-300 group"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="opacity-70 group-hover:opacity-100 transition-opacity">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  @astrologywithsujal
                </a>
                <span className="w-px h-4 bg-stardust-dim opacity-30" />
                <a
                  href="https://wa.me/9779765152413"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-stardust-dim hover:text-gold transition-colors duration-300 group"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="opacity-70 group-hover:opacity-100 transition-opacity">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Services ─────────────────────────────────────────────────────────── */}
      <section id="services" className="relative py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="text-center mb-16"
          >
            <p className="field-label mb-4">What I Offer</p>
            <h2 className="font-serif-display text-4xl md:text-5xl text-stardust-bright font-light">
              Astrology <em className="italic text-gold">Services</em>
            </h2>
            <p className="text-stardust-dim mt-4 max-w-md mx-auto leading-relaxed">
              Each reading is crafted with care, conducted over video call or WhatsApp voice call, and tailored entirely to you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.08 }}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                className="glass-card rounded-2xl p-6 md:p-8 relative overflow-hidden group cursor-default"
              >
                {/* Top shimmer on hover */}
                <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.8), transparent)' }} />

                <div className="text-3xl mb-4" style={{ filter: 'drop-shadow(0 0 10px rgba(212,175,55,0.5))' }}>{s.icon}</div>
                <p className="field-label mb-1">{s.subtitle}</p>
                <h3 className="font-serif-display text-xl text-stardust-bright mb-3">{s.title}</h3>
                <p className="text-stardust-dim text-sm leading-relaxed mb-5">{s.desc}</p>

                <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(212,175,55,0.15)' }}>
                  <span className="text-xs text-stardust-dim tracking-[0.15em]">⏱ {s.duration}</span>
                  <span className="font-serif-display text-lg text-gold">{s.price}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <button
              onClick={() => scrollTo('booking')}
              className="text-sm tracking-[0.2em] uppercase px-8 py-3 rounded-full border border-gold text-gold hover:bg-gold hover:text-cosmic-deep transition-all duration-300"
              style={{ boxShadow: '0 0 20px rgba(212,175,55,0.15)' }}
            >
              Book Your Session
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────────── */}
      <section className="relative py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.p className="field-label mb-4" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            What Seekers Say
          </motion.p>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTestimonial}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="glass-card rounded-2xl p-8 md:p-10"
            >
              <div className="flex justify-center gap-1 mb-5">
                {Array.from({ length: testimonials[activeTestimonial].stars }).map((_, i) => (
                  <span key={i} className="text-gold text-sm">★</span>
                ))}
              </div>
              <p className="font-serif-display text-xl md:text-2xl text-stardust-bright italic leading-relaxed mb-6">
                "{testimonials[activeTestimonial].text}"
              </p>
              <p className="field-label">— {testimonials[activeTestimonial].name}, {testimonials[activeTestimonial].location}</p>
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className="transition-all duration-300 rounded-full"
                style={{
                  width: i === activeTestimonial ? 24 : 8,
                  height: 8,
                  background: i === activeTestimonial ? 'var(--gold)' : 'var(--gold-dim)',
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Booking ──────────────────────────────────────────────────────────── */}
      <section id="booking" className="relative py-24 px-6">
        <div className="text-center mb-16">
          <motion.p className="field-label mb-4" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            Reserve Your Session
          </motion.p>
          <motion.h2
            className="font-serif-display text-4xl md:text-5xl text-stardust-bright font-light"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.1 }}
          >
            A <em className="italic text-gold">cosmic</em> dialogue awaits
          </motion.h2>
        </div>
        <BookingForm />
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="relative py-16 px-6 text-center">
        <OrnamentDivider />
        <motion.div className="mt-8 space-y-4" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <p className="font-serif-display text-lg text-stardust-dim italic">"As above, so below"</p>
          <div className="flex items-center justify-center gap-6">
            <a href="https://instagram.com/astrologywithsujal" target="_blank" rel="noopener noreferrer"
              className="text-xs tracking-[0.2em] uppercase text-stardust-dim hover:text-gold transition-colors">Instagram</a>
            <span className="text-gold opacity-40">✦</span>
            <a href="https://sujaldangal.com.np" target="_blank" rel="noopener noreferrer"
              className="text-xs tracking-[0.2em] uppercase text-stardust-dim hover:text-gold transition-colors">astrologywithsujal</a>
            <span className="text-gold opacity-40">✦</span>
            <button onClick={() => scrollTo('booking')}
              className="text-xs tracking-[0.2em] uppercase text-stardust-dim hover:text-gold transition-colors">Book Now</button>
          </div>
          <p className="text-xs tracking-[0.3em] uppercase text-stardust-dim" style={{ opacity: 0.4 }}>
            © {new Date().getFullYear()} astrologywithsujal · Vedic Astrology · Kathmandu, Nepal
          </p>
        </motion.div>
      </footer>

      {/* ── Scroll to top ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 z-40 w-11 h-11 rounded-full flex items-center justify-center glass-card"
            style={{ border: '1px solid rgba(212,175,55,0.4)', boxShadow: '0 0 20px rgba(212,175,55,0.2)' }}
            whileHover={{ scale: 1.1, boxShadow: '0 0 30px rgba(212,175,55,0.4)' }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-gold text-sm">↑</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}