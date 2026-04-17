'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingCurtain() {
  const [done, setDone] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const duration = 1500;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setCount(Math.floor(p * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setDone(true), 380);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="curtain"
          className="fixed inset-0 z-[9000] flex items-end justify-between p-8 md:p-12 pointer-events-none"
          initial={{ opacity: 1 }}
          exit={{
            clipPath: 'inset(0 0 100% 0)',
            transition: { duration: 1.05, ease: [0.77, 0, 0.175, 1] },
          }}
          style={{ background: 'var(--color-ink)' }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20, letterSpacing: '0.6em' }}
              animate={{ opacity: 1, y: 0, letterSpacing: '0.32em' }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl md:text-6xl text-bone"
              style={{ fontFamily: 'var(--font-logo)', fontWeight: 700 }}
            >
              TARTARY
            </motion.div>
          </div>

          <div className="t-micro">
            <div>CA&nbsp;—&nbsp;TN</div>
            <div className="mt-1" style={{ color: 'var(--color-orange)' }}>SYSTEM BOOTING</div>
          </div>
          <div className="t-micro tabular-nums text-right" style={{ color: 'var(--color-orange)' }}>
            <div>{String(count).padStart(3, '0')}</div>
            <div className="mt-1" style={{ color: 'var(--color-warm-slate)' }}>LOADING</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
