'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Pinned scroll showcase.
 * - Pins a full-viewport section.
 * - Large background word ("GENERATE" / "OWN" / "CREATE") scales + shifts with scroll.
 * - Three stacked captions crossfade in sequence.
 */
const phases = [
  {
    bigWord: 'GENERATE',
    caption: 'Text, image, video, audio, code.',
    sub: 'One click. One interface. Every modality.',
  },
  {
    bigWord: 'OWN',
    caption: 'Every model runs locally on Apple Silicon.',
    sub: 'No cloud. No subscription. No surveillance.',
  },
  {
    bigWord: 'CREATE',
    caption: 'Film-grade output. Trained on Tartary Studio.',
    sub: 'Cinematographer-level lighting. Narrative-aware frames.',
  },
];

export default function PinnedReveal() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const totalPhases = phases.length;
      const scrollDistance = window.innerHeight * totalPhases;

      // Pin the section
      ScrollTrigger.create({
        trigger: root,
        start: 'top top',
        end: `+=${scrollDistance}`,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      });

      // Each phase: fade its stack in for its segment
      phases.forEach((_, i) => {
        const bigEl = root.querySelector(`.phase-big-${i}`);
        const capEl = root.querySelector(`.phase-cap-${i}`);
        if (!bigEl || !capEl) return;

        const startPct = i / totalPhases;
        const endPct = (i + 1) / totalPhases;

        gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: `top+=${startPct * scrollDistance} top`,
            end: `top+=${endPct * scrollDistance} top`,
            scrub: 0.6,
          },
        })
          .fromTo(
            bigEl,
            { scale: 0.85, opacity: 0, letterSpacing: '0.3em' },
            { scale: 1, opacity: 1, letterSpacing: '0em', duration: 0.4, ease: 'power2.out' }
          )
          .to(bigEl, { opacity: 1, duration: 0.3 })
          .to(bigEl, { scale: 1.15, opacity: 0, letterSpacing: '-0.04em', duration: 0.3, ease: 'power2.in' });

        gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: `top+=${startPct * scrollDistance + scrollDistance * 0.04} top`,
            end: `top+=${endPct * scrollDistance - scrollDistance * 0.02} top`,
            scrub: 0.6,
          },
        })
          .fromTo(
            capEl,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' }
          )
          .to(capEl, { opacity: 1, duration: 0.3 })
          .to(capEl, { y: -30, opacity: 0, duration: 0.3, ease: 'power2.in' });
      });

      // Progress indicator
      gsap.to('.pr-progress', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: `+=${scrollDistance}`,
          scrub: 0.3,
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative h-[100svh] w-full overflow-hidden flex items-center justify-center"
      style={{ background: '#08060a' }}
    >
      {/* Ambient warm glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(60% 60% at 50% 50%, rgba(255,102,0,0.08), transparent 60%), radial-gradient(45% 45% at 30% 70%, rgba(201,166,121,0.1), transparent 60%)',
        }}
      />

      {/* Stacked layers */}
      <div className="relative z-10 w-full text-center px-6">
        {phases.map((p, i) => (
          <div
            key={i}
            className={`phase-big-${i} absolute inset-0 flex items-center justify-center will-change-transform`}
            style={{ opacity: 0 }}
          >
            <span
              className="text-[clamp(4rem,18vw,16rem)] leading-[0.9]"
              style={{
                fontFamily: 'var(--font-logo)',
                fontWeight: 800,
                color: 'var(--color-bone)',
                letterSpacing: '-0.02em',
              }}
            >
              {p.bigWord}
            </span>
          </div>
        ))}

        {phases.map((p, i) => (
          <div
            key={i}
            className={`phase-cap-${i} absolute left-0 right-0 bottom-[16%] md:bottom-[18%] px-6 text-center will-change-transform`}
            style={{ opacity: 0 }}
          >
            <p
              className="text-xl md:text-2xl max-w-2xl mx-auto mb-3"
              style={{
                fontFamily: 'var(--font-editorial)',
                fontStyle: 'italic',
                fontWeight: 400,
                color: 'var(--color-gold)',
              }}
            >
              {p.caption}
            </p>
            <p
              className="text-[14px] max-w-md mx-auto"
              style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-parchment)' }}
            >
              {p.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Top strip */}
      <div className="absolute top-10 left-6 right-6 md:left-10 md:right-10 z-20 flex items-center justify-between">
        <span className="t-micro" style={{ color: 'var(--color-orange)' }}>— The promise</span>
        <span className="t-micro tabular-nums">03 phases</span>
      </div>

      {/* Bottom progress */}
      <div className="absolute bottom-10 left-6 right-6 md:left-10 md:right-10 z-20 flex items-center gap-4">
        <span className="t-micro">Scroll to reveal</span>
        <div className="flex-1 h-px" style={{ background: 'rgba(236,228,210,0.1)' }}>
          <div
            className="pr-progress h-px origin-left"
            style={{ background: 'var(--color-orange)', transform: 'scaleX(0)' }}
          />
        </div>
      </div>
    </section>
  );
}
