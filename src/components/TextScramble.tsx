'use client';

import { ReactNode, useRef, useEffect } from 'react';

const GLYPHS = '!<>-_\\/[]{}—=+*^?#________';

function scramble(
  el: HTMLElement,
  from: string,
  to: string,
  onDone?: () => void
) {
  const length = Math.max(from.length, to.length);
  const queue: { from: string; to: string; start: number; end: number; char?: string }[] = [];
  for (let i = 0; i < length; i++) {
    queue.push({
      from: from[i] || '',
      to: to[i] || '',
      start: Math.floor(Math.random() * 18),
      end: Math.floor(Math.random() * 18) + 18,
    });
  }
  let frame = 0;
  let raf = 0;
  const update = () => {
    let output = '';
    let complete = 0;
    for (const q of queue) {
      if (frame >= q.end) {
        complete++;
        output += q.to;
      } else if (frame >= q.start) {
        if (!q.char || Math.random() < 0.3) {
          q.char = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
        output += q.char;
      } else {
        output += q.from;
      }
    }
    el.textContent = output;
    if (complete === queue.length) {
      onDone?.();
      return;
    }
    frame++;
    raf = requestAnimationFrame(update);
  };
  update();
  return () => cancelAnimationFrame(raf);
}

export default function TextScramble({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const originalRef = useRef<string>('');
  const cancelRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    originalRef.current = el.textContent ?? '';

    const trigger = el.closest('a, button, [data-scramble-trigger]') as HTMLElement | null;
    const target = trigger ?? el;

    const onEnter = () => {
      cancelRef.current?.();
      const orig = originalRef.current;
      cancelRef.current = scramble(el, el.textContent ?? orig, orig) ?? null;
    };
    const onLeave = () => {
      cancelRef.current?.();
      el.textContent = originalRef.current;
    };

    // Scramble on hover-in by temporarily mutating from a noisy sibling string
    const onEnterFx = () => {
      cancelRef.current?.();
      const orig = originalRef.current;
      const noise = orig
        .split('')
        .map(() => GLYPHS[Math.floor(Math.random() * GLYPHS.length)])
        .join('');
      cancelRef.current = scramble(el, noise, orig) ?? null;
    };

    target.addEventListener('mouseenter', onEnterFx);
    target.addEventListener('mouseleave', onLeave);
    return () => {
      target.removeEventListener('mouseenter', onEnterFx);
      target.removeEventListener('mouseleave', onLeave);
      cancelRef.current?.();
    };
  }, []);

  return (
    <span ref={ref} className={className}>
      {children}
    </span>
  );
}
