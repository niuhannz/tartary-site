'use client';

import { motion } from 'framer-motion';

interface PageHeaderProps {
  label: string;
  title: string;
  description?: string;
}

export default function PageHeader({ label, title, description }: PageHeaderProps) {
  return (
    <section className="pt-32 md:pt-44 pb-16 md:pb-24 px-6 md:px-10">
      <div className="max-w-[1400px] mx-auto">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-[11px] tracking-[0.3em] uppercase text-gold block mb-6"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          {label}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl md:text-6xl lg:text-7xl max-w-4xl leading-[1.05]"
        >
          {title}
        </motion.h1>

        {description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 text-lg md:text-xl text-ash max-w-2xl leading-relaxed"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
          >
            {description}
          </motion.p>
        )}

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 separator origin-left"
        />
      </div>
    </section>
  );
}
