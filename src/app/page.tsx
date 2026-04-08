'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// TARTARY OS — Product landing page
// Apple Store / Tesla inspired: scroll-triggered reveals, premium spacing,
// large isolated text, cinematic pacing
// ═══════════════════════════════════════════════════════════════════════════

/* ── Animation variants ─────────────────────── */

const fadeIn = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const fadeInSlow = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.0, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.0, ease: [0.22, 1, 0.36, 1] as const },
  },
};

/* ── Animated gradient orb (ambient light) ──── */
function AmbientOrb({
  className = '',
  style,
  duration = 8,
  delay = 0,
  scaleRange = [1, 1.15, 1] as [number, number, number],
  opacityRange = [0.4, 0.7, 0.4] as [number, number, number],
}: {
  className?: string;
  style?: React.CSSProperties;
  duration?: number;
  delay?: number;
  scaleRange?: [number, number, number];
  opacityRange?: [number, number, number];
}) {
  return (
    <motion.div
      className={`absolute rounded-full pointer-events-none ${className}`}
      style={style}
      animate={{
        scale: scaleRange,
        opacity: opacityRange,
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

/* ── Living background — gradient mesh of colored orbs ── */
function LivingBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Deep indigo — top left */}
      <AmbientOrb
        className="w-[900px] h-[900px] -top-[200px] -left-[200px] blur-[120px]"
        style={{ background: 'radial-gradient(circle, rgba(80,60,180,0.08), transparent 70%)' }}
        duration={12}
        delay={0}
        scaleRange={[1, 1.2, 1]}
        opacityRange={[0.5, 0.8, 0.5]}
      />
      {/* Warm amber — right */}
      <AmbientOrb
        className="w-[800px] h-[800px] top-[10%] -right-[150px] blur-[100px]"
        style={{ background: 'radial-gradient(circle, rgba(255,140,50,0.06), transparent 70%)' }}
        duration={10}
        delay={2}
        scaleRange={[1, 1.15, 1]}
        opacityRange={[0.4, 0.7, 0.4]}
      />
      {/* Cool teal — bottom center */}
      <AmbientOrb
        className="w-[700px] h-[700px] -bottom-[100px] left-[20%] blur-[100px]"
        style={{ background: 'radial-gradient(circle, rgba(40,180,180,0.05), transparent 70%)' }}
        duration={14}
        delay={4}
        scaleRange={[1, 1.1, 1]}
        opacityRange={[0.3, 0.6, 0.3]}
      />
      {/* Rose — center left */}
      <AmbientOrb
        className="w-[600px] h-[600px] top-[40%] left-[5%] blur-[80px]"
        style={{ background: 'radial-gradient(circle, rgba(200,80,120,0.04), transparent 70%)' }}
        duration={11}
        delay={1}
        scaleRange={[1, 1.18, 1]}
        opacityRange={[0.3, 0.5, 0.3]}
      />
      {/* White core glow — behind the logo */}
      <AmbientOrb
        className="w-[500px] h-[500px] top-[30%] left-1/2 -translate-x-1/2 blur-[80px]"
        style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.04), transparent 60%)' }}
        duration={8}
        delay={0}
        scaleRange={[1, 1.08, 1]}
        opacityRange={[0.5, 0.8, 0.5]}
      />
    </div>
  );
}

/* ── Platform badge ─────────────────────────── */
function PlatformBadge({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 px-5 py-3 rounded-lg border border-border-dark bg-surface/50 backdrop-blur-sm">
      <span className="text-white/70">{icon}</span>
      <span
        className="text-[13px] text-cool-silver"
        style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, letterSpacing: '-0.16px' }}
      >
        {label}
      </span>
    </div>
  );
}

