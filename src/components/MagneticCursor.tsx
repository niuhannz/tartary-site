'use client';

import { useEffect, useRef } from 'react';

export default function MagneticCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    if (isTouch) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const initX = window.innerWidth / 2;
    const initY = window.innerHeight / 2;
    const mouse = { x: initX, y: initY };
    const dotPos = { x: initX, y: initY };
    const ringPos = { x: initX, y: initY };

    // Make the cursor visible immediately, positioned at window center until mouse moves
    dot.style.opacity = '0';
    ring.style.opacity = '0';
    dot.style.transform = `translate3d(${initX}px, ${initY}px, 0) translate(-50%, -50%)`;
    ring.style.transform = `translate3d(${initX}px, ${initY}px, 0) translate(-50%, -50%)`;

    const showTimer = window.setTimeout(() => {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    }, 2100);

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (dot.style.opacity === '0') {
        dot.style.opacity = '1';
        ring.style.opacity = '1';
      }
    };
    const onLeaveDoc = () => {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    };
    const onEnterDoc = () => {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeaveDoc);
    document.documentElement.addEventListener('mouseenter', onEnterDoc);

    let rafId = 0;
    const tick = () => {
      dotPos.x += (mouse.x - dotPos.x) * 0.55;
      dotPos.y += (mouse.y - dotPos.y) * 0.55;
      ringPos.x += (mouse.x - ringPos.x) * 0.18;
      ringPos.y += (mouse.y - ringPos.y) * 0.18;
      dot.style.transform = `translate3d(${dotPos.x}px, ${dotPos.y}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%)`;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    // Hover-state handling for interactive targets
    const handleEnter = (e: Event) => {
      const el = e.currentTarget as HTMLElement;
      ring.dataset.state = el.dataset.cursor ?? 'hover';
    };
    const handleLeave = () => {
      ring.dataset.state = '';
    };

    const bindTargets = () => {
      document.querySelectorAll<HTMLElement>('a, button, [data-cursor]').forEach((el) => {
        el.removeEventListener('mouseenter', handleEnter);
        el.removeEventListener('mouseleave', handleLeave);
        el.addEventListener('mouseenter', handleEnter);
        el.addEventListener('mouseleave', handleLeave);
      });
    };
    const bindTimer = window.setTimeout(bindTargets, 400);
    // Rebind periodically rather than via MutationObserver (which thrashes under GSAP)
    const reBindInterval = window.setInterval(bindTargets, 2500);

    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(bindTimer);
      window.clearInterval(reBindInterval);
      window.removeEventListener('mousemove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeaveDoc);
      document.documentElement.removeEventListener('mouseenter', onEnterDoc);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden />
      <div ref={dotRef} className="cursor-dot" aria-hidden />
    </>
  );
}
