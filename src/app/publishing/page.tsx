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

// Featured publications data
const featuredPublications = [
  {
    id: 'meridian-chronicles',
    title: 'The Meridian Chronicles',
    format: 'Novel Trilogy',
    description: 'A novel trilogy expanding the Meridian Archives universe. Hard sci-fi with literary ambition.',
    color: 'from-violet-900/30 to-purple-950/30',
    accentColor: '#7c3aed',
    spineColor: 'bg-violet-600/40',
  },
  {
    id: 'atlas-cartographer',
    title: 'Atlas of the Cartographer',
    format: 'Graphic Novel',
    description: 'A lavish illustrated graphic novel exploring the Cartographer\'s Dream world with stunning visual storytelling.',
    color: 'from-indigo-900/30 to-blue-950/30',
    accentColor: '#4f46e5',
    spineColor: 'bg-indigo-600/40',
  },
  {
    id: 'jade-empire-origins',
    title: 'Jade Empire: Origins',
    format: 'Anthology',
    description: 'An anthology of short stories set in the Jade Empire mythology. Multiple authors, one universe.',
    color: 'from-emerald-900/30 to-teal-950/30',
    accentColor: '#10b981',
    spineColor: 'bg-emerald-600/40',
  },
];

// Publishing categories
const publishingCategories = [
  {
    category: 'Novels',
    description: 'Full-length narratives that explore the depths of our cinematic worlds through prose, from epic sagas to intimate character studies.',
  },
  {
    category: 'Graphic Novels',
    description: 'Visually stunning storytelling that blends the literary and the visual, expanding worlds with sequential art and illustrations.',
  },
  {
    category: 'Art Books',
    description: 'Lavish volumes celebrating the visual design, concept art, and cultural artifacts of our universes.',
  },
  {
    category: 'Anthologies',
    description: 'Curated collections featuring diverse voices and perspectives within shared mythologies and established worlds.',
  },
];