/* ── Feature card ───────────────────────────── */
function FeatureCard({
  title,
  description,
  index,
}: {
  title: string;
  description: string;
  index: number;
}) {
  return (
    <motion.div
      variants={fadeIn}
      className="group relative"
    >
      <div className="p-8 md:p-10 rounded-xl border border-border-dark bg-surface/30 backdrop-blur-sm hover:border-white/10 transition-all duration-300 h-full">
        <span
          className="block text-[11px] text-mid-slate mb-4"
          style={{ fontFamily: 'var(--font-sans)', fontWeight: 450, letterSpacing: '0.35px', textTransform: 'uppercase' as const }}
        >
          0{index + 1}
        </span>
        <h3
          className="text-[20px] md:text-[24px] text-white mb-3"
          style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.5px' }}
        >
          {title}
        </h3>
        <p
          className="text-[14px] text-cool-slate leading-relaxed"
          style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, letterSpacing: '-0.16px', lineHeight: 1.5 }}
        >
          {description}
        </p>
      </div>
    </motion.div>
  );
}

/* ── Parallax hero text ─────────────────────── */
function ParallaxHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[110vh] flex flex-col justify-center items-center px-6 md:px-10 overflow-hidden" style={{ background: '#050507' }}>
      {/* Living gradient background */}
      <LivingBackground />

      <motion.div
        className="relative z-10 text-center max-w-4xl mx-auto"
        style={{ y, opacity }}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Introducing label */}
          <motion.p
            variants={fadeIn}
            className="text-[13px] text-cool-slate mb-6"
            style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, letterSpacing: '0.35px', textTransform: 'uppercase' as const }}
          >
            Introducing
          </motion.p>

          {/* TARTARY OS — logo-scale */}
          <motion.h1
            variants={fadeInSlow}
            className="mb-8"
          >
            <span
              className="block text-[64px] sm:text-[88px] md:text-[112px] lg:text-[140px] tracking-[0.15em]"
              style={{
                fontFamily: 'var(--font-logo)',
                fontWeight: 700,
                lineHeight: 0.9,
                color: '#ffffff',
              }}
            >
              TARTARY
            </span>
            <span
              className="block text-[40px] sm:text-[56px] md:text-[72px] lg:text-[88px] tracking-[0.4em] text-cool-slate mt-1"
              style={{
                fontFamily: 'var(--font-logo)',
                fontWeight: 700,
                lineHeight: 1.0,
              }}
            >
              OS
            </span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            variants={fadeIn}
            className="text-[18px] md:text-[22px] text-cool-slate max-w-lg mx-auto mb-4"
            style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, lineHeight: 1.3, letterSpacing: '-0.3px' }}
          >
            One click. Everything generates.
          </motion.p>

          {/* Sub-description */}
          <motion.p
            variants={fadeIn}
            className="text-[14px] md:text-[16px] text-mid-slate max-w-md mx-auto mb-10"
            style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, lineHeight: 1.5, letterSpacing: '-0.16px' }}
          >
            The first sovereign AI operating system for macOS and visionOS.
            Generate anything. Own everything.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-3 justify-center mb-14">
            <Link
              href="/system"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-black text-[14px] rounded-lg hover:bg-cool-cloud transition-all duration-200"
              style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, letterSpacing: '-0.16px' }}
            >
              Get Tartary OS
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg border border-white/15 text-white text-[14px] hover:bg-white/5 transition-all duration-200"
              style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, letterSpacing: '-0.16px' }}
            >
              See what it does
            </Link>
          </motion.div>

          {/* Platform badges */}
          <motion.div variants={fadeIn} className="flex flex-wrap gap-3 justify-center">
            <PlatformBadge
              label="macOS"
              icon={
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
              }
            />
            <PlatformBadge
              label="visionOS"
              icon={
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                </svg>
              }
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="w-[1px] h-8 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
      </motion.div>
    </section>
  );
}

/* ── Main page ──────────────────────────────── */

