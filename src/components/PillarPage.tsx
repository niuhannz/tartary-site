'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { type Pillar } from '@/lib/theme';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};

export default function PillarPage({ pillar }: { pillar: Pillar }) {
  return (
    <main className="bg-obsidian pt-32 md:pt-40 pb-28">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="mb-20 md:mb-28 max-w-2xl"
        >
          <motion.h1
            variants={fadeUp}
            className="text-5xl sm:text-6xl md:text-[64px] mb-5"
            style={{ fontFamily: 'Georgia, serif', fontWeight: 400, lineHeight: 1.1 }}
          >
            {pillar.label}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-[17px] text-stone"
            style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, lineHeight: 1.6 }}
          >
            {pillar.tagline}
          </motion.p>
        </motion.div>

        {/* Product cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
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
              <div className="bg-obsidian-lit ring-subtle rounded-xl p-8 md:p-10 group ring-hover transition-all duration-150 hover:translate-y-[-2px] min-h-[180px] flex flex-col justify-between">
                <div>
                  <h2
                    className="text-[28px] md:text-[32px] text-bone group-hover:text-orange transition-colors duration-150 mb-3"
                    style={{ fontFamily: 'Georgia, serif', fontWeight: 400, lineHeight: 1.2 }}
                  >
                    {product.name}
                  </h2>

                  <p
                    className="text-[15px] text-stone"
                    style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, lineHeight: 1.6 }}
                  >
                    Coming soon.
                  </p>
                </div>

                <div className="mt-8 text-stone group-hover:text-orange transition-colors duration-150">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Back */}
        <motion.div
          className="mt-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Link
            href="/"
            className="text-[14px] text-stone hover:text-orange transition-colors duration-150"
            style={{ fontFamily: 'var(--font-sans)', fontWeight: 500 }}
          >
            &larr; Back to Tartary
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
