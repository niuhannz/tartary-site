'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function MagneticCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    if (isTouch) return;

    const dot = dotRef.current!;
    const ring = ringRef.current!;

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const dotPos = { x: mouse.x, y: mouse.y };
    const ringPos = { x: mouse.x, y: mouse.y };

    gsap.set(dot, { x: mouse.x, y: mouse.y, opacity: 0 });
    gsap.set(ring, { x: mouse.x, y: mouse.y, opacity: 0 });

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const onEnter = () => {
      gsap.to([dot, ring], { opacity: 1, duration: 0.4 });
    };
    const onLeave = () => {
      gsap.to([dot, ring], { opacity: 0, duration: 0.4 });
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseenter', onEnter);
    document.documentElement.addEventListener('mouseleave', onLeave);

    let rafId = 0;
    const tick = () => {
      dotPos.x += (mouse.x - dotPos.x) * 0.55;
      dotPos.y += (mouse.y - dotPos.y) * 0.55;
      ringPos.x += (mouse.x - ringPos.x) * 0.18;
      ringPos.y += (mouse.y - ringPos.y) * 0.18;
      gsap.set(dot, { x: dotPos.x, y: dotPos.y });
      gsap.set(ring, { x: ringPos.x, y: ringPos.y });
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const handleTarget = (e: Event, enter: boolean) => {
      const el = e.currentTarget as HTMLElement;
      const state = el.dataset.cursor ?? 'hover';
      ring.dataset.state = enter ? state : '';
    };

    const bind = () => {
      const targets = document.querySelectorAll<HTMLElement>(
        'a, button, [data-cursor]'
      );
      targets.forEach((el) => {
        el.addEventListener('mouseenter', (e) => handleTarget(e, true));
        el.addEventListener('mouseleave', (e) => handleTarget(e, false));
      });
    };
    const bindTimer = window.setTimeout(bind, 400);
    const mo = new MutationObserver(() => {
      window.clearTimeout(bindTimer);
      window.setTimeout(bind, 200);
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseenter', onEnter);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(rafId);
      window.clearTimeout(bindTimer);
      mo.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden />
      <div ref={dotRef} className="cursor-dot" aria-hidden />
    </>
  );
}
