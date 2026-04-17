'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { pillars } from '@/lib/theme';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function PillarsHorizontal() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;

    const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth);

    const ctx = gsap.context(() => {
      const tween = gsap.to(track, {
        x: () => -getDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: () => `+=${getDistance()}`,
          scrub: 0.8,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      gsap.utils.toArray<HTMLElement>('.pillar-panel').forEach((panel) => {
        const title = panel.querySelector('.p-title');
        const body = panel.querySelector('.p-body');
        const num = panel.querySelector('.p-num');
        const prods = panel.querySelectorAll('.p-prod');
        if (!title || !body || !num) return;
        gsap.fromTo(
          [num, title, body, ...Array.from(prods)],
          { yPercent: 40, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.0,
            ease: 'expo.out',
            stagger: 0.06,
            scrollTrigger: {
              trigger: panel,
              containerAnimation: tween,
              start: 'left 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      // Progress bar for scroll
      gsap.to('.pillars-progress', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: () => `+=${getDistance()}`,
          scrub: 0.4,
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative overflow-hidden" style={{ background: 'var(--color-ink)' }} aria-label="Conglomerate">
      {/* Intro strip */}
      <div className="max-w-[1480px] mx-auto px-6 md:px-10 pt-28 md:pt-36 pb-12 md:pb-20 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <div className="t-micro mb-4" style={{ color: 'var(--color-orange)' }}>— The conglomerate</div>
          <h2
            className="text-[clamp(2.25rem,6vw,5rem)] text-bone leading-[1.0]"
            style={{ fontFamily: 'var(--font-logo)', fontWeight: 800, letterSpacing: '-0.03em' }}
          >
            Tartary OS is one of{' '}
            <span
              className="font-editorial-italic"
              style={{ color: 'var(--color-gold)', fontWeight: 400 }}
            >
              five departments.
            </span>
          </h2>
        </div>
        <p
          className="max-w-sm text-[15px]"
          style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-warm-silver)', lineHeight: 1.55 }}
        >
          Every layer owned. Every tool built in-house. From the operating system that generates it to the cinema it runs on.
        </p>
      </div>

      {/* Pinned horizontal track */}
      <div className="h-[100svh] w-screen flex items-center relative">
        {/* Progress bar at bottom */}
        <div className="absolute bottom-10 left-6 right-6 md:left-10 md:right-10 flex items-center gap-4 z-20">
          <span className="t-micro">Scroll</span>
          <div className="flex-1 h-px" style={{ background: 'rgba(236,228,210,0.1)' }}>
            <div
              className="pillars-progress h-px origin-left"
              style={{ background: 'var(--color-orange)', transform: 'scaleX(0)' }}
            />
          </div>
          <span className="t-micro tabular-nums" style={{ color: 'var(--color-orange)' }}>01—05</span>
        </div>

        <div
          ref={trackRef}
          className="flex gap-6 md:gap-8 pl-[4vw] pr-[12vw] will-change-transform"
        >
          {pillars.map((pillar) => {
            const isActive = pillar.id === 'system';
            return (
              <Link
                key={pillar.id}
                href={pillar.href}
                data-cursor="view"
                className="pillar-panel group relative shrink-0 w-[78vw] md:w-[48vw] lg:w-[38vw] h-[65vh] md:h-[70vh] rounded-sm overflow-hidden border hairline"
                style={{
                  background: isActive
                    ? 'linear-gradient(160deg, rgba(255, 102, 0, 0.22), rgba(13, 10, 8, 0.9))'
                    : 'linear-gradient(160deg, rgba(26, 20, 16, 0.7), rgba(13, 10, 8, 0.95))',
                }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{ background: 'radial-gradient(80% 100% at 30% 20%, rgba(255,102,0,0.18), transparent 60%)' }}
                />

                <div className="relative h-full flex flex-col justify-between p-8 md:p-12">
                  <div className="flex items-start justify-between">
                    <span
                      className="p-num text-[100px] md:text-[160px] leading-none select-none"
                      style={{
                        fontFamily: 'var(--font-logo)',
                        fontWeight: 800,
                        color: isActive ? 'rgba(255, 102, 0, 0.28)' : 'rgba(236, 228, 210, 0.1)',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {pillar.idx}
                    </span>
                    <div className="flex flex-col items-end gap-2">
                      {isActive && (
                        <span
                          className="t-micro flex items-center gap-2"
                          style={{ color: 'var(--color-orange)' }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full animate-pulse"
                            style={{ background: 'var(--color-orange)' }}
                          />
                          Active
                        </span>
                      )}
                      <span className="t-micro">{pillar.cmdPrefix}</span>
                    </div>
                  </div>

                  <div>
                    <div className="t-micro mb-4" style={{ color: 'var(--color-orange)' }}>
                      {pillar.tagline}
                    </div>
                    <h3
                      className="p-title text-5xl md:text-6xl lg:text-7xl text-bone mb-8"
                      style={{
                        fontFamily: 'var(--font-logo)',
                        fontWeight: 700,
                        letterSpacing: '0.04em',
                      }}
                    >
                      {pillar.label}
                    </h3>
                    <p
                      className="p-body text-lg mb-6"
                      style={{
                        fontFamily: 'var(--font-editorial)',
                        fontStyle: 'italic',
                        fontWeight: 400,
                        color: 'var(--color-parchment)',
                        lineHeight: 1.35,
                      }}
                    >
                      {pillar.products.length} product{pillar.products.length === 1 ? '' : 's'} ·{' '}
                      {pillar.products.slice(0, 2).map((p) => p.name).join(', ')}
                      {pillar.products.length > 2 ? ', …' : ''}
                    </p>

                    <div className="space-y-1.5 mb-6">
                      {pillar.products.map((prod) => (
                        <div
                          key={prod.href}
                          className="p-prod text-[14px] flex items-baseline gap-2"
                          style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-warm-silver)' }}
                        >
                          <span
                            className="inline-block w-1 h-1 rounded-full"
                            style={{ background: 'var(--color-warm-slate)' }}
                          />
                          {prod.name}
                        </div>
                      ))}
                    </div>

                    <div
                      className="flex items-center gap-3 transition-transform duration-500 group-hover:translate-x-2"
                      style={{ color: 'var(--color-orange)' }}
                    >
                      <span className="t-micro" style={{ color: 'var(--color-orange)' }}>Enter</span>
                      <span className="h-px w-8 transition-all duration-500 group-hover:w-16" style={{ background: 'var(--color-orange)' }} />
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M1 7H13M13 7L7 1M13 7L7 13" stroke="currentColor" strokeWidth="1.2" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
          <div className="shrink-0 w-[6vw]" />
        </div>
      </div>
    </section>
  );
}
