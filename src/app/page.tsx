'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import SectionReveal from '@/components/SectionReveal';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

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
};

const heroScrollIndicator = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: 'easeOut' as const,
      delay: 1.2,
    },
  },
  animate: {
    y: [0, 8, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  },
};

const cardHoverVariants = {
  rest: {
    scale: 1,
    borderColor: 'rgba(201, 169, 110, 0.3)',
  },
  hover: {
    scale: 1.03,
    borderColor: 'rgba(201, 169, 110, 1)',
    transition: {
      duration: 0.3,
      ease: 'easeOut' as const,
    },
  },
};

const divisions = [
  {
    id: 'worlds',
    title: 'WORLDS',
    subtitle: 'Original IP & Universe Creation',
    description: 'Build universes from the ground up. Craft original intellectual properties that transcend single mediums and create immersive narrative worlds.',
    href: '/worlds',
    color: 'from-blue-900/40 to-blue-950/40',
    accentColor: '#3b82f6',
    borderAccent: 'group-hover:border-blue-500',
    bgAccent: 'group-hover:from-blue-900/60 group-hover:to-blue-950/60',
    icon: 'worlds',
  },
  {
    id: 'cinema',
    title: 'CINEMA',
    subtitle: 'Film & Cinematic Production',
    description: 'Premium film production that captures cinematic vision. From pre-production strategy to final color grade, we deliver award-winning visual narratives.',
    href: '/cinema',
    color: 'from-amber-900/40 to-amber-950/40',
    accentColor: '#b45309',
    borderAccent: 'group-hover:border-amber-600',
    bgAccent: 'group-hover:from-amber-900/60 group-hover:to-amber-950/60',
    icon: 'cinema',
  },
  {
    id: 'games',
    title: 'GAMES',
    subtitle: 'Interactive Entertainment',
    description: 'Next-generation game development. Create engaging interactive experiences that blend narrative, gameplay, and cutting-edge technology.',
    href: '/games',
    color: 'from-emerald-900/40 to-emerald-950/40',
    accentColor: '#059669',
    borderAccent: 'group-hover:border-emerald-500',
    bgAccent: 'group-hover:from-emerald-900/60 group-hover:to-emerald-950/60',
    icon: 'games',
  },
  {
    id: 'publishing',
    title: 'PUBLISHING',
    subtitle: 'Books & Print Media',
    description: 'Beautifully crafted print and digital publications. From concept to distribution, we bring stories to life across every platform.',
    href: '/publishing',
    color: 'from-violet-900/40 to-violet-950/40',
    accentColor: '#7c3aed',
    borderAccent: 'group-hover:border-violet-500',
    bgAccent: 'group-hover:from-violet-900/60 group-hover:to-violet-950/60',
    icon: 'publishing',
  },
];

const highlights = [
  {
    division: 'CINEMA',
    project: 'Echoes of Time',
    description: 'Award-winning narrative film exploring the intersection of memory and perception.',
    year: '2024',
  },
  {
    division: 'GAMES',
    project: 'Quantum Realms',
    description: 'Immersive narrative-driven gaming experience with procedural world-building.',
    year: '2024',
  },
  {
    division: 'PUBLISHING',
    project: 'The Tartary Archive',
    description: 'Limited edition collection documenting the studio\'s creative evolution.',
    year: '2024',
  },
  {
    division: 'WORLDS',
    project: 'Meridian Universe',
    description: 'Expansive transmedia IP spanning film, games, books, and interactive experiences.',
    year: '2023',
  },
];

// Icon components for divisions
const IconWorlds = () => (
  <svg className="w-16 h-16 mb-6" viewBox="0 0 100 100" fill="none" stroke="currentColor">
    <circle cx="50" cy="50" r="45" strokeWidth="1.5" opacity="0.3" />
    <circle cx="50" cy="50" r="30" strokeWidth="1.5" opacity="0.5" />
    <circle cx="50" cy="50" r="15" strokeWidth="2" opacity="0.8" />
    <path d="M 50 5 Q 75 25 75 50 Q 75 75 50 95 Q 25 75 25 50 Q 25 25 50 5" strokeWidth="1" opacity="0.3" />
  </svg>
);

