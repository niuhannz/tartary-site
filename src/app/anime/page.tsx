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

// Featured anime projects
const featuredProjects = [
  {
    id: 'iron-throne-of-valdria',
    title: 'The Iron Throne of Valdria',
    type: 'Series',
    format: '2D Traditional',
    status: 'In Development',
    logline: 'An epic fantasy saga set in the Baseborn universe — political intrigue, ancient bloodlines, and war across the Realm.',
    tags: ['Fantasy', 'Drama', 'Baseborn IP'],
    color: 'from-rose-900/30 to-red-950/30',
    accentColor: '#e11d48',
  },
  {
    id: 'silk-and-steel',
    title: 'Silk & Steel',
    type: 'Feature Film',
    format: 'Mixed Media',
    status: 'Pre-Production',
    logline: 'A visually stunning anime feature blending traditional hand-drawn animation with CG environments — set along the ancient Silk Road.',
    tags: ['Action', 'Historical', 'Original'],
    color: 'from-amber-900/30 to-yellow-950/30',
    accentColor: '#d97706',
  },
  {
    id: 'echo-protocol',
    title: 'Echo Protocol',
    type: 'Series',
    format: '3D / CG',
    status: 'Concept',
    logline: 'In a near-future Tokyo, a rogue AI begins dreaming — and its dreams start bleeding into reality.',
    tags: ['Sci-Fi', 'Thriller', 'Original'],
    color: 'from-cyan-900/30 to-teal-950/30',
    accentColor: '#06b6d4',
  },
  {
    id: 'the-cartographer',
    title: 'The Cartographer',
    type: 'OVA',
    format: '2D Traditional',
    status: 'In Development',
    logline: 'A surrealist adventure where a mapmaker discovers that the maps she draws reshape the world itself.',
    tags: ['Fantasy', 'Surreal', 'Transmedia'],
    color: 'from-violet-900/30 to-purple-950/30',
    accentColor: '#8b5cf6',
  },
];

// Capabilities
const capabilities = [
  {
    title: 'Original Series',
    description: 'Multi-episode animated series developed from our original IP library and new concepts.',
  },
  {
    title: 'Feature Films',
    description: 'Theatrical-quality anime features with cinematic storytelling and world-class production.',
  },
  {
    title: 'Transmedia Adaptations',
    description: 'Adapting our Worlds, Games, and Publishing IPs into anime — the ultimate crossover medium.',
  },
  {
    title: 'Co-Productions',
    description: 'International co-production partnerships with studios across Japan, Korea, and beyond.',
  },
];

// Studio philosophy points
const philosophy = [
  {
    label: 'Vision',
    title: 'Cinematic First',
    description: 'Every frame treated as cinema. We bring the same directorial sensibility from our film division to animation.',
  },
  {
    label: 'Craft',
    title: 'Artist-Driven',
    description: 'Working with world-class animators who bring distinct visual identities to each project.',
  },
  {
    label: 'Story',
    title: 'World-Connected',
    description: 'Our anime projects draw from and feed back into the larger Tartary universe of interconnected IPs.',
  },
];

