'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitReveal from '@/components/SplitReveal';
import Marquee from '@/components/Marquee';
import Magnetic from '@/components/Magnetic';
import { pillars } from '@/lib/theme';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ═══════════════════════════════════════════════════════════════════════════
// TARTARY OS — Product-first homepage, 2026 refresh
// Warm cinematic × Industrial auteur. 8bit.ai craft, Syne wordmark, Safety Orange.
// ═══════════════════════════════════════════════════════════════════════════

/* ── Drifting warm orb ────────────────────────────────────── */
function DriftOrb({
  className = '',
  color,
  size,
  blur,
  scaleDuration = 12,
  opacityDuration = 8,
  driftDuration = 20,
  delay = 0,
  driftX = [0, 50, -30, 0] as number[],
  driftY = [0, -40, 30, 0] as number[],
  scaleRange = [1, 1.25, 0.95, 1.15, 1] as number[],
  opacityRange = [0.5, 0.9, 0.4, 0.8, 0.5] as number[],
}: {
  className?: string;
  color: string;
  size: number;
  blur: number;
  scaleDuration?: number;
  opacityDuration?: number;
  driftDuration?: number;
  delay?: number;
  driftX?: number[];
  driftY?: number[];
  scaleRange?: number[];
  opacityRange?: number[];
}) {
  return (
    <motion.div
      className={`absolute rounded-full pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color}, transparent 70%)`,
        filter: `blur(${blur}px)`,
      }}
      animate={{ scale: scaleRange, opacity: opacityRange, x: driftX, y: driftY }}
      transition={{
        scale: { duration: scaleDuration, delay, repeat: Infinity, ease: 'easeInOut' },
        opacity: { duration: opacityDuration, delay, repeat: Infinity, ease: 'easeInOut' },
        x: { duration: driftDuration, delay, repeat: Infinity, ease: 'easeInOut' },
        y: { duration: driftDuration * 0.85, delay, repeat: Infinity, ease: 'easeInOut' },
      }}
    />
  );
}

/* ── Warm aurora background ────────────────────────────────── */
function WarmAurora() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Oxblood deep — top-left */}
      <DriftOrb
        className="-top-[220px] -left-[180px]"
        color="rgba(139, 34, 24, 0.5)"
        size={1050}
        blur={110}
        scaleDuration={14}
        opacityDuration={10}
        driftDuration={22}
        delay={0}
        driftX={[0, 80, -20, 60, 0]}
        driftY={[0, 60, -30, 40, 0]}
        scaleRange={[1, 1.3, 0.95, 1.2, 1]}
        opacityRange={[0.6, 0.95, 0.45, 0.85, 0.6]}
      />
      {/* Burnished gold — center right */}
      <DriftOrb
        className="top-[10%] -right-[160px]"
        color="rgba(201, 166, 121, 0.45)"
        size={920}
        blur={95}
        scaleDuration={12}
        opacityDuration={9}
        driftDuration={18}
        delay={2}
        driftX={[0, -70, 30, -50, 0]}
        driftY={[0, 50, -20, 70, 0]}
        scaleRange={[1, 1.2, 0.9, 1.15, 1]}
        opacityRange={[0.55, 0.9, 0.35, 0.75, 0.55]}
      />
      {/* Safety-orange terracotta — bottom center */}
      <DriftOrb
        className="-bottom-[80px] left-[20%]"
        color="rgba(255, 102, 0, 0.32)"
        size={880}
        blur={100}
        scaleDuration={16}
        opacityDuration={11}
        driftDuration={25}
        delay={4}
        driftX={[0, 60, -40, 30, 0]}
        driftY={[0, -70, 20, -50, 0]}
        scaleRange={[1, 1.15, 0.9, 1.1, 1]}
        opacityRange={[0.4, 0.85, 0.3, 0.7, 0.4]}
      />
      {/* Deep ember — left mid */}
      <DriftOrb
        className="top-[35%] -left-[60px]"
        color="rgba(180, 72, 20, 0.32)"
        size={750}
        blur={85}
        scaleDuration={13}
        opacityDuration={8}
        driftDuration={20}
        delay={1}
        driftX={[0, 70, -30, 50, 0]}
        driftY={[0, -50, 40, -30, 0]}
        scaleRange={[1, 1.22, 0.92, 1.18, 1]}
        opacityRange={[0.45, 0.85, 0.3, 0.7, 0.45]}
      />
      {/* Bone glow — center, gentle */}
      <DriftOrb
        className="top-[22%] left-1/2 -translate-x-1/2"
        color="rgba(236, 228, 210, 0.11)"
        size={660}
        blur={70}
        scaleDuration={10}
        opacityDuration={7}
        driftDuration={16}
        delay={0}
        driftX={[0, 25, -25, 15, 0]}
        driftY={[0, -20, 20, -10, 0]}
        scaleRange={[1, 1.1, 0.95, 1.05, 1]}
        opacityRange={[0.55, 0.9, 0.4, 0.75, 0.55]}
      />
      {/* Subtle teal — bottom right (cool counterpoint) */}
      <DriftOrb
        className="bottom-[8%] right-[4%]"
        color="rgba(34, 88, 90, 0.22)"
        size={590}
        blur={80}
        scaleDuration={15}
        opacityDuration={12}
        driftDuration={28}
        delay={3}
        driftX={[0, -50, 40, -60, 0]}
        driftY={[0, -40, 30, -20, 0]}
        scaleRange={[1, 1.18, 0.88, 1.12, 1]}
        opacityRange={[0.35, 0.7, 0.22, 0.55, 0.35]}
      />
    </div>
  );
}

