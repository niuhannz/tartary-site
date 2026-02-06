'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import PageHeader from '@/components/PageHeader';
import SectionReveal from '@/components/SectionReveal';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut' as const,
    },
  },
} as const;

const cardHoverVariants = {
  rest: {
    y: 0,
    borderColor: 'rgba(201, 169, 110, 0.3)',
    boxShadow: '0 0 0 rgba(201, 169, 110, 0)',
  },
  hover: {
    y: -8,
    borderColor: 'rgba(201, 169, 110, 0.8)',
    boxShadow: '0 0 30px rgba(201, 169, 110, 0.3)',
    transition: {
      duration: 0.3,
      ease: 'easeOut' as const,
    },
  },
} as const;

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut' as const,
    },
  },
} as const;

// Featured films data
const featuredFilms = [
  {
    id: 'weight-of-water',
    title: 'The Weight of Water',
    year: 2023,
    genre: 'Drama',
    role: 'Director',
    logline: 'A meditation on migration and memory.',
    festivals: ['Venice', 'SXSW'],
    color: 'from-amber-900/30 to-orange-950/30',
    accentColor: '#d97706',
  },
  {
    id: 'neon-dynasty',
    title: 'Neon Dynasty',
    year: 2023,
    genre: 'Sci-Fi',
    role: 'Producer',
    logline: 'Cyberpunk reimagining of ancient dynasties.',
    festivals: ['Sundance'],
    color: 'from-violet-900/30 to-purple-950/30',
    accentColor: '#a855f7',
  },
  {
    id: 'empire-of-dust',
    title: 'Empire of Dust',
    year: 2024,
    genre: 'Epic',
    role: 'Producer',
    logline: 'A sweeping historical drama spanning two continents.',
    festivals: ['In Post-Production'],
    color: 'from-red-900/30 to-rose-950/30',
    accentColor: '#dc2626',
  },
  {
    id: 'silk-roads',
    title: 'Silk Roads',
    year: 2022,
    genre: 'Documentary',
    role: 'Producer',
    logline: 'Tracing ancient trade routes through modern eyes.',
    festivals: ['Berlinale'],
    color: 'from-yellow-900/30 to-amber-950/30',
    accentColor: '#eab308',
  },
];

// Services offered
const services = [
  {
    title: 'Production',
    description: 'Full-service film production from development through post.',
  },
  {
    title: 'Consulting',
    description: 'Creative and strategic guidance for visionary projects.',
  },
  {
    title: 'Co-Production',
    description: 'Partnership development and co-production services.',
  },
  {
    title: 'Festival Strategy',
    description: 'Strategic planning and positioning for major festivals.',
  },
];

// Festival recognition
const festivals = [
  'Venice Film Festival',
  'Sundance',
  'SXSW',
  'Berlinale',
  'Golden Horse',
];

