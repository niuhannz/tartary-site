'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { type Pillar } from '@/lib/theme';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
};

export default function PillarPage({ pillar }: { pillar: Pillar }) {
  return (
    <main className="bg-obsidian text-bone pt-24 md:pt-32 pb-20">
      <div className="max-w-[1200px] mx-auto px-5 md:px-10">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="mb-16 md:mb-24"
        >
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
            <span
              className="text-[10px] tracking-[0.2em] text-orange/50"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {pillar.cmdPrefix}
            </span>
            <div className="rule-orange flex-1" />
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-5xl sm:text-6xl md:text-7xl mb-4"
            style={{ fontFamily: 'var(--font-headline)', fontWeight: 900 }}
          >
            {pillar.label}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-[14px] text-steel max-w-lg"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {pillar.tagline}
          </motion.p>
        </motion.div>

        {/* Product cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          {pillar.products.map((product, i) => (
            <motion.div
              key={product.href}
              variants={fadeUp}
              id={product.href.split('#')[1] || undefined}
            >
              <div className="pillar-card group h-full min-h-[200px] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <span
                      className="text-[10px] text-ash/40 group-hover:text-orange/60 transition-colors duration-[80ms]"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      {String(i).padStart(2, '0')}
                    </span>
                    <span className="w-[3px] h-[3px] bg-orange/30 group-hover:bg-orange transition-colors duration-[80ms]" />
                    <span
                      className="text-[9px] tracking-[0.15em] text-ash/40"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      {pillar.cmdPrefix}{product.name.toUpperCase().replace(/\s/g, '_')}
                    </span>
                  </div>

                  <h2
                    className="text-2xl md:text-3xl text-bone group-hover:text-orange transition-colors duration-[80ms] mb-3"
                    style={{ fontFamily: 'var(--font-headline)', fontWeight: 900 }}
                  >
                    {product.name}
                  </h2>

                  <p
                    className="text-[12px] text-ash leading-relaxed"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    Details coming soon. This product is part of the {pillar.label} department.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gunmetal">
                  <span
                    className="text-[10px] tracking-[0.12em] uppercase text-ash group-hover:text-orange transition-colors duration-[80ms]"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    [COMING SOON]
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Back link */}
        <motion.div
          className="mt-16 pt-8 border-t border-gunmetal/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Link
            href="/"
            className="text-[11px] tracking-[0.12em] uppercase text-ash hover:text-orange transition-colors duration-[80ms]"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            &larr; BACK TO PORTAL
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