/* ── Platform badge ─────────────────────────────────────────── */
function PlatformBadge({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <div
      className="flex items-center gap-2.5 px-4 py-2.5 rounded-md border hairline"
      style={{ background: 'rgba(26, 20, 16, 0.55)', backdropFilter: 'blur(8px)' }}
    >
      <span style={{ color: 'var(--color-orange)' }}>{icon}</span>
      <span
        className="text-[12px]"
        style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, color: 'var(--color-parchment)', letterSpacing: '0.02em' }}
      >
        {label}
      </span>
    </div>
  );
}

/* ── Hero ────────────────────────────────────────────────────── */
function HeroCinematic() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref as React.RefObject<HTMLElement>,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-[110vh] flex flex-col justify-center items-center px-6 md:px-10 overflow-hidden"
      style={{ background: '#0a0705' }}
    >
      <WarmAurora />

      {/* Top strip */}
      <div className="absolute top-24 md:top-28 left-6 md:left-10 right-6 md:right-10 z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--color-orange)' }} />
          <span className="t-micro" style={{ color: 'var(--color-parchment)' }}>System online · 2026 slate</span>
        </div>
        <div className="hidden md:block">
          <span className="t-micro">[ Gen 1 · macOS Sequoia 15 / visionOS 2 ]</span>
        </div>
      </div>

      <motion.div
        className="relative z-10 text-center max-w-[1400px] mx-auto"
        style={{ y, opacity }}
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2.4 }}
          className="t-micro mb-7"
          style={{ color: 'var(--color-orange)' }}
        >
          Introducing · Generation 01
        </motion.p>

        {/* TARTARY — massive Syne wordmark */}
        <SplitReveal
          as="h1"
          split="chars"
          stagger={0.04}
          duration={1.2}
          ease="expo.out"
          trigger="mount"
          delay={2.55}
          className="block mb-2"
        >
          <span
            className="block text-[clamp(2.75rem,9vw,8rem)] leading-[0.9] text-bone"
            style={{ fontFamily: 'var(--font-logo)', fontWeight: 800, letterSpacing: '0em' }}
          >
            TARTARY
          </span>
        </SplitReveal>

        {/* OS — secondary, gold-warm */}
        <SplitReveal
          as="div"
          split="chars"
          stagger={0.06}
          duration={1.2}
          ease="expo.out"
          trigger="mount"
          delay={2.85}
          className="block"
        >
          <span
            className="block text-[clamp(2rem,7vw,6.5rem)] leading-[1.0]"
            style={{
              fontFamily: 'var(--font-logo)',
              fontWeight: 700,
              letterSpacing: '0.35em',
              color: 'var(--color-gold)',
            }}
          >
            OS
          </span>
        </SplitReveal>

        {/* Taglines */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 3.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 text-2xl md:text-3xl max-w-lg mx-auto text-bone"
          style={{ fontFamily: 'var(--font-editorial)', fontStyle: 'italic', fontWeight: 400, lineHeight: 1.22 }}
        >
          One click. Everything generates.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 3.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 text-[15px] md:text-[17px] max-w-md mx-auto"
          style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, color: 'var(--color-parchment)', lineHeight: 1.5 }}
        >
          The first sovereign AI operating system for macOS and visionOS.
          Generate anything. Own everything.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 3.75, ease: [0.22, 1, 0.36, 1] }}
          className="mt-11 flex flex-col sm:flex-row gap-3 justify-center mb-10"
        >
          <Magnetic>
            <Link href="/system" data-cursor="hover" className="btn-orange">
              Get Tartary OS
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7H13M13 7L7 1M13 7L7 13" stroke="currentColor" strokeWidth="1.4" /></svg>
            </Link>
          </Magnetic>
          <Magnetic>
            <Link href="#features" data-cursor="hover" className="btn-ghost">
              See what it does
            </Link>
          </Magnetic>
        </motion.div>

        {/* Platform badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 3.95 }}
          className="flex flex-wrap gap-3 justify-center"
        >
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
          <PlatformBadge
            label="Apple Silicon M1+"
            icon={
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <rect x="5" y="5" width="14" height="14" rx="2" />
                <path d="M9 9h6v6H9z" />
                <path d="M2 9h3M2 14h3M19 9h3M19 14h3M9 2v3M14 2v3M9 19v3M14 19v3" />
              </svg>
            }
          />
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 4.2 }}
      >
        <span className="t-micro">Scroll</span>
        <motion.div
          className="w-[1px] h-10"
          style={{ background: 'linear-gradient(180deg, transparent, rgba(255,102,0,0.6), transparent)' }}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  );
}

/* ── Big marquee band ───────────────────────────────────────── */
function BigMarqueeBand() {
  return (
    <section className="relative py-6 md:py-8 border-y hairline overflow-hidden" style={{ background: 'var(--color-ink)' }}>
      <Marquee speed={55}>
        <div className="flex items-center gap-10 whitespace-nowrap">
          {['One click', 'Everything generates', 'Local first', 'Film-grade', 'Spatial native', 'Open Claw', 'Mudflood', 'Gen 1 · 2026'].map((w, i) => (
            <span key={i} className="flex items-center gap-10">
              <span
                className="text-[6vw] md:text-[4.5vw] leading-none text-bone"
                style={{ fontFamily: 'var(--font-logo)', fontWeight: 700, letterSpacing: '-0.02em' }}
              >
                {w}
              </span>
              <span className="text-[6vw] md:text-[4.5vw] leading-none" style={{ color: 'var(--color-orange)' }}>·</span>
            </span>
          ))}
        </div>
      </Marquee>
    </section>
  );
}

/* ── Philosophy statement ──────────────────────────────────── */
function Philosophy() {
  return (
    <section className="py-32 md:py-44 px-6 md:px-10 relative overflow-hidden" style={{ background: '#08060a' }}>
      <DriftOrb
        className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        color="rgba(201, 166, 121, 0.2)"
        size={700}
        blur={90}
        scaleDuration={12}
        opacityDuration={8}
        driftDuration={18}
        driftX={[0, 40, -40, 0]}
        driftY={[0, -30, 30, 0]}
        opacityRange={[0.35, 0.7, 0.25, 0.55, 0.35]}
      />
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="t-micro mb-7" style={{ color: 'var(--color-orange)' }}>— Why Tartary OS</div>
        <SplitReveal
          as="h2"
          split="words"
          stagger={0.07}
          className="text-[clamp(2rem,6vw,4.5rem)] leading-[1.02] text-bone mb-8"
        >
          <span style={{ letterSpacing: '-0.025em' }}>
            The entire creative stack,{' '}
          </span>
          <span
            className="font-editorial-italic"
            style={{ color: 'var(--color-gold)', fontSize: '1.05em' }}
          >
            running on your desk.
          </span>
        </SplitReveal>
        <p
          className="text-lg md:text-xl max-w-2xl mx-auto"
          style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-parchment)', lineHeight: 1.55 }}
        >
          Other tools send your ideas to someone else&apos;s server and hope for the best.
          Tartary OS runs the full generative pipeline on Apple Silicon —
          from first thought to final render, everything stays yours.
        </p>
      </div>
    </section>
  );
}

