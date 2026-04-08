'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { pillars } from '@/lib/theme';

// ═══════════════════════════════════════════════════════════════════════════
// TARTARY LANDING — Clean, Bold, Fast
// ═══════════════════════════════════════════════════════════════════════════

// ── SWINGGANG ICON ──────────────────────────────────────────────────────
const SwinggangIcon = ({ className = '' }: { className?: string }) => (
  <svg
    viewBox="0 0 200 240"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <line x1="40" y1="10" x2="100" y2="10" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
    <line x1="40" y1="10" x2="55" y2="200" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <line x1="160" y1="10" x2="100" y2="10" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
    <line x1="160" y1="10" x2="145" y2="200" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <line x1="80" y1="10" x2="75" y2="110" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="120" y1="10" x2="125" y2="110" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <rect x="70" y="110" width="60" height="6" rx="3" fill="currentColor" opacity="0.9" />
    <circle cx="100" cy="72" r="18" stroke="currentColor" strokeWidth="3" fill="none" />
    <rect x="85" y="67" width="13" height="8" rx="2" fill="currentColor" opacity="0.85" />
    <rect x="102" y="67" width="13" height="8" rx="2" fill="currentColor" opacity="0.85" />
    <line x1="98" y1="71" x2="102" y2="71" stroke="currentColor" strokeWidth="2" />
    <line x1="85" y1="71" x2="80" y2="69" stroke="currentColor" strokeWidth="1.5" />
    <line x1="115" y1="71" x2="120" y2="69" stroke="currentColor" strokeWidth="1.5" />
    <path d="M93 80 Q100 86 107 80" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
    <line x1="100" y1="90" x2="100" y2="112" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <path d="M100 96 Q88 94 78 50" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M100 96 Q112 94 122 50" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M100 112 Q94 130 85 145" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M100 112 Q106 130 115 145" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <ellipse cx="83" cy="148" rx="6" ry="3" fill="currentColor" opacity="0.7" />
    <ellipse cx="117" cy="148" rx="6" ry="3" fill="currentColor" opacity="0.7" />
  </svg>
);

// ── MOTION ──────────────────────────────────────────────────────────────

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

// ═══════════════════════════════════════════════════════════════════════════