const IconCinema = () => (
  <svg className="w-16 h-16 mb-6" viewBox="0 0 100 100" fill="none" stroke="currentColor">
    <rect x="15" y="25" width="70" height="50" strokeWidth="2" />
    <line x1="15" y1="35" x2="85" y2="35" strokeWidth="1" opacity="0.4" />
    <line x1="15" y1="65" x2="85" y2="65" strokeWidth="1" opacity="0.4" />
    <circle cx="30" cy="50" r="4" fill="currentColor" opacity="0.6" />
    <circle cx="50" cy="50" r="4" fill="currentColor" opacity="0.6" />
    <circle cx="70" cy="50" r="4" fill="currentColor" opacity="0.6" />
  </svg>
);

const IconGames = () => (
  <svg className="w-16 h-16 mb-6" viewBox="0 0 100 100" fill="none" stroke="currentColor">
    <rect x="20" y="30" width="60" height="40" rx="4" strokeWidth="2" />
    <circle cx="35" cy="50" r="4" fill="currentColor" opacity="0.7" />
    <circle cx="65" cy="45" r="3.5" fill="currentColor" opacity="0.5" />
    <circle cx="65" cy="55" r="3.5" fill="currentColor" opacity="0.5" />
    <rect x="45" y="70" width="10" height="6" strokeWidth="1.5" opacity="0.6" />
  </svg>
);

const IconPublishing = () => (
  <svg className="w-16 h-16 mb-6" viewBox="0 0 100 100" fill="none" stroke="currentColor">
    <path d="M 25 20 L 25 80 Q 25 85 30 85 L 75 85 Q 80 85 80 80 L 80 20" strokeWidth="2" />
    <line x1="35" y1="25" x2="70" y2="25" strokeWidth="1" opacity="0.4" />
    <line x1="35" y1="35" x2="70" y2="35" strokeWidth="1" opacity="0.4" />
    <line x1="35" y1="45" x2="70" y2="45" strokeWidth="1" opacity="0.4" />
    <line x1="35" y1="55" x2="70" y2="55" strokeWidth="1" opacity="0.4" />
    <line x1="35" y1="65" x2="70" y2="65" strokeWidth="1" opacity="0.4" />
  </svg>
);

const getIcon = (iconType: string) => {
  switch (iconType) {
    case 'worlds':
      return <IconWorlds />;
    case 'cinema':
      return <IconCinema />;
    case 'games':
      return <IconGames />;
    case 'publishing':
      return <IconPublishing />;
    default:
      return null;
  }
};

