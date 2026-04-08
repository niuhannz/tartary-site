'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { pillars } from '@/lib/theme';

// ═══════════════════════════════════════════════════════════════════════════
// TARTARY — Editorial landing page
// Serif headlines for authority, sans for utility, generous whitespace
// ═══════════════════════════════════════════════════════════════════════════

const SwinggangIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 200 240" fill="none" className={className}>
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

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function Home() {
  return (
    <main>
      {/* ════════════════════ HERO ════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-center items-center px-6 md:px-10 bg-obsidian">
        <motion.div
          className="relative z-10 text-center max-w-3xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.div variants={fadeUp} className="flex justify-center mb-12">
            <SwinggangIcon className="w-20 h-24 md:w-28 md:h-32 text-orange" />
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.2em] mb-10 logo-sheen"
            style={{ fontFamily: 'var(--font-logo)', fontWeight: 700, lineHeight: 1.0 }}
          >
            TARTARY
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-[18px] md:text-[20px] text-warm-silver max-w-lg mx-auto mb-14"
            style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, lineHeight: 1.6 }}
          >
            A sovereign AI conglomerate. Every layer owned,
            every tool built in-house.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/universe"
              className="inline-block px-8 py-3.5 bg-orange text-obsidian text-[14px] rounded-lg hover:bg-orange-hot transition-colors duration-150"
              style={{ fontFamily: 'var(--font-sans)', fontWeight: 600 }}
            >
              Explore Universe
            </Link>
            <Link
              href="#departments"
              className="inline-block px-8 py-3.5 rounded-lg ring-subtle text-warm-silver text-[14px] hover:text-bone transition-all duration-150"
              style={{ fontFamily: 'var(--font-sans)', fontWeight: 500 }}
            >
              View Departments
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ════════════════════ DEPARTMENTS ════════════════════ */}
      {/* Light/dark alternation — this section is slightly elevated */}
      <section id="departments" className="py-28 md:py-36 px-6 md:px-10 bg-obsidian-lit">
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            className="mb-20 max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2
              className="text-4xl sm:text-5xl md:text-[52px] mb-6"
              style={{ fontFamily: 'Georgia, serif', fontWeight: 400, lineHeight: 1.15 }}
            >
              Five departments.
              <br />
              One vertical stack.
            </h2>
            <p
              className="text-[16px] text-stone"
              style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, lineHeight: 1.6 }}
            >
              From narrative IP to sovereign infrastructure — everything
              designed, built, and operated under one roof.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            initial="hidden"
            whileInView="visible"
            variants={stagger}
            viewport={{ once: true }}
          >
            {pillars.map((pillar) => (
              <motion.div key={pillar.id} variants={fadeUp}>
                <Link href={pillar.href} className="block group">
                  <div
                    className="bg-obsidian ring-subtle rounded-xl p-8 md:p-9 h-full ring-hover transition-all duration-150 hover:translate-y-[-2px]"
                  >
                    <h3
                      className="text-[26px] md:text-[28px] text-bone group-hover:text-orange transition-colors duration-150 mb-2"
                      style={{ fontFamily: 'Georgia, serif', fontWeight: 400, lineHeight: 1.2 }}
                    >
                      {pillar.label}
                    </h3>

                    <p
                      className="text-[14px] text-stone mb-8"
                      style={{ fontFamily: 'var(--font-sans)', fontWeight: 400 }}
                    >
                      {pillar.tagline}
                    </p>

                    <div className="space-y-2 mb-8">
                      {pillar.products.map((product) => (
                        <p
                          key={product.href}
                          className="text-[14px] text-warm-silver group-hover:text-bone transition-colors duration-150"
                          style={{ fontFamily: 'var(--font-sans)', fontWeight: 400 }}
                        >
                          {product.name}
                        </p>
                      ))}
                    </div>

                    <div className="text-stone group-hover:text-orange transition-colors duration-150">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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

      {/* ════════════════════ STATEMENT (dark section) ════════════════════ */}
      <section className="py-32 md:py-44 px-6 md:px-10 bg-obsidian">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2
              className="text-4xl sm:text-5xl md:text-[56px] mb-8"
              style={{ fontFamily: 'Georgia, serif', fontWeight: 400, lineHeight: 1.12 }}
            >
              One machine.
              <br />
              <span className="text-orange">Infinite output.</span>
            </h2>

            <p
              className="text-[17px] text-stone max-w-lg mx-auto mb-14"
              style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, lineHeight: 1.65 }}
            >
              We don&apos;t rent cloud. We don&apos;t outsource intelligence.
              Every tool, every film, every book, every app — built from scratch
              on hardware we own.
            </p>

            <Link
              href="/system"
              className="inline-block px-8 py-3.5 bg-orange text-obsidian text-[14px] rounded-lg hover:bg-orange-hot transition-colors duration-150"
              style={{ fontFamily: 'var(--font-sans)', fontWeight: 600 }}
            >
              See How It Works
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════ CTA (elevated section) ════════════════════ */}
      <section className="py-24 px-6 md:px-10 bg-obsidian-lit">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <p
              className="text-[17px] text-stone mb-8"
              style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, lineHeight: 1.6 }}
            >
              Build with us. Commission a film. License an IP.
            </p>
            <Link
              href="/contact"
              className="inline-block px-8 py-3.5 rounded-lg ring-subtle text-orange text-[14px] ring-hover hover:bg-orange hover:text-obsidian transition-all duration-150"
              style={{ fontFamily: 'var(--font-sans)', fontWeight: 600 }}
            >
              Get in Touch
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