const features = [
  {
    title: 'Generation in one click',
    description:
      'Text, image, video, code, music — every modality collapses into a single action. Click, and the system delivers. No prompts. No pipelines. Just output.',
  },
  {
    title: 'Open Claw architecture',
    description:
      'A modular generation framework where every AI model plugs into one unified surface. Swap models, chain outputs, build workflows — all through one interface.',
  },
  {
    title: 'Sovereign by design',
    description:
      'Your data never leaves your machine. Every model runs locally on Apple Silicon. No cloud dependency, no subscription lock-in, no surveillance.',
  },
  {
    title: 'Built for spatial computing',
    description:
      'Native visionOS integration turns your entire environment into a canvas. Pin generations in space. Walk through your creative history. Think in three dimensions.',
  },
  {
    title: 'Cinematic output quality',
    description:
      'Trained on film-grade datasets from Tartary Studio. Every image has cinematographer-level lighting. Every video holds a narrative frame. This isn\'t a tool — it\'s a collaborator.',
  },
  {
    title: 'The Mudflood plugin system',
    description:
      'Extend Tartary OS with Mudflood — a plugin architecture that lets any developer ship new generation capabilities. One install, instant access across the entire OS.',
  },
];

export default function Home() {
  return (
    <main>
      {/* ═══════ HERO ═══════ */}
      <ParallaxHero />

      {/* ═══════ PRODUCT SHOWCASE ═══════ */}
      <section className="py-32 md:py-44 px-6 md:px-10 relative overflow-hidden" style={{ background: '#030305' }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <motion.p
              variants={fadeIn}
              className="text-[11px] text-mid-slate mb-6"
              style={{ fontFamily: 'var(--font-sans)', fontWeight: 450, letterSpacing: '0.35px', textTransform: 'uppercase' as const }}
            >
              Why Tartary OS
            </motion.p>

            <motion.h2
              variants={fadeInSlow}
              className="text-[36px] sm:text-[48px] md:text-[60px] text-white mb-8"
              style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, lineHeight: 1.0, letterSpacing: '-2px' }}
            >
              The entire creative stack,{' '}
              <span className="text-cool-slate">running on your desk.</span>
            </motion.h2>

            <motion.p
              variants={fadeIn}
              className="text-[16px] md:text-[18px] text-cool-slate max-w-2xl mx-auto"
              style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, lineHeight: 1.5, letterSpacing: '-0.2px' }}
            >
              Other tools send your ideas to someone else&apos;s server and hope for the best.
              Tartary OS runs the full generative pipeline on Apple Silicon —
              from first thought to final render, everything stays yours.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ═══════ FEATURES ═══════ */}
      <section id="features" className="py-24 md:py-32 px-6 md:px-10 bg-surface/50">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            className="mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeIn}
          >
            <p
              className="text-[11px] text-mid-slate mb-4"
              style={{ fontFamily: 'var(--font-sans)', fontWeight: 450, letterSpacing: '0.35px', textTransform: 'uppercase' as const }}
            >
              Core capabilities
            </p>
            <h2
              className="text-[36px] sm:text-[40px] text-white"
              style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, lineHeight: 1.0, letterSpacing: '-1.5px' }}
            >
              Six pillars of generation.
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            {features.map((feature, i) => (
              <FeatureCard key={i} title={feature.title} description={feature.description} index={i} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════ LARGE STATEMENT ═══════ */}
      <section className="py-36 md:py-48 px-6 md:px-10 relative overflow-hidden" style={{ background: '#050507' }}>
        {/* Subtle orbs for this section */}
        <AmbientOrb
          className="w-[700px] h-[700px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-[100px]"
          style={{ background: 'radial-gradient(circle, rgba(80,60,180,0.04), transparent 70%)' }}
          duration={10}
          opacityRange={[0.3, 0.6, 0.3]}
        />
        <AmbientOrb
          className="w-[500px] h-[500px] top-[20%] -right-[100px] blur-[80px]"
          style={{ background: 'radial-gradient(circle, rgba(255,140,50,0.03), transparent 70%)' }}
          duration={12}
          delay={3}
          opacityRange={[0.2, 0.5, 0.2]}
        />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={scaleIn}
          >
            <h2
              className="text-[40px] sm:text-[56px] md:text-[72px] lg:text-[88px] text-white"
              style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, lineHeight: 0.95, letterSpacing: '-3px' }}
            >
              Your imagination.
              <br />
              <span className="text-orange">Your machine.</span>
              <br />
              <span className="text-cool-slate">Your rules.</span>
            </h2>
          </motion.div>
        </div>
      </section>

      {/* ═══════ SPECS / DETAILS ═══════ */}
      <section className="py-24 md:py-32 px-6 md:px-10 bg-surface/30">
        <div className="max-w-[1100px] mx-auto">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn}>
              <p
                className="text-[11px] text-mid-slate mb-4"
                style={{ fontFamily: 'var(--font-sans)', fontWeight: 450, letterSpacing: '0.35px', textTransform: 'uppercase' as const }}
              >
                System Requirements
              </p>
              <div className="space-y-6">
                {[
                  { label: 'Apple Silicon', detail: 'M1 or later (M3 Pro+ recommended)' },
                  { label: 'macOS', detail: 'Sequoia 15.0 or later' },
                  { label: 'visionOS', detail: '2.0 or later (optional)' },
                  { label: 'Storage', detail: '64 GB available (models download on demand)' },
                  { label: 'Memory', detail: '16 GB unified (32 GB recommended)' },
                ].map((spec) => (
                  <div key={spec.label} className="flex items-baseline justify-between border-b border-border-dark pb-3">
                    <span
                      className="text-[14px] text-white"
                      style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, letterSpacing: '-0.16px' }}
                    >
                      {spec.label}
                    </span>
                    <span
                      className="text-[13px] text-cool-slate text-right"
                      style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, letterSpacing: '-0.16px' }}
                    >
                      {spec.detail}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fadeIn}>
              <p
                className="text-[11px] text-mid-slate mb-4"
                style={{ fontFamily: 'var(--font-sans)', fontWeight: 450, letterSpacing: '0.35px', textTransform: 'uppercase' as const }}
              >
                What you get
              </p>
              <div className="space-y-4">
                {[
                  'Full generative OS with one-click output',
                  'All core models included — no subscriptions',
                  'Mudflood plugin system for extensibility',
                  'Native visionOS spatial workspace',
                  'Offline-first — works without internet',
                  'Automatic updates via Tartary System',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-orange mt-1 flex-shrink-0">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    <span
                      className="text-[14px] text-cool-silver"
                      style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, lineHeight: 1.4, letterSpacing: '-0.16px' }}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ FINAL CTA ═══════ */}
      <section className="py-32 md:py-44 px-6 md:px-10 relative overflow-hidden" style={{ background: '#050507' }}>
        <AmbientOrb
          className="w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-[100px]"
          style={{ background: 'radial-gradient(circle, rgba(40,180,180,0.03), transparent 70%)' }}
          duration={10}
          opacityRange={[0.3, 0.5, 0.3]}
        />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <motion.h2
              variants={fadeInSlow}
              className="text-[36px] sm:text-[48px] md:text-[56px] text-white mb-6"
              style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, lineHeight: 1.0, letterSpacing: '-2px' }}
            >
              Ready to generate?
            </motion.h2>

            <motion.p
              variants={fadeIn}
              className="text-[16px] text-cool-slate max-w-md mx-auto mb-10"
              style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, lineHeight: 1.4, letterSpacing: '-0.16px' }}
            >
              Tartary OS Gen 1 is coming to macOS and visionOS.
              Join the waitlist for early access.
            </motion.p>

            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/system"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-black text-[14px] rounded-lg hover:bg-cool-cloud transition-all duration-200"
                style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, letterSpacing: '-0.16px' }}
              >
                Join Waitlist
              </Link>
              <Link
                href="/universe"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg border border-white/15 text-white text-[14px] hover:bg-white/5 transition-all duration-200"
                style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, letterSpacing: '-0.16px' }}
              >
                Explore the Tartary Universe
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
