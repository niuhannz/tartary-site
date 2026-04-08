'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { pillars } from '@/lib/theme';

// ═══════════════════════════════════════════════════════════════════════════
// TARTARY LANDING PAGE — Sovereign AI Conglomerate Portal
// Hero + 5-Pillar Department Grid + System Statement
// ═══════════════════════════════════════════════════════════════════════════

// ── SWINGGANG ICON ──────────────────────────────────────────────────────
// Man on a swing wearing sunglasses — Vault-Boy style, thick strokes
const SwinggangIcon = ({ className = '' }: { className?: string }) => (
  <svg
    viewBox="0 0 200 240"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Swing frame — A-frame structure */}
    <line x1="40" y1="10" x2="100" y2="10" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
    <line x1="40" y1="10" x2="55" y2="200" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <line x1="160" y1="10" x2="100" y2="10" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
    <line x1="160" y1="10" x2="145" y2="200" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />

    {/* Swing ropes */}
    <line x1="80" y1="10" x2="75" y2="110" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="120" y1="10" x2="125" y2="110" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />

    {/* Swing seat */}
    <rect x="70" y="110" width="60" height="6" rx="3" fill="currentColor" opacity="0.9" />

    {/* ── THE GUY ── */}
    {/* Head */}
    <circle cx="100" cy="72" r="18" stroke="currentColor" strokeWidth="3" fill="none" />

    {/* Sunglasses — thick, cool */}
    <rect x="85" y="67" width="13" height="8" rx="2" fill="currentColor" opacity="0.85" />
    <rect x="102" y="67" width="13" height="8" rx="2" fill="currentColor" opacity="0.85" />
    <line x1="98" y1="71" x2="102" y2="71" stroke="currentColor" strokeWidth="2" />
    <line x1="85" y1="71" x2="80" y2="69" stroke="currentColor" strokeWidth="1.5" />
    <line x1="115" y1="71" x2="120" y2="69" stroke="currentColor" strokeWidth="1.5" />

    {/* Smile */}
    <path d="M93 80 Q100 86 107 80" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />

    {/* Body — sitting on swing */}
    <line x1="100" y1="90" x2="100" y2="112" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />

    {/* Arms reaching up to ropes */}
    <path d="M100 96 Q88 94 78 50" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M100 96 Q112 94 122 50" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />

    {/* Legs dangling */}
    <path d="M100 112 Q94 130 85 145" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M100 112 Q106 130 115 145" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />

    {/* Feet */}
    <ellipse cx="83" cy="148" rx="6" ry="3" fill="currentColor" opacity="0.7" />
    <ellipse cx="117" cy="148" rx="6" ry="3" fill="currentColor" opacity="0.7" />
  </svg>
);

// ── PILLAR ICONS — thick-stroke Vault-Boy style ─────────────────────────

const PillarIcons: Record<string, React.ReactNode> = {
  system: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      {/* Chip / processor */}
      <rect x="12" y="12" width="24" height="24" rx="2" />
      <rect x="18" y="18" width="12" height="12" rx="1" />
      {/* Pins */}
      <line x1="18" y1="8" x2="18" y2="12" /><line x1="24" y1="8" x2="24" y2="12" /><line x1="30" y1="8" x2="30" y2="12" />
      <line x1="18" y1="36" x2="18" y2="40" /><line x1="24" y1="36" x2="24" y2="40" /><line x1="30" y1="36" x2="30" y2="40" />
      <line x1="8" y1="18" x2="12" y2="18" /><line x1="8" y1="24" x2="12" y2="24" /><line x1="8" y1="30" x2="12" y2="30" />
      <line x1="36" y1="18" x2="40" y2="18" /><line x1="36" y1="24" x2="40" y2="24" /><line x1="36" y1="30" x2="40" y2="30" />
    </svg>
  ),
  studio: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      {/* Film clapperboard */}
      <path d="M8 14h32v26H8z" />
      <path d="M8 14l6-6h20l6 6" />
      <line x1="18" y1="8" x2="14" y2="14" />
      <line x1="28" y1="8" x2="24" y2="14" />
      {/* Play triangle */}
      <path d="M20 24v10l8-5z" fill="currentColor" opacity="0.6" />
    </svg>
  ),
  universe: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-8 h-8">
      {/* Star / cosmos */}
      <circle cx="24" cy="24" r="18" strokeDasharray="4 3" />
      <circle cx="24" cy="24" r="4" fill="currentColor" opacity="0.7" />
      <circle cx="14" cy="14" r="2" fill="currentColor" opacity="0.5" />
      <circle cx="36" cy="18" r="1.5" fill="currentColor" opacity="0.4" />
      <circle cx="16" cy="34" r="1.5" fill="currentColor" opacity="0.4" />
      <path d="M24 6v4M24 38v4M6 24h4M38 24h4" strokeWidth="1.5" />
    </svg>
  ),
  press: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      {/* Book / press */}
      <path d="M8 8v32c6-3 12-3 16 0V8c-4-3-10-3-16 0z" />
      <path d="M40 8v32c-6-3-12-3-16 0V8c4-3 10-3 16 0z" />
      <line x1="14" y1="16" x2="20" y2="16" strokeWidth="1.5" />
      <line x1="14" y1="22" x2="20" y2="22" strokeWidth="1.5" />
      <line x1="28" y1="16" x2="34" y2="16" strokeWidth="1.5" />
      <line x1="28" y1="22" x2="34" y2="22" strokeWidth="1.5" />
    </svg>
  ),
  civilian: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      {/* Person / civilian */}
      <circle cx="24" cy="14" r="7" />
      <path d="M12 40c0-7 5-12 12-12s12 5 12 12" />
      {/* Smile */}
      <path d="M21 15q3 3 6 0" strokeWidth="1.5" />
    </svg>
  ),
};