export default function AnimePage() {
  return (
    <main className="bg-background text-foreground">
      {/* ──────────────────────────────────────────── PAGE HEADER ─────────────────────────────────────────── */}
      <PageHeader
        label="Anime"
        title="Animation Without Boundaries"
        description="A new dimension of storytelling. Tartary's anime division brings our worlds to life through hand-drawn, CG, and mixed-media animation — bridging Eastern craft with Western narrative ambition."
      />

      {/* ──────────────────────────────────────────── PHILOSOPHY ─────────────────────────────────────────── */}
      <section className="py-24 sm:py-40 px-4 sm:px-6 lg:px-8 bg-background">
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
                Our Approach
              </h2>
              <div className="separator w-12 h-0.5 bg-gold mx-auto mb-8 opacity-60" />
              <p
                className="text-lg text-mist max-w-2xl mx-auto leading-relaxed"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Anime is the most versatile visual storytelling medium on the planet. We're building a division
                that treats it with the reverence it deserves.
              </p>
            </motion.div>
          </SectionReveal>

          {/* Philosophy cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            viewport={{ once: true }}
          >
            {philosophy.map((item) => (
              <motion.div
                key={item.label}
                variants={itemVariants}
                className="group relative p-8 sm:p-10 border border-gold border-opacity-30 rounded-lg hover:border-opacity-100 hover:bg-gold hover:bg-opacity-5 transition-all duration-500"
              >
                <span
                  className="text-xs uppercase tracking-widest text-gold mb-4 block"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {item.label}
                </span>
                <h3
                  className="text-2xl sm:text-3xl font-light text-foreground mb-4 group-hover:text-gold-light transition-colors duration-500"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-base text-mist group-hover:text-foreground transition-colors duration-500 leading-relaxed"
                  style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
                >
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ──────────────────────────────────────────── FEATURED PROJECTS ─────────────────────────────────────────── */}
      <section className="py-24 sm:py-40 px-4 sm:px-6 lg:px-8 bg-charcoal">
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
                In Development
              </h2>
              <div className="separator w-12 h-0.5 bg-gold mx-auto mb-8 opacity-60" />
              <p
                className="text-lg text-mist max-w-2xl mx-auto"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Our current slate of anime projects — original stories and transmedia adaptations from the Tartary universe.
              </p>
            </motion.div>
          </SectionReveal>

          {/* Projects grid */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10"
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            viewport={{ once: true }}
          >
            {featuredProjects.map((project) => (
              <motion.div key={project.id} variants={itemVariants}>
                <motion.div
                  className="group relative rounded-lg overflow-hidden border-2 border-gold border-opacity-30 transition-all duration-500"
                  initial="rest"
                  whileHover="hover"
                  variants={cardHoverVariants}
                >
                  {/* Background gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-100 transition-opacity duration-500`}
                  />

                  {/* Accent glow on hover */}
                  <motion.div
                    className="absolute -inset-1 rounded-lg opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500"
                    style={{ background: project.accentColor }}
                  />

                  {/* Content */}
                  <div className="relative p-8 sm:p-10 lg:p-12 z-10">
                    {/* Type and format header */}
                    <div className="flex items-baseline justify-between mb-6 gap-4">
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-sm uppercase tracking-widest text-gold font-light"
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        {project.type}
                      </motion.span>
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.05 }}
                        viewport={{ once: true }}
                        className="text-xs uppercase tracking-widest px-3 py-1.5 border border-gold border-opacity-50 text-gold rounded-full group-hover:border-opacity-100 group-hover:bg-gold group-hover:bg-opacity-10 transition-all duration-500"
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        {project.format}
                      </motion.span>
                    </div>

                    {/* Title */}
                    <h3
                      className="text-3xl sm:text-4xl lg:text-5xl font-light mb-4 text-foreground group-hover:text-gold-light transition-colors duration-500"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {project.title}
                    </h3>

                    {/* Status */}
                    <p
                      className="text-xs uppercase tracking-widest text-ash group-hover:text-gold transition-colors duration-500 mb-6"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      {project.status}
                    </p>

                    {/* Logline */}
                    <p
                      className="text-base sm:text-lg text-mist group-hover:text-foreground transition-colors duration-500 mb-8 leading-relaxed"
                      style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
                    >
                      {project.logline}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, idx) => (
                        <motion.span
                          key={tag}
                          variants={badgeVariants}
                          initial="hidden"
                          whileInView="visible"
                          transition={{ delay: idx * 0.08 }}
                          viewport={{ once: true }}
                          className="text-xs uppercase tracking-widest px-2.5 py-1 border border-gold border-opacity-40 text-gold rounded group-hover:border-opacity-100 group-hover:text-gold-light transition-all duration-500"
                          style={{ fontFamily: 'var(--font-mono)' }}
                        >
                          {tag}
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

      {/* ──────────────────────────────────────────── CAPABILITIES ─────────────────────────────────────────── */}
      <section className="py-24 sm:py-40 px-4 sm:px-6 lg:px-8 bg-carbon">
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
                What We Create
              </h2>
              <div className="separator w-12 h-0.5 bg-gold mx-auto mb-8 opacity-60" />
              <p
                className="text-lg text-mist max-w-2xl mx-auto"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                From original series to transmedia adaptations and international co-productions.
              </p>
            </motion.div>
          </SectionReveal>

          {/* Capabilities grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            viewport={{ once: true }}
          >
            {capabilities.map((cap) => (
              <motion.div
                key={cap.title}
                variants={itemVariants}
                className="group p-8 sm:p-6 border border-gold border-opacity-30 rounded-lg hover:border-opacity-100 hover:bg-gold hover:bg-opacity-5 transition-all duration-500 flex flex-col"
              >
                <h3
                  className="text-xl sm:text-lg font-light text-foreground mb-3 group-hover:text-gold-light transition-colors duration-500"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {cap.title}
                </h3>
                <p
                  className="text-sm sm:text-base text-mist group-hover:text-foreground transition-colors duration-500 leading-relaxed flex-grow"
                  style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
                >
                  {cap.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ──────────────────────────────────────────── CTA ─────────────────────────────────────────── */}
      <section className="py-32 sm:py-48 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-charcoal to-carbon relative overflow-hidden">
        {/* Background pulse */}
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background: 'radial-gradient(circle at center, rgba(201, 169, 110, 0.05) 0%, transparent 70%)',
          }}
          animate={{ opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' as const }}
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
              Let's Build Something Animated
            </motion.h2>

            <motion.p
              className="text-lg sm:text-xl text-mist mb-12 max-w-2xl mx-auto leading-relaxed"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              viewport={{ once: true }}
            >
              Whether you have an original anime concept, an IP to adapt, or a co-production opportunity — we're ready to bring it to life.
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
                href="/worlds"
                className="px-10 py-4 border-2 border-gold border-opacity-40 text-gold hover:border-opacity-100 hover:bg-gold hover:bg-opacity-5 transition-all duration-300 font-light tracking-wider text-lg rounded"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Explore Our Worlds
              </Link>
            </motion.div>
          </SectionReveal>
        </div>
      </section>
    </main>
  );
}
