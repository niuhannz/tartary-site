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
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
};

export default function PillarPage({ pillar }: { pillar: Pillar }) {
  return (
    <main className="bg-obsidian text-bone pt-28 md:pt-36 pb-24">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="mb-20"
        >
          <motion.h1
            variants={fadeUp}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.06em] mb-4"
            style={{ fontFamily: 'var(--font-logo)', fontWeight: 700 }}
          >
            {pillar.label}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-[16px] text-bone/40"
            style={{ fontFamily: 'var(--font-logo)', fontWeight: 400 }}
          >
            {pillar.tagline}
          </motion.p>
        </motion.div>

        {/* Product cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gunmetal/30"
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
              <div className="bg-obsidian p-8 md:p-10 group hover:bg-obsidian-lit transition-colors duration-100 min-h-[200px] flex flex-col justify-between">
                <div>
                  <h2
                    className="text-2xl md:text-3xl tracking-[0.04em] text-bone group-hover:text-orange transition-colors duration-100 mb-3"
                    style={{ fontFamily: 'var(--font-logo)', fontWeight: 700 }}
                  >
                    {product.name}
                  </h2>

                  <p
                    className="text-[14px] text-bone/30"
                    style={{ fontFamily: 'var(--font-logo)', fontWeight: 400 }}
                  >
                    Coming soon.
                  </p>
                </div>

                <div className="mt-8 text-bone/15 group-hover:text-orange transition-colors duration-100">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
          transition={{ delay: 0.5 }}
        >
          <Link
            href="/"
            className="text-[14px] text-bone/30 hover:text-orange transition-colors duration-100"
            style={{ fontFamily: 'var(--font-logo)', fontWeight: 500 }}
          >
            &larr; Back
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