export default function CinemaPage() {
  return (
    <main className="bg-background text-foreground">
      {/* ──────────────────────────────────────────── PAGE HEADER ─────────────────────────────────────────── */}
      <PageHeader
        label="Cinema"
        title="Stories for the Screen"
        description="Award-winning film production across multiple festivals and genres. We work with visionary directors and creative partners to bring compelling narratives to life."
      />

      {/* ──────────────────────────────────────────── FEATURED FILMS ─────────────────────────────────────────── */}
      <section className="py-24 sm:py-40 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <SectionReveal delay={0.1}>
            <motion.div
              className="mb-16 sm:mb-24 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2
                className="text-4xl sm:text-5xl lg:text-6xl font-light mb-6 text-foreground"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Featured Films
              </h2>
              <div className="separator w-12 h-0.5 bg-gold mx-auto mb-8 opacity-60" />
              <p
                className="text-lg text-mist max-w-2xl mx-auto"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                A selection of our recent and upcoming projects across drama, documentary, and experimental cinema.
              </p>
            </motion.div>
          </SectionReveal>

          {/* Featured films grid */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10"
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            viewport={{ once: true }}
          >
            {featuredFilms.map((film) => (
              <motion.div key={film.id} variants={itemVariants}>
                <motion.div
                  className="group relative rounded-lg overflow-hidden border-2 border-gold border-opacity-30 transition-all duration-500"
                  initial="rest"
                  whileHover="hover"
                  variants={cardHoverVariants}
                >
                  {/* Background gradient with warm tones */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${film.color} opacity-100 group-hover:opacity-100 transition-opacity duration-500`}
                  />

                  {/* Animated accent glow on hover */}
                  <motion.div
                    className="absolute -inset-1 rounded-lg opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500"
                    style={{
                      background: film.accentColor,
                    }}
                  />

                  {/* Content container */}
                  <div className="relative p-8 sm:p-10 lg:p-12 z-10">
                    {/* Year and genre header */}
                    <div className="flex items-baseline justify-between mb-6 gap-4">
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-sm uppercase tracking-widest text-gold font-light"
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        {film.year}
                      </motion.span>
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.05 }}
                        viewport={{ once: true }}
                        className="text-xs uppercase tracking-widest px-3 py-1.5 border border-gold border-opacity-50 text-gold rounded-full group-hover:border-opacity-100 group-hover:bg-gold group-hover:bg-opacity-10 transition-all duration-500"
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        {film.genre}
                      </motion.span>
                    </div>

                    {/* Film title */}
                    <h3
                      className="text-3xl sm:text-4xl lg:text-5xl font-light mb-4 text-foreground group-hover:text-gold-light transition-colors duration-500"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {film.title}
                    </h3>

                    {/* Role */}
                    <p
                      className="text-xs uppercase tracking-widest text-ash group-hover:text-gold transition-colors duration-500 mb-6"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      {film.role}
                    </p>

                    {/* Logline */}
                    <p
                      className="text-base sm:text-lg text-mist group-hover:text-foreground transition-colors duration-500 mb-8 leading-relaxed"
                      style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
                    >
                      {film.logline}
                    </p>

                    {/* Festival badges */}
                    <div className="flex flex-wrap gap-2">
                      {film.festivals.map((festival, idx) => (
                        <motion.span
                          key={festival}
                          variants={badgeVariants}
                          initial="hidden"
                          whileInView="visible"
                          transition={{ delay: idx * 0.08 }}
                          viewport={{ once: true }}
                          className="text-xs uppercase tracking-widest px-2.5 py-1 border border-gold border-opacity-40 text-gold rounded group-hover:border-opacity-100 group-hover:text-gold-light transition-all duration-500"
                          style={{ fontFamily: 'var(--font-mono)' }}
                        >
                          {festival}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ──────────────────────────────────────────── SERVICES ─────────────────────────────────────────── */}
      <section className="py-24 sm:py-40 px-4 sm:px-6 lg:px-8 bg-charcoal">
        <div className="max-w-6xl mx-auto">
          <SectionReveal delay={0.1}>
            <motion.div
              className="mb-16 sm:mb-24 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2
                className="text-4xl sm:text-5xl lg:text-6xl font-light mb-6 text-foreground"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                What We Offer
              </h2>
              <div className="separator w-12 h-0.5 bg-gold mx-auto mb-8 opacity-60" />
              <p
                className="text-lg text-mist max-w-2xl mx-auto"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Comprehensive services for bringing cinematic visions to life.
              </p>
            </motion.div>
          </SectionReveal>

          {/* Services grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            viewport={{ once: true }}
          >
            {services.map((service, idx) => (
              <motion.div
                key={service.title}
                variants={itemVariants}
                className="group p-8 sm:p-6 border border-gold border-opacity-30 rounded-lg hover:border-opacity-100 hover:bg-gold hover:bg-opacity-5 transition-all duration-500 flex flex-col"
              >
                {/* Icon-like element */}
                <motion.div
                  className="w-12 h-12 rounded-lg border border-gold border-opacity-40 flex items-center justify-center mb-6 group-hover:border-opacity-100 group-hover:bg-gold group-hover:bg-opacity-10 transition-all duration-500"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-lg text-gold group-hover:text-gold-light transition-colors duration-500">
                    {idx === 0 && '🎬'}
                    {idx === 1 && '💡'}
                    {idx === 2 && '🤝'}
                    {idx === 3 && '🎆'}
                  </div>
                </motion.div>

                <h3
                  className="text-xl sm:text-lg font-light text-foreground mb-3 group-hover:text-gold-light transition-colors duration-500"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {service.title}
                </h3>
                <p
                  className="text-sm sm:text-base text-mist group-hover:text-foreground transition-colors duration-500 leading-relaxed flex-grow"
                  style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
                >
                  {service.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ──────────────────────────────────────────── FESTIVAL RECOGNITION ─────────────────────────────────────────── */}
      <section className="py-24 sm:py-40 px-4 sm:px-6 lg:px-8 bg-carbon">
        <div className="max-w-6xl mx-auto">
          <SectionReveal delay={0.1}>
            <motion.div
              className="text-center mb-16 sm:mb-20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-light mb-4 text-foreground"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Festival Recognition
              </h2>
              <p
                className="text-base text-mist"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Honored at the world's most prestigious film festivals
              </p>
            </motion.div>

            {/* Festivals horizontal bar */}
            <motion.div
              className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {festivals.map((festival, idx) => (
                <motion.div
                  key={festival}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="px-6 sm:px-8 py-3 border border-gold border-opacity-40 rounded-full hover:border-opacity-100 hover:bg-gold hover:bg-opacity-5 transition-all duration-500 group cursor-default"
                >
                  <span
                    className="text-sm sm:text-base text-gold group-hover:text-gold-light transition-colors duration-500 font-light"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {festival}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </SectionReveal>
        </div>
      </section>

      {/* ──────────────────────────────────────────── FINAL CTA SECTION ─────────────────────────────────────────── */}
      <section className="py-32 sm:py-48 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-charcoal to-carbon relative overflow-hidden">
        {/* Animated background accent */}
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background: 'radial-gradient(circle at center, rgba(201, 169, 110, 0.05) 0%, transparent 70%)',
          }}
          animate={{
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: 'easeInOut' as const,
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <SectionReveal delay={0.1}>
            <motion.h2
              className="text-5xl sm:text-6xl lg:text-7xl font-light mb-8 text-foreground leading-tight"
              style={{ fontFamily: 'var(--font-heading)' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
              viewport={{ once: true }}
            >
              Ready to Bring Your Story to Screen?
            </motion.h2>

            <motion.p
              className="text-lg sm:text-xl text-mist mb-12 max-w-2xl mx-auto leading-relaxed"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              viewport={{ once: true }}
            >
              Whether you're seeking production support, creative consulting, or strategic guidance, we're ready to collaborate on your next cinematic project.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Link
                href="/contact"
                className="px-10 py-4 border-2 border-gold text-gold hover:bg-gold hover:text-carbon transition-all duration-300 font-light tracking-wider text-lg rounded"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Get in Touch
              </Link>
              <Link
                href="/"
                className="px-10 py-4 border-2 border-gold border-opacity-40 text-gold hover:border-opacity-100 hover:bg-gold hover:bg-opacity-5 transition-all duration-300 font-light tracking-wider text-lg rounded"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Explore TARTARY
              </Link>
            </motion.div>
          </SectionReveal>
        </div>
      </section>
    </main>
  );
}
