'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import PageHeader from '@/components/PageHeader';
import SectionReveal from '@/components/SectionReveal';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut' as const,
    },
  },
} as const;

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut' as const,
    },
  },
} as const;

// Cross-media platforms
const platforms = [
  { name: 'Cinema', icon: '🎬' },
  { name: 'Games', icon: '🎮' },
  { name: 'Publishing', icon: '📖' },
  { name: 'Interactive', icon: '🌐' },
];

export default function WorldsPage() {
  return (
    <main className="bg-background text-foreground">
      {/* ──────────────────────────────────────────── PAGE HEADER ─────────────────────────────────────────── */}
      <PageHeader
        label="Worlds"
        title="Where Universes Begin"
        description="Original intellectual property that transcends mediums. We build rich fictional worlds designed from the ground up to span cinema, games, publishing, and beyond."
      />

      {/* ──────────────────────────────────────────── PHILOSOPHY SECTION ─────────────────────────────────────────── */}
      <section className="py-24 sm:py-40 px-4 sm:px-6 lg:px-8 bg-carbon">
        <div className="max-w-6xl mx-auto">
          <SectionReveal>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9 }}
                viewport={{ once: true }}
              >
                <p
                  className="text-3xl sm:text-4xl lg:text-5xl leading-tight text-gold-light"
                  style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 300 }}
                >
                  Worlds are the seeds from which all stories grow.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <p className="text-lg sm:text-xl text-mist leading-relaxed mb-6" style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}>
                  A great fictional universe doesn&apos;t exist in isolation. It&apos;s the foundation upon which entire narratives are built&mdash;stories that expand across film, interactive experiences, novels, games, and immersive media yet to be invented.
                </p>
                <p className="text-lg sm:text-xl text-ash leading-relaxed" style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}>
                  At TARTARY&apos;s WORLDS division, we craft universes with transmedia architecture built in from day one. Every element&mdash;geography, history, mythology, technology&mdash;is designed to breathe and expand across multiple narrative formats.
                </p>
              </motion.div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ──────────────────────────────────────────── EXPLORE THE GLOBE CTA ─────────────────────────────────────────── */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
        {/* Cosmic glow */}
        <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(0, 212, 255, 0.08) 0%, transparent 60%)' }} />

        <div className="max-w-5xl mx-auto relative z-10">
          <SectionReveal>
            <Link href="/worlds/explore">
              <motion.div
                className="group relative rounded-2xl overflow-hidden cursor-pointer"
                style={{
                  background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #0d0d0d 70%)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
                whileHover={{ y: -4, scale: 1.005 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <div className="relative py-16 sm:py-24 px-8 sm:px-16 text-center">
                  {/* Animated star dots */}
                  {[
                    { x: 10, y: 20, delay: 0, color: '#ff4d00' },
                    { x: 85, y: 30, delay: 1.2, color: '#00d4ff' },
                    { x: 25, y: 75, delay: 0.6, color: '#d4a574' },
                    { x: 70, y: 70, delay: 1.8, color: '#a0886e' },
                    { x: 50, y: 15, delay: 0.3, color: '#c9a96e' },
                    { x: 90, y: 80, delay: 2.1, color: '#ff4d00' },
                    { x: 15, y: 50, delay: 1.5, color: '#00d4ff' },
                  ].map((dot, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 rounded-full"
                      style={{ left: `${dot.x}%`, top: `${dot.y}%`, backgroundColor: dot.color }}
                      animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.8, 1.2, 0.8] }}
                      transition={{ duration: 3, repeat: Infinity, delay: dot.delay, ease: 'easeInOut' }}
                    />
                  ))}

                  {/* Globe icon */}
                  <motion.div
                    className="mx-auto mb-8 w-20 h-20 rounded-full flex items-center justify-center"
                    style={{ border: '1px solid rgba(201, 169, 110, 0.3)' }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                  </motion.div>

                  <span
                    className="text-[11px] tracking-[0.3em] uppercase block mb-4"
                    style={{ fontFamily: 'var(--font-mono)', color: '#c9a96e' }}
                  >
                    Interactive Experience
                  </span>
                  <h3
                    className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-foreground group-hover:text-gold transition-colors duration-500"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    Explore the Globe
                  </h3>
                  <p
                    className="text-base sm:text-lg text-ash max-w-xl mx-auto mb-8 leading-relaxed"
                    style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
                  >
                    Navigate four realities in 3D. Rotate the globe, switch between worlds, and unfold each one into its interactive map.
                  </p>

                  {/* World indicator pills */}
                  <div className="flex flex-wrap justify-center gap-3 mb-8">
                    {[
                      { name: 'HEAVENFALL', color: '#ff4d00' },
                      { name: 'MARGIN', color: '#d4a574' },
                      { name: 'XT111', color: '#00d4ff' },
                      { name: 'THE UNRECORDED', color: '#a0886e' },
                    ].map((w) => (
                      <span
                        key={w.name}
                        className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 rounded-full"
                        style={{
                          fontFamily: 'var(--font-mono)',
                          color: w.color,
                          border: `1px solid ${w.color}30`,
                          backgroundColor: `${w.color}08`,
                        }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: w.color }} />
                        {w.name}
                      </span>
                    ))}
                  </div>

                  <div className="inline-flex items-center gap-2 px-6 py-3 border border-gold/40 text-gold rounded-full group-hover:bg-gold group-hover:text-carbon transition-all duration-300">
                    <span className="text-sm tracking-wider uppercase" style={{ fontFamily: 'var(--font-heading)', fontWeight: 500 }}>Enter the Globe</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            </Link>
          </SectionReveal>
        </div>
      </section>

      {/* ──────────────────────────────────────────── BASEBORN — FEATURED UNIVERSE ─────────────────────────────────────────── */}
      <section className="py-24 sm:py-40 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
        {/* Ember glow */}
        <motion.div
          className="absolute inset-0 opacity-10"
          style={{ background: 'radial-gradient(circle at 50% 30%, rgba(255, 77, 0, 0.15) 0%, transparent 60%)' }}
          animate={{ opacity: [0.08, 0.15, 0.08] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          <SectionReveal delay={0.1}>
            <motion.div
              className="mb-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <span
                className="text-xs uppercase tracking-[0.3em] text-[#ff4d00] block mb-6"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                Featured Universe
              </span>
              <h2
                className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-foreground"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                BASEBORN
              </h2>
              <p
                className="text-lg sm:text-xl text-gold-light mb-2"
                style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 300 }}
              >
                The Rise of Valdria &mdash; The War of Ash and Storm
              </p>
              <div className="separator w-24 h-0.5 bg-[#ff4d00] mx-auto my-8 opacity-60" />
              <p className="text-base sm:text-lg text-mist max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: 'var(--font-display)' }}>
                A sweeping fantasy epic reimagining the fall of an empire and the rise of a peasant king. When the ancient order collapses, two titans&mdash;Maren Ashford and Kharic Stormborn&mdash;wage a war that will reshape civilisation itself. Inspired by one of history&apos;s greatest conflicts, BASEBORN is a transmedia universe spanning novels, cinema, interactive experiences, and games.
              </p>
            </motion.div>
          </SectionReveal>

          {/* Format badges */}
          <motion.div
            className="flex flex-wrap gap-3 justify-center mb-16"
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            viewport={{ once: true }}
          >
            {['Novel Series', 'Feature Film', 'Interactive Map', 'Game Adaptation', 'Animated Series'].map((format, idx) => (
              <motion.span
                key={format}
                variants={badgeVariants}
                transition={{ delay: idx * 0.1 }}
                className="text-xs uppercase tracking-widest px-4 py-2 border border-[#ff4d00]/40 text-[#ff4d00] rounded-full hover:border-[#ff4d00] hover:bg-[#ff4d00]/10 transition-all duration-500"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {format}
              </motion.span>
            ))}
          </motion.div>

          {/* Interactive Map CTA */}
          <SectionReveal delay={0.2}>
            <Link href="/worlds/map">
              <motion.div
                className="group relative rounded-xl overflow-hidden border-2 border-[#ff4d00]/30 hover:border-[#ff4d00] transition-all duration-500 cursor-pointer"
                whileHover={{ y: -4 }}
              >
                {/* Map preview background */}
                <div className="relative h-72 sm:h-96 lg:h-[480px] bg-[#0d0d0d] overflow-hidden">
                  {/* Simulated map preview */}
                  <div className="absolute inset-0" style={{
                    background: `
                      radial-gradient(ellipse at 30% 20%, #2a2520 0%, transparent 50%),
                      radial-gradient(ellipse at 70% 80%, #2a2520 0%, transparent 50%),
                      radial-gradient(ellipse at 50% 50%, #1a1a1a 0%, #0d0d0d 100%)
                    `
                  }} />

                  {/* Grid overlay */}
                  <svg className="absolute inset-0 w-full h-full opacity-10">
                    <defs>
                      <pattern id="preview-grid" width="10%" height="10%" patternUnits="userSpaceOnUse">
                        <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#3a3a3a" strokeWidth="0.5" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#preview-grid)" />
                  </svg>

                  {/* Realm boundary indicators */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                    <ellipse cx="28%" cy="42%" rx="10%" ry="8%" fill="#4a4a4a" fillOpacity="0.15" stroke="#4a4a4a" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="5,5" />
                    <ellipse cx="55%" cy="68%" rx="12%" ry="9%" fill="#8b0000" fillOpacity="0.15" stroke="#8b0000" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="5,5" />
                    <ellipse cx="20%" cy="58%" rx="9%" ry="7%" fill="#2f4f4f" fillOpacity="0.15" stroke="#2f4f4f" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="5,5" />
                    <ellipse cx="75%" cy="38%" rx="10%" ry="8%" fill="#daa520" fillOpacity="0.15" stroke="#daa520" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="5,5" />
                    <ellipse cx="55%" cy="25%" rx="10%" ry="7%" fill="#4682b4" fillOpacity="0.15" stroke="#4682b4" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="5,5" />
                  </svg>

                  {/* Sample markers */}
                  {[
                    { x: 25, y: 45, color: '#ff4d00', pulse: true },
                    { x: 58, y: 52, color: '#ff4d00', pulse: true },
                    { x: 22, y: 55, color: '#ff4d00', pulse: true },
                    { x: 60, y: 58, color: '#dc143c', pulse: false },
                    { x: 45, y: 48, color: '#dc143c', pulse: false },
                    { x: 52, y: 30, color: '#8b7355', pulse: false },
                    { x: 35, y: 42, color: '#8b7355', pulse: false },
                  ].map((marker, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-3 h-3 rounded-full border"
                      style={{
                        left: `${marker.x}%`,
                        top: `${marker.y}%`,
                        backgroundColor: `${marker.color}30`,
                        borderColor: marker.color,
                        boxShadow: `0 0 10px ${marker.color}60`,
                        transform: 'translate(-50%, -50%)'
                      }}
                      animate={marker.pulse ? { scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] } : {}}
                      transition={marker.pulse ? { duration: 2, repeat: Infinity, delay: i * 0.3 } : {}}
                    />
                  ))}

                  {/* River lines */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-60">
                    <defs>
                      <linearGradient id="river-preview" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#4a90d9" stopOpacity="0.1" />
                        <stop offset="50%" stopColor="#4a90d9" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#4a90d9" stopOpacity="0.1" />
                      </linearGradient>
                    </defs>
                    <path d="M 15 35 L 35 30 L 55 32 L 75 28 L 90 35" stroke="url(#river-preview)" strokeWidth="2" fill="none" strokeLinecap="round" />
                    <path d="M 10 65 L 30 62 L 50 58 L 70 60 L 90 55" stroke="url(#river-preview)" strokeWidth="2" fill="none" strokeLinecap="round" />
                  </svg>

                  {/* Era watermark */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03]">
                    <span className="text-7xl sm:text-8xl lg:text-9xl font-bold tracking-widest text-[#ff4d00] whitespace-nowrap">BASEBORN</span>
                  </div>

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-[#0d0d0d]/50" />

                  {/* CTA content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.div
                      className="text-center"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      viewport={{ once: true }}
                    >
                      <div className="mb-4 inline-flex items-center gap-2 px-4 py-2 bg-[#ff4d00]/20 border border-[#ff4d00]/40 rounded-full">
                        <span className="text-[#ff4d00] text-sm" style={{ fontFamily: 'var(--font-mono)' }}>INTERACTIVE</span>
                      </div>
                      <h3
                        className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#e6d5ac] mb-4 group-hover:text-[#ff4d00] transition-colors duration-500"
                        style={{ fontFamily: 'var(--font-heading)' }}
                      >
                        Explore The Realm
                      </h3>
                      <p className="text-[#888] text-sm sm:text-base max-w-lg mx-auto mb-6" style={{ fontFamily: 'var(--font-display)' }}>
                        Navigate two eras of history. Discover capitals, battlefields, rivers, and the lore of every corner of this world.
                      </p>
                      <div className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#ff4d00] text-[#ff4d00] rounded group-hover:bg-[#ff4d00] group-hover:text-white transition-all duration-300">
                        <span className="text-sm font-medium tracking-wider uppercase" style={{ fontFamily: 'var(--font-heading)' }}>Enter the Map</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </Link>
          </SectionReveal>

          {/* The Two Eras */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 mt-20"
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            viewport={{ once: true }}
          >
            <motion.div variants={itemVariants} className="p-8 sm:p-10 border border-[#e6d5ac]/20 rounded-lg hover:border-[#e6d5ac]/60 transition-all duration-500 bg-gradient-to-br from-[#1a1a1a]/50 to-transparent">
              <span className="text-xs uppercase tracking-widest text-[#e6d5ac] mb-4 block" style={{ fontFamily: 'var(--font-mono)' }}>Era I</span>
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Heavenfall</h3>
              <p className="text-mist leading-relaxed mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                The age of the Ancient Fifteen&mdash;when sacred kings ruled from jade spires and the Mandate of Heaven was more than myth. An era of philosophy, ambition, and inevitable ruin.
              </p>
              <p className="text-ash text-sm leading-relaxed" style={{ fontFamily: 'var(--font-display)' }}>
                Explore Ironhold, Valdros, Aldoria, Celestine, and the other great realms that shaped the world before its fall. Visit Hallowmere, where the beacons burned for a smile, and walk the corridors of Luminara, where Heaven&apos;s Mandate first touched mortal soil.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="p-8 sm:p-10 border border-[#ff4d00]/20 rounded-lg hover:border-[#ff4d00]/60 transition-all duration-500 bg-gradient-to-br from-[#1a0a0a]/50 to-transparent">
              <span className="text-xs uppercase tracking-widest text-[#ff4d00] mb-4 block" style={{ fontFamily: 'var(--font-mono)' }}>Era II</span>
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4" style={{ fontFamily: 'var(--font-heading)' }}>BASEBORN</h3>
              <p className="text-mist leading-relaxed mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                The War of Ash and Storm. When a peasant named Maren Ashford and a warlord named Kharic Stormborn tore the old world apart and forged a new one from blood and iron.
              </p>
              <p className="text-ash text-sm leading-relaxed" style={{ fontFamily: 'var(--font-display)' }}>
                Trace the battlefields of Gallow&apos;s Field and Ashford&apos;s Gorge. Follow the Ghost Road. Stand at The Hollow where the realm was divided&mdash;and the treaty broken before the ink dried.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ──────────────────────────────────────────── KEY CHARACTERS ─────────────────────────────────────────── */}
      <section className="py-24 sm:py-40 px-4 sm:px-6 lg:px-8 bg-charcoal">
        <div className="max-w-6xl mx-auto">
          <SectionReveal delay={0.1}>
            <motion.div
              className="mb-16 sm:mb-20 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2
                className="text-4xl sm:text-5xl lg:text-6xl font-light mb-6 text-foreground"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                The War of Two Kings
              </h2>
              <div className="separator w-12 h-0.5 bg-gold mx-auto mb-8 opacity-60" />
            </motion.div>
          </SectionReveal>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10"
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            viewport={{ once: true }}
          >
            {[
              {
                name: 'Maren Ashford',
                title: 'The Peasant King',
                accent: '#2f4f4f',
                description: 'Born common. Exiled to the worst land in the realm. Through cunning, patience, and an iron will, he forged an empire from nothing. Where Kharic burned, Maren built.',
              },
              {
                name: 'Kharic Stormborn',
                title: 'The Hegemon',
                accent: '#8b0000',
                description: 'A force of nature wrapped in crimson banners. Kharic conquered by sheer force of personality and violence. He divided the realm among his loyalists and ruled from Drumhold with fire and fury.',
              },
              {
                name: 'Hank Xander',
                title: 'The Strategist',
                accent: '#daa520',
                description: 'The greatest military mind of the age. Hank fought with mathematics, sandbags, and deception. His gambits at The Needle\'s Eye and The Sandbag River rewrote the art of war.',
              },
            ].map((character) => (
              <motion.div
                key={character.name}
                variants={itemVariants}
                className="p-8 sm:p-10 border rounded-lg transition-all duration-500 hover:bg-white/[0.02]"
                style={{ borderColor: `${character.accent}40` }}
              >
                <div className="w-3 h-3 rounded-full mb-6" style={{ backgroundColor: character.accent, boxShadow: `0 0 20px ${character.accent}60` }} />
                <p className="text-xs uppercase tracking-widest mb-2" style={{ fontFamily: 'var(--font-mono)', color: character.accent }}>
                  {character.title}
                </p>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                  {character.name}
                </h3>
                <p className="text-sm sm:text-base text-mist leading-relaxed" style={{ fontFamily: 'var(--font-display)' }}>
                  {character.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ──────────────────────────────────────────── CROSS-MEDIA APPROACH ─────────────────────────────────────────── */}
      <section className="py-24 sm:py-40 px-4 sm:px-6 lg:px-8 bg-carbon">
        <div className="max-w-6xl mx-auto">
          <SectionReveal delay={0.1}>
            <motion.div
              className="mb-16 sm:mb-20 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light mb-6 text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
                Transmedia by Design
              </h2>
              <div className="separator w-12 h-0.5 bg-gold mx-auto mb-8 opacity-60" />
              <p className="text-lg text-mist max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-display)' }}>
                Each world is engineered from its foundation to live and thrive across multiple media formats simultaneously.
              </p>
            </motion.div>
          </SectionReveal>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
              <div className="relative">
                <motion.div
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-2 border-gold border-opacity-50 flex items-center justify-center"
                  animate={{ boxShadow: ['0 0 20px rgba(201, 169, 110, 0.2)', '0 0 40px rgba(201, 169, 110, 0.4)', '0 0 20px rgba(201, 169, 110, 0.2)'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <div className="text-center">
                    <p className="text-sm uppercase tracking-widest text-gold mb-2" style={{ fontFamily: 'var(--font-mono)' }}>The</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gold-light" style={{ fontFamily: 'var(--font-heading)' }}>World</p>
                  </div>
                </motion.div>
              </div>

              <div className="grid grid-cols-2 gap-6 sm:gap-8">
                {platforms.map((platform, idx) => (
                  <motion.div
                    key={platform.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1, duration: 0.6 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center gap-3"
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg border border-gold border-opacity-30 flex items-center justify-center text-3xl sm:text-4xl hover:border-opacity-100 hover:bg-gold hover:bg-opacity-5 transition-all duration-500">
                      {platform.icon}
                    </div>
                    <p className="text-sm uppercase tracking-widest text-ash hover:text-gold transition-colors duration-500" style={{ fontFamily: 'var(--font-mono)' }}>
                      {platform.name}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ──────────────────────────────────────────── THE PROCESS ─────────────────────────────────────────── */}
      <section className="py-24 sm:py-40 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-6xl mx-auto">
          <SectionReveal delay={0.1}>
            <motion.div
              className="mb-16 sm:mb-24 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light mb-6 text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
                Building Your World
              </h2>
              <div className="separator w-12 h-0.5 bg-gold mx-auto mb-8 opacity-60" />
            </motion.div>
          </SectionReveal>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10"
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            viewport={{ once: true }}
          >
            {[
              { number: '01', title: 'Foundation', description: 'We establish the core mythology, geography, and physics of your world. What are its rules? What makes it unique?' },
              { number: '02', title: 'Architecture', description: 'We design the transmedia framework\u2014how stories branch across cinema, games, books, and interactive experiences.' },
              { number: '03', title: 'Execution', description: 'We bring the world to life across your chosen formats, with TARTARY\u2019s divisions handling each medium.' },
            ].map((step) => (
              <motion.div
                key={step.number}
                variants={itemVariants}
                className="p-8 sm:p-10 border border-gold border-opacity-30 rounded-lg hover:border-opacity-100 hover:bg-gold hover:bg-opacity-5 transition-all duration-500"
              >
                <p className="text-lg sm:text-xl font-bold text-gold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>{step.number}</p>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4" style={{ fontFamily: 'var(--font-heading)' }}>{step.title}</h3>
                <p className="text-sm sm:text-base text-mist leading-relaxed" style={{ fontFamily: 'var(--font-display)' }}>{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ──────────────────────────────────────────── FINAL CTA ─────────────────────────────────────────── */}
      <section className="py-32 sm:py-48 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-carbon to-charcoal relative overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{ background: 'radial-gradient(circle at center, rgba(201, 169, 110, 0.05) 0%, transparent 70%)' }}
          animate={{ opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <SectionReveal delay={0.1}>
            <motion.h2
              className="text-5xl sm:text-6xl lg:text-7xl font-light mb-8 text-foreground leading-tight"
              style={{ fontFamily: 'var(--font-heading)' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
              viewport={{ once: true }}
            >
              Have a World Waiting to Be Born?
            </motion.h2>

            <motion.p
              className="text-lg sm:text-xl text-mist mb-12 max-w-2xl mx-auto leading-relaxed"
              style={{ fontFamily: 'var(--font-display)' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              viewport={{ once: true }}
            >
              Whether you have a full universe in mind or just the seed of an idea, we can help you architect and bring it to life across any medium you envision.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Link
                href="/contact"
                className="px-10 py-4 border-2 border-gold text-gold hover:bg-gold hover:text-carbon transition-all duration-300 font-light tracking-wider text-lg rounded"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Start a World With Us
              </Link>
              <Link
                href="/worlds/explore"
                className="px-10 py-4 border-2 border-[#ff4d00] border-opacity-60 text-[#ff4d00] hover:bg-[#ff4d00] hover:text-white transition-all duration-300 font-light tracking-wider text-lg rounded"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Explore the Globe
              </Link>
            </motion.div>
          </SectionReveal>
        </div>
      </section>
    </main>
  );
}
