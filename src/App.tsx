import { motion } from 'framer-motion'
import ConstellationSky from './components/cosmic/ConstellationSky'
import BookingForm from './components/cosmic/BookingForm'
import { CornerSigil, OrnamentDivider } from './components/cosmic/Ornaments'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] },
})

export default function App() {
  return (
    <div className="relative min-h-screen text-stardust overflow-x-hidden">
      <ConstellationSky />
      <CornerSigil position="tl" />
      <CornerSigil position="tr" />
      <CornerSigil position="bl" />
      <CornerSigil position="br" />

      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-16 py-6"
        style={{ background: 'linear-gradient(180deg, rgba(5,8,22,0.85) 0%, transparent 100%)', backdropFilter: 'blur(8px)' }}
      >
        <div className="flex items-center gap-2">
          <span className="text-gold" style={{ fontSize: 18 }}>✦</span>
          <span className="font-serif-display text-xl text-stardust-bright" style={{ letterSpacing: '0.25em' }}>astrologywithsujal</span>
        </div>
        <nav className="hidden md:flex items-center gap-10">
          {['Readings', 'Astrologers', 'Book'].map(link => (
            <a
              key={link} href="#"
              className="text-xs tracking-[0.2em] uppercase text-stardust-dim hover:text-gold transition-colors duration-300"
              onClick={link === 'Book' ? (e) => { e.preventDefault(); document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' }) } : undefined}
            >{link}</a>
          ))}
        </nav>
      </motion.nav>

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center px-6" style={{ minHeight: '88vh', paddingTop: '7rem' }}>
        <motion.p {...fadeUp(0.2)} className="field-label mb-8 tracking-[0.4em]">
          Astrology · Soul Mapping · Cosmic Counsel
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
          Every birth chart is a map of your soul's journey. Let our master astrologers reveal
          the cosmic forces shaping your destiny — past, present, and what the universe holds next.
        </motion.p>
        <motion.div {...fadeUp(0.65)} className="w-full max-w-xs my-8">
          <OrnamentDivider />
        </motion.div>
        <motion.div
          {...fadeUp(0.75)}
          className="flex flex-col items-center gap-3 cursor-pointer group"
          onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <span className="text-xs tracking-[0.25em] uppercase text-stardust-dim group-hover:text-gold transition-colors duration-300">Begin the journey</span>
          <motion.div
            className="w-px bg-gold-dim"
            animate={{ scaleY: [0.4, 1, 0.4], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ height: 50, transformOrigin: 'top' }}
          />
          <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-gold text-lg">✦</motion.div>
        </motion.div>
      </section>

      {/* Booking */}
      <section id="booking" className="relative py-24 px-6">
        <div className="text-center mb-16">
          <motion.p className="field-label mb-4" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            Reserve Your Session
          </motion.p>
          <motion.h2 className="font-serif-display text-4xl md:text-5xl text-stardust-bright font-light" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}>
            A <em className="italic text-gold">cosmic</em> dialogue awaits
          </motion.h2>
        </div>
        <BookingForm />
      </section>

      {/* Footer */}
      <footer className="relative py-16 px-6 text-center">
        <OrnamentDivider />
        <motion.div className="mt-8 space-y-2" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <p className="font-serif-display text-lg text-stardust-dim italic">"As above, so below"</p>
          <p className="text-xs tracking-[0.3em] uppercase text-stardust-dim" style={{ opacity: 0.5 }}>
            © {new Date().getFullYear()} astrologywithsujal · All rights reserved · Crafted under the stars
          </p>
        </motion.div>
      </footer>
    </div>
  )
}