export default function Home() {
  return (
    <main className="bg-background text-foreground">
      {/* ──────────────────────────────────────────── HERO SECTION ─────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-carbon to-background opacity-70" />

        {/* Radial gold glow */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at center, rgba(201, 169, 110, 0.08) 0%, transparent 65%)',
          }}
          animate={{
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut' as const,
          }}
        />

        {/* Subtle animated accent circle */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(201, 169, 110, 0.03) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut' as const,
          }}
        />

        {/* Grain texture */}
        <div className="grain absolute inset-0" />

        {/* Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* Tagline */}
            <motion.p
              variants={itemVariants}
              className="text-sm sm:text-base tracking-widest uppercase mb-8 text-gold"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              Creative Storytelling Across Four Dimensions
            </motion.p>

            {/* Main heading */}
            <motion.h1
              variants={itemVariants}
              className="text-6xl sm:text-7xl lg:text-8xl font-bold leading-tight mb-8 text-foreground"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              We Build Worlds
            </motion.h1>

            {/* Subheading */}
            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-mist leading-relaxed max-w-3xl mx-auto mb-10"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Original universes. Cinematic stories. Interactive experiences. Beautifully crafted media. TARTARY operates across four divisions to bring visionary projects to life.
            </motion.p>

            {/* CTA Button */}
            <motion.div variants={itemVariants}>
              <Link
                href="#divisions"
                className="inline-block px-8 py-4 border-2 border-gold text-gold hover:bg-gold hover:text-carbon transition-all duration-300 font-light tracking-wider text-lg"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Explore Our Work
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-10"
          variants={heroScrollIndicator}
          initial="hidden"
          animate={['visible', 'animate']}
        >
          <div className="flex flex-col items-center gap-3">
            <p className="text-xs tracking-widest uppercase text-ash" style={{ fontFamily: 'var(--font-mono)' }}>
              Scroll to Explore
            </p>
            <svg
              width="24"
              height="36"
              viewBox="0 0 24 36"
              fill="none"
              stroke="currentColor"
              className="text-gold"
              strokeWidth="1.5"
            >
              <path d="M12 2 L12 26 M6 20 L12 28 L18 20" />
            </svg>
          </div>
        </motion.div>
      </section>

      {/* ──────────────────────────────────────────── FOUR DIVISIONS GRID ─────────────────────────────────────────── */}
      <section id="divisions" className="py-24 sm:py-40 px-4 sm:px-6 lg:px-8 bg-carbon">
        <div className="max-w-7xl mx-auto">
          {/* Section intro */}
          <SectionReveal delay={0.1}>
            <motion.div
              className="mb-20 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2
                className="text-4xl sm:text-5xl lg:text-6xl font-light mb-6 text-foreground"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Four Divisions of Excellence
              </h2>
              <div className="separator w-16 h-0.5 bg-gold mx-auto mb-8 opacity-60" />
              <p
                className="text-lg text-mist max-w-2xl mx-auto"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Each division operates as its own creative powerhouse, unified by a singular vision: transformative storytelling across every medium.
              </p>
            </motion.div>
          </SectionReveal>

          {/* 2x2 Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            viewport={{ once: true }}
          >
            {divisions.map((division) => (
              <motion.div
                key={division.id}
                variants={itemVariants}
              >
                <Link href={division.href}>
                  <motion.div
                    className={`group relative h-96 rounded-lg overflow-hidden border-2 border-gold border-opacity-30 transition-all duration-500 cursor-pointer ${division.bgAccent}`}
                    initial="rest"
                    whileHover="hover"
                    variants={cardHoverVariants}
                  >
                    {/* Background gradient with division tint */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${division.color} opacity-100 group-hover:opacity-100 transition-opacity duration-500`}
                    />

                    {/* Animated accent glow on hover */}
                    <motion.div
                      className="absolute -inset-1 rounded-lg opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500"
                      style={{
                        background: division.accentColor,
                      }}
                    />

                    {/* Content container */}
                    <div className="relative h-full flex flex-col justify-between p-8 lg:p-10 z-10">
                      {/* Icon */}
                      <motion.div
                        className="text-gold opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                          color: division.accentColor,
                        }}
                        animate={{
                          y: [0, -4, 0],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: 'easeInOut' as const,
                        }}
                      >
                        {getIcon(division.icon)}
                      </motion.div>

                      {/* Text content */}
                      <div>
                        {/* Title */}
                        <h3
                          className="text-3xl sm:text-4xl font-bold mb-3 text-foreground group-hover:text-gold-light transition-colors duration-500"
                          style={{ fontFamily: 'var(--font-heading)' }}
                        >
                          {division.title}
                        </h3>

                        {/* Subtitle */}
                        <p
                          className="text-sm uppercase tracking-widest text-ash group-hover:text-mist transition-colors duration-500 mb-6"
                          style={{ fontFamily: 'var(--font-mono)' }}
                        >
                          {division.subtitle}
                        </p>

                        {/* Description */}
                        <p
                          className="text-sm sm:text-base text-mist group-hover:text-foreground transition-colors duration-500 mb-8 line-clamp-3"
                          style={{ fontFamily: 'var(--font-display)' }}
                        >
                          {division.description}
                        </p>

                        {/* Explore link */}
                        <motion.div
                          className="flex items-center gap-2 text-gold group-hover:text-gold-light transition-colors duration-500"
                          initial={{ x: 0 }}
                          whileHover={{ x: 4 }}
                          transition={{ duration: 0.3 }}
                        >
                          <span
                            className="text-sm font-light tracking-wide"
                            style={{ fontFamily: 'var(--font-display)' }}
                          >
                            Explore
                          </span>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </svg>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ──────────────────────────────────────────── STUDIO STATEMENT ─────────────────────────────────────────── */}
      <section className="py-24 sm:py-40 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-5xl mx-auto">
          <SectionReveal delay={0.1}>
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
              viewport={{ once: true }}
            >
              {/* Statement quote */}
              <motion.h2
                className="text-4xl sm:text-5xl lg:text-6xl leading-tight mb-10 text-gold-light"
                style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 300 }}
              >
                One studio. Four dimensions of storytelling.
              </motion.h2>

              {/* Separator */}
              <div className="separator w-12 h-0.5 bg-gold mx-auto mb-10 opacity-60" />

              {/* Description */}
              <motion.p
                className="text-lg sm:text-xl text-mist leading-relaxed mb-8 max-w-3xl mx-auto"
                style={{ fontFamily: 'var(--font-display)' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                TARTARY is built on the principle that great stories transcend single mediums. Our four divisions work in concert to create unified creative visions that span original intellectual properties, cinematic productions, interactive experiences, and beautifully crafted publications. Based in California and Tennessee, we collaborate with visionary creators and forward-thinking brands to bring impossible ideas to life.
              </motion.p>
            </motion.div>
          </SectionReveal>
        </div>
      </section>

      {/* ──────────────────────────────────────────── RECENT HIGHLIGHTS ─────────────────────────────────────────── */}
      <section className="py-24 sm:py-40 px-4 sm:px-6 lg:px-8 bg-charcoal">
        <div className="max-w-7xl mx-auto">
          <SectionReveal delay={0.1}>
            <motion.div
              className="mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2
                className="text-4xl sm:text-5xl font-light mb-4 text-foreground"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Recent Highlights
              </h2>
              <div className="separator w-12 h-0.5 bg-gold opacity-60" />
            </motion.div>
          </SectionReveal>

          {/* Highlights scroll container */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            viewport={{ once: true }}
          >
            {highlights.map((highlight, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative p-6 sm:p-8 border border-gold border-opacity-30 hover:border-opacity-100 transition-all duration-500 rounded-lg hover:bg-gold hover:bg-opacity-5"
              >
                {/* Division label */}
                <p
                  className="text-xs uppercase tracking-widest text-gold mb-4 group-hover:text-gold-light transition-colors duration-500"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {highlight.division}
                </p>

                {/* Project name */}
                <h3
                  className="text-xl sm:text-2xl font-light text-foreground mb-3 group-hover:text-gold-light transition-colors duration-500"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {highlight.project}
                </h3>

                {/* Description */}
                <p
                  className="text-sm text-mist mb-4 group-hover:text-foreground transition-colors duration-500 line-clamp-2"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {highlight.description}
                </p>

                {/* Year */}
                <p
                  className="text-xs text-ash group-hover:text-mist transition-colors duration-500"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {highlight.year}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ──────────────────────────────────────────── FINAL CTA SECTION ─────────────────────────────────────────── */}
      <section className="py-32 sm:py-48 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-carbon relative overflow-hidden">
        {/* Animated background accent */}
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(circle at center, rgba(201, 169, 110, 0.05) 0%, transparent 70%)',
          }}
          animate={{
            opacity: [0.2, 0.4, 0.2],
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
              Enter the World of Tartary
            </motion.h2>

            <motion.p
              className="text-lg sm:text-xl text-mist mb-12 max-w-2xl mx-auto"
              style={{ fontFamily: 'var(--font-display)' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              viewport={{ once: true }}
            >
              Whether you're ready to collaborate on an ambitious project or explore what's possible at the intersection of cinema, games, publishing, and original IP — let's talk.
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
                Explore Our Divisions
              </Link>
            </motion.div>
          </SectionReveal>
        </div>
      </section>
    </main>
  );
}