// ── MOTION VARIANTS ─────────────────────────────────────────────────────

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

// ═══════════════════════════════════════════════════════════════════════════
// PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function Home() {
  return (
    <main className="bg-obsidian text-bone">

      {/* ════════════════════════════════════════════════════════════════════
          HERO SECTION
          ════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-center items-center px-5 md:px-10 pt-20 overflow-hidden scanlines">
        {/* Background radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(255,102,0,0.06) 0%, transparent 70%)',
          }}
        />

        {/* Grid lines overlay — faint */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,102,0,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,102,0,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />

        <motion.div
          className="relative z-10 text-center max-w-5xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          {/* Swinggang icon */}
          <motion.div variants={fadeIn} className="flex justify-center mb-8">
            <SwinggangIcon className="w-28 h-32 md:w-36 md:h-40 text-orange" />
          </motion.div>

          {/* System prefix */}
          <motion.p
            variants={fadeUp}
            className="text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-orange/70 mb-4"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            SYS:// SOVEREIGN AI CONGLOMERATE
          </motion.p>

          {/* Main headline */}
          <motion.h1
            variants={fadeUp}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.25em] mb-6 logo-sheen"
            style={{ fontFamily: 'var(--font-logo)', fontWeight: 700 }}
          >
            TARTARY
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeUp}
            className="text-[13px] md:text-[15px] text-steel max-w-xl mx-auto mb-3 leading-relaxed"
            style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
          >
            From the metal to the soul. A sovereign vertical ecosystem
            — every layer owned, every tool built in-house.
          </motion.p>

          {/* Tagline */}
          <motion.p
            variants={fadeUp}
            className="text-[11px] text-ash tracking-[0.15em] uppercase mb-10"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            UNIVERSE &rarr; SYSTEM &rarr; STUDIO &rarr; PRESS &rarr; CIVILIAN
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/system" className="btn-terminal">
              ENTER SYSTEM
            </Link>
            <Link
              href="#departments"
              className="btn-terminal !border-gunmetal !text-steel hover:!border-orange hover:!text-orange"
            >
              VIEW DEPARTMENTS
            </Link>
          </motion.div>
        </motion.div>

        {/* Bottom metadata bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="absolute bottom-6 left-5 right-5 md:left-10 md:right-10 flex justify-between items-center"
        >
          <span className="text-[9px] tracking-[0.15em] uppercase text-ash/40" style={{ fontFamily: 'var(--font-mono)' }}>
            TARTARY.COM // v2.0
          </span>
          <span className="text-[9px] tracking-[0.15em] uppercase text-ash/40" style={{ fontFamily: 'var(--font-mono)' }}>
            <span className="text-green/60">●</span> ALL SYSTEMS NOMINAL
          </span>
          <span className="text-[9px] tracking-[0.15em] uppercase text-ash/40 hidden sm:block" style={{ fontFamily: 'var(--font-mono)' }}>
            LOS ANGELES &mdash; NASHVILLE
          </span>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          5-PILLAR DEPARTMENT GRID
          ════════════════════════════════════════════════════════════════════ */}
      <section id="departments" className="py-20 md:py-28 px-5 md:px-10 bg-obsidian">
        <div className="max-w-[1400px] mx-auto">
          {/* Section header */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-4 mb-4">
              <span className="text-[9px] tracking-[0.2em] text-orange/50" style={{ fontFamily: 'var(--font-mono)' }}>
                DIR://
              </span>
              <div className="rule-orange flex-1" />
            </div>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl text-bone"
              style={{ fontFamily: 'var(--font-headline)', fontWeight: 900 }}
            >
              DEPARTMENTS
            </h2>
            <p
              className="text-[12px] text-steel mt-3 max-w-lg"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              Five divisions. One vertical stack. Everything from infrastructure
              to narrative, owned and operated on sovereign hardware.
            </p>
          </motion.div>

          {/* Pillar cards grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            initial="hidden"
            whileInView="visible"
            variants={stagger}
            viewport={{ once: true }}
          >
            {pillars.map((pillar) => (
              <motion.div key={pillar.id} variants={fadeUp}>
                <Link href={pillar.href} className="block">
                  <div className="pillar-card group h-full">
                    {/* Top row: index + icon */}
                    <div className="flex items-start justify-between mb-6">
                      <span
                        className="text-[10px] text-ash/40 group-hover:text-orange/60 transition-colors duration-[80ms]"
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        {pillar.idx}
                      </span>
                      <div className="text-steel group-hover:text-orange transition-colors duration-[80ms]">
                        {PillarIcons[pillar.id]}
                      </div>
                    </div>

                    {/* Pillar name */}
                    <h3
                      className="text-2xl md:text-3xl text-bone group-hover:text-orange transition-colors duration-[80ms] mb-2"
                      style={{ fontFamily: 'var(--font-headline)', fontWeight: 900 }}
                    >
                      {pillar.label}
                    </h3>

                    {/* Tagline */}
                    <p
                      className="text-[11px] text-steel mb-6"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      {pillar.tagline}
                    </p>

                    {/* Product list */}
                    <div className="border-t border-gunmetal pt-4">
                      {pillar.products.map((product, i) => (
                        <div
                          key={product.href}
                          className="flex items-center gap-2 py-1 text-[10px] text-ash group-hover:text-steel transition-colors duration-[80ms]"
                          style={{ fontFamily: 'var(--font-mono)' }}
                        >
                          <span className="text-orange/30 group-hover:text-orange/60 transition-colors duration-[80ms]">
                            {String(i).padStart(2, '0')}
                          </span>
                          <span className="w-[3px] h-[3px] bg-orange/20 group-hover:bg-orange/50 transition-colors duration-[80ms]" />
                          <span className="tracking-[0.1em] uppercase">{product.name}</span>
                        </div>
                      ))}
                    </div>

                    {/* Execute link */}
                    <div className="mt-6 flex items-center gap-2">
                      <span
                        className="text-[10px] tracking-[0.15em] uppercase text-ash group-hover:text-orange transition-colors duration-[80ms]"
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        [ENTER]
                      </span>
                      <svg
                        className="w-3 h-3 text-ash group-hover:text-orange transition-colors duration-[80ms]"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          SYSTEM STATEMENT
          ════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 px-5 md:px-10 bg-obsidian-mid relative overflow-hidden">
        {/* Ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(255,102,0,0.03) 0%, transparent 60%)' }}
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
          >
            <p
              className="text-[10px] tracking-[0.25em] uppercase text-orange/50 mb-6"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              MANIFESTO
            </p>

            <h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-8 text-bone leading-[1.05]"
              style={{ fontFamily: 'var(--font-headline)', fontWeight: 900 }}
            >
              ONE MACHINE.<br />
              <span className="text-orange">INFINITE OUTPUT.</span>
            </h2>

            <div className="rule-orange w-16 mx-auto mb-8" />

            <p
              className="text-[13px] md:text-[14px] text-steel leading-relaxed max-w-2xl mx-auto mb-10"
              style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
            >
              TARTARY is a sovereign AI conglomerate. We don't rent cloud. We don't outsource intelligence.
              Every tool, every film, every book, every app — built from scratch on hardware we own.
              The OS is the foundry. The tools are the engine. Everything above it is ours.
            </p>

            <Link href="/system" className="btn-terminal">
              EXPLORE THE STACK
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          TERMINAL CTA
          ════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-5 md:px-10 bg-obsidian">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="terminal-box !p-8 !pl-10 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
            viewport={{ once: true }}
          >
            <p className="text-orange text-[11px] tracking-[0.2em] uppercase mb-4" style={{ fontFamily: 'var(--font-mono)' }}>
              &gt; TARTARY_CONSOLE
            </p>
            <p className="text-steel text-[12px] leading-relaxed mb-6" style={{ fontFamily: 'var(--font-mono)' }}>
              Want to build with us? Commission a film? License an IP?
              Partner on sovereign AI infrastructure?
            </p>
            <Link href="/contact" className="btn-terminal">
              INITIATE CONTACT
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
