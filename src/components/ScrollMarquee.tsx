'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Big scroll-velocity reactive marquee.
 * - Base auto-drifts at a slow speed.
 * - Scroll velocity adds to x-translation and skews the track slightly.
 * - Direction flips with scroll direction.
 */
export default function ScrollMarquee({
  words,
  baseSpeed = 0.6,
  className = '',
}: {
  words: string[];
  baseSpeed?: number;
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let x = 0;
    let scrollVel = 0;
    let lastScroll = window.scrollY;
    let rafId = 0;

    const update = () => {
      const cur = window.scrollY;
      const delta = cur - lastScroll;
      lastScroll = cur;
      // Capture velocity with decay
      scrollVel += delta * 3.2;
      scrollVel *= 0.92;

      x -= baseSpeed + scrollVel * 0.18;
      // Wrap
      const half = track.scrollWidth / 2;
      if (half > 0) {
        if (x < -half) x += half;
        else if (x > 0) x -= half;
      }

      const skew = gsap.utils.clamp(-18, 18, scrollVel * 0.14);
      gsap.set(track, { x, skewX: skew });
      rafId = requestAnimationFrame(update);
    };
    rafId = requestAnimationFrame(update);

    return () => cancelAnimationFrame(rafId);
  }, [baseSpeed]);

  return (
    <div className={`relative overflow-hidden ${className}`} aria-hidden>
      <div
        ref={trackRef}
        className="flex gap-10 whitespace-nowrap will-change-transform"
        style={{ transformOrigin: 'center' }}
      >
        {[...words, ...words, ...words, ...words].map((w, i) => (
          <span key={i} className="flex items-center gap-10 shrink-0">
            <span
              className="text-[7vw] md:text-[5.5vw] leading-none text-bone"
              style={{ fontFamily: 'var(--font-logo)', fontWeight: 800, letterSpacing: '-0.02em' }}
            >
              {w}
            </span>
            <span className="text-[7vw] md:text-[5.5vw] leading-none" style={{ color: 'var(--color-orange)' }}>
              ·
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