/* ── Six pillars ────────────────────────────────────────────── */
const features = [
  { title: 'Generation in one click', body: 'Text, image, video, code, music — every modality collapses into a single action. Click, and the system delivers.' },
  { title: 'Open Claw architecture', body: 'A modular generation framework where every AI model plugs into one unified surface. Swap models, chain outputs, build workflows.' },
  { title: 'Sovereign by design', body: 'Your data never leaves your machine. Every model runs locally on Apple Silicon. No cloud. No subscription. No surveillance.' },
  { title: 'Built for spatial computing', body: 'Native visionOS integration. Pin generations in space. Walk through your creative history. Think in three dimensions.' },
  { title: 'Cinematic output', body: 'Trained on film-grade datasets from Tartary Studio. Every image is lit by a cinematographer. Every frame holds a narrative.' },
  { title: 'Mudflood plugins', body: 'Extend Tartary OS with Mudflood — a plugin system that lets any developer ship new generation capabilities instantly.' },
];

function FeaturesGrid() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.feat-card').forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.1,
            ease: 'expo.out',
            scrollTrigger: { trigger: card, start: 'top 88%' },
            delay: (i % 3) * 0.08,
          }
        );
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} id="features" className="py-24 md:py-36 px-6 md:px-10" style={{ background: 'rgba(20, 15, 12, 0.5)' }}>
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-14 md:mb-20 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="t-micro mb-4" style={{ color: 'var(--color-orange)' }}>— Core capabilities</div>
            <SplitReveal
              as="h2"
              split="words"
              stagger={0.06}
              className="text-[clamp(2.25rem,5vw,4.5rem)] text-bone leading-[1.0]"
            >
              <span style={{ letterSpacing: '-0.025em' }}>Six pillars of </span>
              <span className="font-editorial-italic" style={{ color: 'var(--color-gold)' }}>generation.</span>
            </SplitReveal>
          </div>
          <p
            className="max-w-sm text-[15px]"
            style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-warm-silver)', lineHeight: 1.55 }}
          >
            Six capabilities that unify the modern creative pipeline. Each one runs locally, on your hardware, with no round-trip to a cloud.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px hairline border-t border-l">
          {features.map((feat, i) => (
            <div
              key={i}
              className="feat-card group relative p-8 md:p-10 border-r border-b hairline transition-colors duration-500"
              style={{ background: 'var(--color-surface-alt)' }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: 'radial-gradient(80% 100% at 20% 20%, rgba(255,102,0,0.08), transparent 60%)' }}
              />
              <div className="relative">
                <div className="flex items-start justify-between mb-8">
                  <span
                    className="text-5xl md:text-6xl leading-none"
                    style={{ fontFamily: 'var(--font-logo)', fontWeight: 800, color: 'rgba(236,228,210,0.12)' }}
                  >
                    0{i + 1}
                  </span>
                  <span className="t-micro" style={{ color: 'var(--color-orange)' }}>PILLAR</span>
                </div>
                <h3
                  className="text-xl md:text-2xl text-bone mb-3"
                  style={{ fontFamily: 'var(--font-logo)', fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.1 }}
                >
                  {feat.title}
                </h3>
                <p
                  className="text-[14.5px]"
                  style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-parchment)', lineHeight: 1.55 }}
                >
                  {feat.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Grand statement ──────────────────────────────────────── */
function GrandStatement() {
  return (
    <section className="py-36 md:py-52 px-6 md:px-10 relative overflow-hidden" style={{ background: '#0a0705' }}>
      <DriftOrb
        className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        color="rgba(255, 102, 0, 0.18)"
        size={850}
        blur={95}
        scaleDuration={12}
        opacityDuration={8}
        driftDuration={18}
        driftX={[0, 40, -40, 0]}
        driftY={[0, -30, 30, 0]}
        opacityRange={[0.3, 0.65, 0.2, 0.5, 0.3]}
      />
      <DriftOrb
        className="top-[20%] -right-[100px]"
        color="rgba(201, 166, 121, 0.22)"
        size={620}
        blur={85}
        scaleDuration={10}
        opacityDuration={7}
        driftDuration={16}
        delay={3}
        driftX={[0, -50, 20, 0]}
        driftY={[0, 30, -20, 0]}
        opacityRange={[0.3, 0.65, 0.2, 0.5, 0.3]}
      />

      <div className="max-w-6xl mx-auto text-center relative z-10">
        <SplitReveal
          as="h2"
          split="words"
          stagger={0.09}
          className="text-[clamp(2.75rem,8vw,7rem)] text-bone leading-[0.95]"
        >
          <span style={{ letterSpacing: '-0.035em' }}>Your imagination.</span>
          <br />
          <span className="font-editorial-italic" style={{ color: 'var(--color-orange)', letterSpacing: '-0.015em' }}>
            Your machine.
          </span>
          <br />
          <span style={{ color: 'var(--color-warm-silver)', letterSpacing: '-0.035em' }}>Your rules.</span>
        </SplitReveal>
      </div>
    </section>
  );
}

/* ── Specs + what you get ────────────────────────────────── */
function SpecsSection() {
  return (
    <section className="py-24 md:py-32 px-6 md:px-10" style={{ background: 'rgba(20, 15, 12, 0.3)' }}>
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
        <div>
          <div className="t-micro mb-5">System Requirements</div>
          <div className="space-y-4">
            {[
              { label: 'Apple Silicon', detail: 'M1 or later (M3 Pro+ recommended)' },
              { label: 'macOS', detail: 'Sequoia 15.0 or later' },
              { label: 'visionOS', detail: '2.0 or later (optional)' },
              { label: 'Storage', detail: '64 GB available (models download on demand)' },
              { label: 'Memory', detail: '16 GB unified (32 GB recommended)' },
            ].map((spec) => (
              <div key={spec.label} className="flex items-baseline justify-between border-b hairline pb-3">
                <span
                  className="text-[14px] text-bone"
                  style={{ fontFamily: 'var(--font-sans)', fontWeight: 500 }}
                >
                  {spec.label}
                </span>
                <span
                  className="text-[13px] text-right"
                  style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, color: 'var(--color-warm-silver)' }}
                >
                  {spec.detail}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="t-micro mb-5">What you get</div>
          <div className="space-y-3.5">
            {[
              'Full generative OS with one-click output',
              'All core models included — no subscriptions',
              'Mudflood plugin system for extensibility',
              'Native visionOS spatial workspace',
              'Offline-first — works without internet',
              'Automatic updates via Tartary System',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="mt-1 flex-shrink-0" style={{ color: 'var(--color-orange)' }}>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span
                  className="text-[14.5px]"
                  style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, color: 'var(--color-parchment)', lineHeight: 1.45 }}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Conglomerate band (5 pillars) ────────────────────────── */
function ConglomerateBand() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.pillar-card').forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.1,
            ease: 'expo.out',
            scrollTrigger: { trigger: card, start: 'top 88%' },
            delay: i * 0.06,
          }
        );
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="py-28 md:py-40 px-6 md:px-10 relative overflow-hidden" style={{ background: 'var(--color-ink)' }}>
      <div className="max-w-[1480px] mx-auto">
        <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div>
            <div className="t-micro mb-4" style={{ color: 'var(--color-orange)' }}>— The conglomerate</div>
            <SplitReveal
              as="h2"
              split="words"
              stagger={0.06}
              className="text-[clamp(2.25rem,6vw,5rem)] text-bone leading-[1.0]"
            >
              <span style={{ letterSpacing: '-0.03em' }}>Tartary OS is one of </span>
              <span className="font-editorial-italic" style={{ color: 'var(--color-gold)' }}>five departments.</span>
            </SplitReveal>
          </div>
          <p
            className="max-w-sm text-[15px]"
            style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-warm-silver)', lineHeight: 1.55 }}
          >
            Every layer owned. Every tool built in-house. From the operating system that generates it to the cinema it runs on.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
          {pillars.map((pillar) => (
            <Link
              key={pillar.id}
              href={pillar.href}
              data-cursor="view"
              className="pillar-card group relative block h-[300px] md:h-[360px] rounded-sm overflow-hidden border hairline p-6 transition-all duration-500 hover:border-orange/60"
              style={{ background: pillar.id === 'system' ? 'linear-gradient(170deg, rgba(255,102,0,0.14), rgba(13,10,8,0.9))' : 'var(--color-surface-alt)' }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{ background: 'radial-gradient(80% 80% at 50% 30%, rgba(255,102,0,0.12), transparent 60%)' }}
              />
              <div className="relative h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-8">
                    <span className="t-micro tabular-nums" style={{ color: 'var(--color-orange)' }}>{pillar.idx}</span>
                    {pillar.id === 'system' && (
                      <span className="t-micro" style={{ color: 'var(--color-orange)' }}>• Active</span>
                    )}
                  </div>
                  <h3
                    className="text-2xl md:text-3xl text-bone mb-3"
                    style={{ fontFamily: 'var(--font-logo)', fontWeight: 700, letterSpacing: '0.05em' }}
                  >
                    {pillar.label}
                  </h3>
                  <p
                    className="text-[13.5px]"
                    style={{ fontFamily: 'var(--font-editorial)', fontStyle: 'italic', color: 'var(--color-parchment)', lineHeight: 1.35 }}
                  >
                    {pillar.tagline}
                  </p>
                </div>

                <div>
                  <div className="t-micro mb-3" style={{ color: 'var(--color-warm-slate)' }}>Products</div>
                  <div className="space-y-1">
                    {pillar.products.slice(0, 3).map((prod) => (
                      <div
                        key={prod.href}
                        className="text-[13px] group-hover:text-bone transition-colors duration-500"
                        style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-warm-silver)' }}
                      >
                        {prod.name}
                      </div>
                    ))}
                    {pillar.products.length > 3 && (
                      <div className="text-[12px] mt-1" style={{ color: 'var(--color-warm-slate)' }}>
                        +{pillar.products.length - 3} more
                      </div>
                    )}
                  </div>
                  <div className="mt-5 flex items-center gap-2 text-orange opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                    <span className="t-micro" style={{ color: 'var(--color-orange)' }}>Enter</span>
                    <span className="h-px w-8" style={{ background: 'var(--color-orange)' }} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Final CTA ─────────────────────────────────────────────── */
function FinalCTA() {
  return (
    <section className="py-32 md:py-48 px-6 md:px-10 relative overflow-hidden" style={{ background: '#0a0705' }}>
      <DriftOrb
        className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        color="rgba(255, 102, 0, 0.2)"
        size={760}
        blur={90}
        scaleDuration={14}
        opacityDuration={9}
        driftDuration={20}
        driftX={[0, 30, -30, 0]}
        driftY={[0, -25, 25, 0]}
        opacityRange={[0.3, 0.7, 0.2, 0.55, 0.3]}
      />
      <DriftOrb
        className="top-[25%] -left-[80px]"
        color="rgba(201, 166, 121, 0.18)"
        size={520}
        blur={70}
        scaleDuration={11}
        opacityDuration={8}
        driftDuration={16}
        delay={2}
        driftX={[0, 40, -20, 0]}
        driftY={[0, -30, 20, 0]}
        opacityRange={[0.25, 0.6, 0.18, 0.45, 0.25]}
      />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <div className="t-micro mb-8" style={{ color: 'var(--color-orange)' }}>— Early access · Gen 1</div>
        <SplitReveal
          as="h2"
          split="words"
          stagger={0.07}
          className="text-[clamp(2.5rem,7vw,5.5rem)] text-bone mb-8"
        >
          <span style={{ letterSpacing: '-0.03em' }}>Ready to </span>
          <span className="font-editorial-italic" style={{ color: 'var(--color-orange)' }}>generate?</span>
        </SplitReveal>

        <p
          className="text-lg max-w-md mx-auto mb-12"
          style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-parchment)', lineHeight: 1.45 }}
        >
          Tartary OS Gen 1 is coming to macOS and visionOS in 2026.
          Join the waitlist for early access.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Magnetic>
            <Link href="/system" data-cursor="hover" className="btn-orange">
              Join Waitlist
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7H13M13 7L7 1M13 7L7 13" stroke="currentColor" strokeWidth="1.4" /></svg>
            </Link>
          </Magnetic>
          <Magnetic>
            <Link href="/universe" data-cursor="hover" className="btn-ghost">
              Explore the Universe
            </Link>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}

/* ── Main page ─────────────────────────────────────────────── */
export default function Home() {
  return (
    <>
      <HeroCinematic />
      <BigMarqueeBand />
      <Philosophy />
      <FeaturesGrid />
      <GrandStatement />
      <SpecsSection />
      <ConglomerateBand />
      <FinalCTA />
    </>
  );
}