export default function PublishingPage() {
  return (
    <main className="bg-background text-foreground">
      {/* ──────────────────────────────────────────── PAGE HEADER ─────────────────────────────────────────── */}
      <PageHeader
        label="Publishing"
        title="Words That Build Worlds"
        description="Extending our cinematic universes into novels, graphic novels, and literary formats. Every story has more to tell on the page."
      />

      {/* ──────────────────────────────────────────── VISION STATEMENT ─────────────────────────────────────────── */}
      <section className="py-24 sm:py-40 px-4 sm:px-6 lg:px-8 bg-charcoal">
        <div className="max-w-5xl mx-auto">
          <SectionReveal delay={0.1}>
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <p
                className="text-2xl sm:text-3xl lg:text-4xl italic font-light mb-8 text-gold leading-relaxed"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                "The written word does what cinema cannot—it lives in the reader's imagination, creating infinite variations of the same world."
              </p>
              <div className="separator w-12 h-0.5 bg-gold mx-auto mb-8 opacity-60" />
              <p
                className="text-base sm:text-lg text-mist max-w-3xl mx-auto leading-relaxed"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
              >
                Every TARTARY universe has a literary dimension waiting to be explored. Our Publishing division brings these worlds to life through novels, graphic novels, and curated anthologies—each format revealing new layers of storytelling that complement and expand our cinematic vision.
              </p>
            </motion.div>
          </SectionReveal>
        </div>
      </section>

      {/* ──────────────────────────────────────────── FEATURED PUBLICATIONS ─────────────────────────────────────────── */}
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
                Featured Publications
              </h2>
              <div className="separator w-12 h-0.5 bg-gold mx-auto mb-8 opacity-60" />
              <p
                className="text-lg text-mist max-w-2xl mx-auto"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Handpicked literary works extending our cinematic worlds into new dimensions.
              </p>
            </motion.div>
          </SectionReveal>

          {/* Featured publications grid */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10"
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            viewport={{ once: true }}
          >
            {featuredPublications.map((pub) => (
              <motion.div key={pub.id} variants={itemVariants}>
                <motion.div
                  className="group relative rounded-lg overflow-hidden border-2 border-gold border-opacity-30 transition-all duration-500 h-full flex flex-col"
                  initial="rest"
                  whileHover="hover"
                  variants={cardHoverVariants}
                >
                  {/* Book spine accent on left */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${pub.spineColor} group-hover:w-2 transition-all duration-500`} />

                  {/* Background gradient with purple/violet tints */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${pub.color} opacity-100 group-hover:opacity-100 transition-opacity duration-500`}
                  />

                  {/* Animated accent glow on hover */}
                  <motion.div
                    className="absolute -inset-1 rounded-lg opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500"
                    style={{
                      background: pub.accentColor,
                    }}
                  />

                  {/* Content container */}
                  <div className="relative p-8 sm:p-10 lg:p-12 z-10 flex flex-col h-full">
                    {/* Format badge */}
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6 }}
                      viewport={{ once: true }}
                      className="text-xs uppercase tracking-widest px-3 py-1.5 border border-gold border-opacity-50 text-gold rounded-full group-hover:border-opacity-100 group-hover:bg-gold group-hover:bg-opacity-10 transition-all duration-500 w-fit mb-6"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      {pub.format}
                    </motion.span>

                    {/* Publication title */}
                    <h3
                      className="text-3xl sm:text-4xl lg:text-5xl font-light mb-4 text-foreground group-hover:text-gold-light transition-colors duration-500"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {pub.title}
                    </h3>

                    {/* Description */}
                    <p
                      className="text-base sm:text-lg text-mist group-hover:text-foreground transition-colors duration-500 mb-8 leading-relaxed flex-grow"
                      style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
                    >
                      {pub.description}
                    </p>

                    {/* Learn more link */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Link
                        href="#"
                        className="text-sm uppercase tracking-widest text-gold group-hover:text-gold-light transition-colors duration-500 font-light inline-flex items-center gap-2"
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        Discover
                        <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ──────────────────────────────────────────── WHAT WE PUBLISH ─────────────────────────────────────────── */}
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
                What We Publish
              </h2>
              <div className="separator w-12 h-0.5 bg-gold mx-auto mb-8 opacity-60" />
              <p
                className="text-lg text-mist max-w-2xl mx-auto"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                A diverse range of literary formats to explore our universes.
              </p>
            </motion.div>
          </SectionReveal>

          {/* Publishing categories grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            viewport={{ once: true }}
          >
            {publishingCategories.map((item, idx) => (
              <motion.div
                key={item.category}
                variants={itemVariants}
                className="group p-8 sm:p-6 border border-gold border-opacity-30 rounded-lg hover:border-opacity-100 hover:bg-gold hover:bg-opacity-5 transition-all duration-500 flex flex-col"
              >
                {/* Icon-like element */}
                <motion.div
                  className="w-12 h-12 rounded-lg border border-gold border-opacity-40 flex items-center justify-center mb-6 group-hover:border-opacity-100 group-hover:bg-gold group-hover:bg-opacity-10 transition-all duration-500"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-lg text-gold group-hover:text-gold-light transition-colors duration-500">
                    {idx === 0 && '📖'}
                    {idx === 1 && '🎨'}
                    {idx === 2 && '🖼️'}
                    {idx === 3 && '✒️'}
                  </div>
                </motion.div>

                <h3
                  className="text-xl sm:text-lg font-light text-foreground mb-3 group-hover:text-gold-light transition-colors duration-500"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {item.category}
                </h3>
                <p
                  className="text-sm sm:text-base text-mist group-hover:text-foreground transition-colors duration-500 leading-relaxed flex-grow"
                  style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
                >
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
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
              Have a Story Waiting to Be Written?
            </motion.h2>

            <motion.p
              className="text-lg sm:text-xl text-mist mb-12 max-w-2xl mx-auto leading-relaxed"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              viewport={{ once: true }}
            >
              Whether you're an author seeking to explore our universes, a publisher looking to collaborate, or a creative with a literary vision aligned with TARTARY's worlds, we'd love to hear from you.
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