export default function Home() {
  return (
    <main className="bg-obsidian text-bone">

      {/* ════════════════════ HERO ════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-center items-center px-6 md:px-10 pt-24">
        {/* Subtle radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 50% 40% at 50% 45%, rgba(255,102,0,0.05) 0%, transparent 70%)',
          }}
        />

        <motion.div
          className="relative z-10 text-center max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          {/* Swinggang icon */}
          <motion.div variants={fadeUp} className="flex justify-center mb-10">
            <SwinggangIcon className="w-24 h-28 md:w-32 md:h-36 text-orange" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-[0.2em] mb-8 logo-sheen"
            style={{ fontFamily: 'var(--font-logo)', fontWeight: 700 }}
          >
            TARTARY
          </motion.h1>

          {/* Tagline */}
          <motion.p
            variants={fadeUp}
            className="text-[16px] md:text-[18px] text-bone/50 max-w-md mx-auto mb-12 leading-relaxed"
            style={{ fontFamily: 'var(--font-logo)', fontWeight: 400 }}
          >
            Sovereign AI Conglomerate.
            <br />
            Every layer owned. Every tool built in-house.
          </motion.p>

          {/* CTA */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/universe"
              className="inline-block px-8 py-3.5 bg-orange text-obsidian text-[13px] tracking-[0.1em] uppercase hover:bg-orange-hot transition-colors duration-100"
              style={{ fontFamily: 'var(--font-logo)', fontWeight: 700 }}
            >
              Explore
            </Link>
            <Link
              href="#departments"
              className="inline-block px-8 py-3.5 border border-bone/20 text-bone/60 text-[13px] tracking-[0.1em] uppercase hover:border-bone/50 hover:text-bone transition-all duration-100"
              style={{ fontFamily: 'var(--font-logo)', fontWeight: 600 }}
            >
              Departments
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ════════════════════ DEPARTMENTS ════════════════════ */}
      <section id="departments" className="py-24 md:py-32 px-6 md:px-10 bg-obsidian">
        <div className="max-w-[1200px] mx-auto">
          {/* Section header */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
          >
            <h2
              className="text-4xl sm:text-5xl md:text-6xl tracking-[0.06em] mb-4"
              style={{ fontFamily: 'var(--font-logo)', fontWeight: 700 }}
            >
              Five Departments
            </h2>
            <p
              className="text-[15px] text-bone/40 max-w-lg"
              style={{ fontFamily: 'var(--font-logo)', fontWeight: 400 }}
            >
              One vertical stack. Everything from narrative to infrastructure, owned and operated.
            </p>
          </motion.div>

          {/* Pillar cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gunmetal/30"
            initial="hidden"
            whileInView="visible"
            variants={stagger}
            viewport={{ once: true }}
          >
            {pillars.map((pillar) => (
              <motion.div key={pillar.id} variants={fadeUp}>
                <Link href={pillar.href} className="block group">
                  <div className="bg-obsidian p-8 md:p-10 h-full hover:bg-obsidian-lit transition-colors duration-100">
                    {/* Pillar name */}
                    <h3
                      className="text-2xl md:text-3xl tracking-[0.06em] text-bone group-hover:text-orange transition-colors duration-100 mb-2"
                      style={{ fontFamily: 'var(--font-logo)', fontWeight: 700 }}
                    >
                      {pillar.label}
                    </h3>

                    {/* Tagline */}
                    <p
                      className="text-[14px] text-bone/30 mb-8"
                      style={{ fontFamily: 'var(--font-logo)', fontWeight: 400 }}
                    >
                      {pillar.tagline}
                    </p>

                    {/* Products */}
                    <div className="space-y-2">
                      {pillar.products.map((product) => (
                        <p
                          key={product.href}
                          className="text-[13px] text-bone/50 group-hover:text-bone/70 transition-colors duration-100"
                          style={{ fontFamily: 'var(--font-logo)', fontWeight: 500 }}
                        >
                          {product.name}
                        </p>
                      ))}
                    </div>

                    {/* Arrow */}
                    <div className="mt-8 flex items-center gap-2 text-bone/20 group-hover:text-orange transition-colors duration-100">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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

      {/* ════════════════════ STATEMENT ════════════════════ */}
      <section className="py-28 md:py-40 px-6 md:px-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-[0.04em] mb-6 leading-[0.95]"
              style={{ fontFamily: 'var(--font-logo)', fontWeight: 700 }}
            >
              One Machine.<br />
              <span className="text-orange">Infinite Output.</span>
            </h2>

            <p
              className="text-[15px] md:text-[16px] text-bone/40 leading-relaxed max-w-xl mx-auto mb-12"
              style={{ fontFamily: 'var(--font-logo)', fontWeight: 400 }}
            >
              We don&apos;t rent cloud. We don&apos;t outsource intelligence.
              Every tool, every film, every book, every app — built from scratch
              on hardware we own.
            </p>

            <Link
              href="/system"
              className="inline-block px-8 py-3.5 bg-orange text-obsidian text-[13px] tracking-[0.1em] uppercase hover:bg-orange-hot transition-colors duration-100"
              style={{ fontFamily: 'var(--font-logo)', fontWeight: 700 }}
            >
              See How It Works
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════ CTA ════════════════════ */}
      <section className="py-20 px-6 md:px-10 border-t border-white/[0.04]">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
          >
            <p
              className="text-[15px] text-bone/40 mb-6"
              style={{ fontFamily: 'var(--font-logo)', fontWeight: 400 }}
            >
              Build with us. Commission a film. License an IP.
            </p>
            <Link
              href="/contact"
              className="inline-block px-8 py-3.5 border border-orange text-orange text-[13px] tracking-[0.1em] uppercase hover:bg-orange hover:text-obsidian transition-all duration-100"
              style={{ fontFamily: 'var(--font-logo)', fontWeight: 700 }}
            >
              Get in Touch
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
