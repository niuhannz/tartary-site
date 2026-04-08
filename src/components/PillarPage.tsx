'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { type Pillar } from '@/lib/theme';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

export default function PillarPage({ pillar }: { pillar: Pillar }) {
  return (
    <main className="bg-black pt-28 md:pt-36 pb-24">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="mb-16 md:mb-24 max-w-2xl"
        >
          <motion.p
            variants={fadeUp}
            className="section-label mb-4"
          >
            Department
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="text-[40px] sm:text-[48px] md:text-[56px] text-white mb-4"
            style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, lineHeight: 1.0, letterSpacing: '-1.2px' }}
          >
            {pillar.label}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-[16px] text-cool-slate"
            style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, lineHeight: 1.4, letterSpacing: '-0.16px' }}
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
          {pillar.products.map((product) => (
            <motion.div
              key={product.href}
              variants={fadeUp}
              id={product.href.split('#')[1] || undefined}
            >
              <div className="bg-surface border border-border-dark rounded-lg p-7 md:p-8 group hover:border-white/10 transition-all duration-150 min-h-[160px] flex flex-col justify-between">
                <div>
                  <h2
                    className="text-[20px] md:text-[24px] text-white group-hover:text-orange transition-colors duration-150 mb-2"
                    style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, lineHeight: 1.0 }}
                  >
                    {product.name}
                  </h2>

                  <p
                    className="text-[13px] text-mid-slate"
                    style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, lineHeight: 1.3, letterSpacing: '-0.16px' }}
                  >
                    Coming soon.
                  </p>
                </div>

                <div className="mt-6 text-mid-slate group-hover:text-orange transition-colors duration-150">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Back */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Link
            href="/"
            className="text-[13px] text-cool-slate hover:text-white transition-colors duration-150"
            style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, letterSpacing: '-0.16px' }}
          >
            &larr; Back to Tartary
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
