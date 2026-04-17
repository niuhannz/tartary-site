'use client';

import { ElementType, ReactNode, useEffect, useRef } from 'react';
import SplitType from 'split-type';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  split?: 'words' | 'chars' | 'lines';
  stagger?: number;
  duration?: number;
  delay?: number;
  trigger?: 'mount' | 'view';
  ease?: string;
};

export default function SplitReveal({
  as: Tag = 'span',
  children,
  className = '',
  split = 'words',
  stagger = 0.06,
  duration = 1,
  delay = 0,
  trigger = 'view',
  ease = 'expo.out',
}: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const typesMap: Record<string, 'words' | 'chars' | 'lines'> = {
      words: 'words',
      chars: 'chars',
      lines: 'lines',
    };
    const type = typesMap[split];

    const st = new SplitType(el, {
      types: split === 'chars' ? 'words,chars' : split,
      wordClass: 'word',
      charClass: 'char',
      lineClass: 'line',
    });

    const targets = (type === 'words'
      ? st.words
      : type === 'chars'
      ? st.chars
      : st.lines) as HTMLElement[] | null;

    if (!targets || !targets.length) return;

    targets.forEach((t) => {
      const parent = t.parentElement;
      if (!parent) return;
      const wrap = document.createElement('span');
      wrap.style.display = 'inline-block';
      wrap.style.overflow = 'hidden';
      wrap.style.verticalAlign = 'top';
      parent.insertBefore(wrap, t);
      wrap.appendChild(t);
      (t as HTMLElement).style.display = 'inline-block';
      (t as HTMLElement).style.willChange = 'transform';
    });

    gsap.set(targets, { yPercent: 100 });

    const tween = gsap.to(targets, {
      yPercent: 0,
      duration,
      ease,
      stagger,
      delay,
      paused: trigger === 'view',
    });

    let st2: ScrollTrigger | undefined;
    if (trigger === 'view') {
      st2 = ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => tween.play(),
      });
    }

    return () => {
      st2?.kill();
      tween.kill();
      st.revert();
    };
  }, [split, stagger, duration, delay, trigger, ease]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Component = Tag as any;
  return (
    <Component ref={ref} className={className}>
      {children}
    </Component>
  );
}
