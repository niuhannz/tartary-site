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

// Featured games data
const featuredGames = [
  {
    id: 'meridian-first-contact',
    title: 'Meridian: First Contact',
    genre: 'Narrative RPG',
    description: 'A narrative RPG set in the Meridian Archives universe. Players navigate interstellar diplomacy, shaping the fate of civilizations through meaningful choices and cinematic storytelling.',
    platforms: ['PC', 'Console'],
    color: 'from-teal-900/30 to-emerald-950/30',
    accentColor: '#0d9488',
  },
  {
    id: 'jade-empire-awakening',
    title: 'Jade Empire: Awakening',
    genre: 'Action-Adventure',
    description: 'An action-adventure exploring mythological Eastern landscapes. Blend martial arts combat, mystical traditions, and epic narrative in an immersive world where every choice echoes.',
    platforms: ['PC', 'Console', 'Mobile'],
    color: 'from-green-900/30 to-lime-950/30',
    accentColor: '#16a34a',
  },
  {
    id: 'cartographer',
    title: 'Cartographer',
    genre: 'Puzzle-Exploration',
    description: 'A puzzle-exploration game where players literally draw the world into existence. Use creative cartography to reveal secrets, solve mysteries, and shape an ever-changing landscape.',
    platforms: ['PC', 'Switch'],
    color: 'from-cyan-900/30 to-teal-950/30',
    accentColor: '#06b6d4',
  },
];

// Capabilities
const capabilities = [
  {
    title: 'Narrative Design',
    description: 'Cinematic storytelling craft translated into interactive experiences. Deep character arcs, branching narratives, and player agency seamlessly woven together.',
  },
  {
    title: 'World-Building',
    description: 'Expansive, immersive universes with rich lore. Every detail serves the narrative, creating worlds players want to explore and inhabit.',
  },
  {
    title: 'Cinematic Direction',
    description: 'Award-winning directorial vision guiding visual design, pacing, and emotional beats. Games that feel like interactive films.',
  },
  {
    title: 'IP Development',
    description: 'Building franchises with transmedia potential. Worlds that extend across games, film, and other mediums.',
  },
];

export default function GamesPage() {
  return (
    <main className="bg-background text-foreground">
      {/* ──────────────────────────────────────────── PAGE HEADER ─────────────────────────────────────────── */}
      <PageHeader
        label="Games"
        title="Play the Story"
        description="Interactive entertainment that brings cinematic storytelling to life. Games designed with narrative depth, artistic vision, and immersive worlds."
      />

      {/* ──────────────────────────────────────────── VISION STATEMENT ─────────────────────────────────────────── */}
      <section className="py-24 sm:py-40 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-4xl mx-auto">
          <SectionReveal delay={0.1}>
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-light mb-8 italic text-foreground"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
              >
                "Games are the most immersive form of storytelling."
              </h2>
              <div className="separator w-12 h-0.5 bg-gold mx-auto mb-8 opacity-60" />
              <p
                className="text-lg text-mist leading-relaxed"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
              >
                At TARTARY Games, we translate our cinematic expertise into interactive experiences. We craft narrative-driven games that demand attention, invite immersion, and leave lasting impressions. Our approach merges the rigor of film production with the possibilities of interactive storytelling—creating worlds where every choice matters, every moment resonates, and players become authors of their own story.
              </p>
            </motion.div>
          </SectionReveal>
        </div>
      </section>

      {/* ──────────────────────────────────────────── FEATURED GAMES ─────────────────────────────────────────── */}
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
                Featured Games
              </h2>
              <div className="separator w-12 h-0.5 bg-gold mx-auto mb-8 opacity-60" />
              <p
                className="text-lg text-mist max-w-2xl mx-auto"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                A selection of our interactive projects across narrative-driven genres.
              </p>
            </motion.div>
          </SectionReveal>

          {/* Featured games grid */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10"
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            viewport={{ once: true }}
          >
            {featuredGames.map((game) => (
              <motion.div key={game.id} variants={itemVariants}>
                <motion.div
                  className="group relative rounded-lg overflow-hidden border-2 border-gold border-opacity-30 transition-all duration-500"
                  initial="rest"
                  whileHover="hover"
                  variants={cardHoverVariants}
                >
                  {/* Background gradient with emerald/teal tones */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-100 group-hover:opacity-100 transition-opacity duration-500`}
                  />

                  {/* Animated accent glow on hover */}
                  <motion.div
                    className="absolute -inset-1 rounded-lg opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500"
                    style={{
                      background: game.accentColor,
                    }}
                  />

                  {/* Content container */}
                  <div className="relative p-8 sm:p-10 lg:p-10 z-10 flex flex-col h-full">
                    {/* Genre badge */}
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6 }}
                      viewport={{ once: true }}
                      className="text-xs uppercase tracking-widest px-3 py-1.5 border border-gold border-opacity-50 text-gold rounded-full group-hover:border-opacity-100 group-hover:bg-gold group-hover:bg-opacity-10 transition-all duration-500 w-fit mb-6"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      {game.genre}
                    </motion.span>

                    {/* Game title */}
                    <h3
                      className="text-3xl sm:text-3xl lg:text-4xl font-light mb-4 text-foreground group-hover:text-gold-light transition-colors duration-500"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {game.title}
                    </h3>

                    {/* Description */}
                    <p
                      className="text-base sm:text-base text-mist group-hover:text-foreground transition-colors duration-500 mb-8 leading-relaxed flex-grow"
                      style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
                    >
                      {game.description}
                    </p>

                    {/* Platform badges */}
                    <div className="flex flex-wrap gap-2">
                      {game.platforms.map((platform, idx) => (
                        <motion.span
                          key={platform}
                          variants={badgeVariants}
                          initial="hidden"
                          whileInView="visible"
                          transition={{ delay: idx * 0.08 }}
                          viewport={{ once: true }}
                          className="text-xs uppercase tracking-widest px-2.5 py-1 border border-gold border-opacity-40 text-gold rounded group-hover:border-opacity-100 group-hover:text-gold-light transition-all duration-500"
                          style={{ fontFamily: 'var(--font-mono)' }}
                        >
                          {platform}
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
                What We Bring
              </h2>
              <div className="separator w-12 h-0.5 bg-gold mx-auto mb-8 opacity-60" />
              <p
                className="text-lg text-mist max-w-2xl mx-auto"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Cinematic expertise applied to interactive entertainment.
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
            {capabilities.map((capability, idx) => (
              <motion.div
                key={capability.title}
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
                    {idx === 1 && '🌍'}
                    {idx === 2 && '🎬'}
                    {idx === 3 && '⭐'}
                  </div>
                </motion.div>

                <h3
                  className="text-xl sm:text-lg font-light text-foreground mb-3 group-hover:text-gold-light transition-colors duration-500"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {capability.title}
                </h3>
                <p
                  className="text-sm sm:text-base text-mist group-hover:text-foreground transition-colors duration-500 leading-relaxed flex-grow"
                  style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
                >
                  {capability.description}
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
              Ready to Build an Interactive World?
            </motion.h2>

            <motion.p
              className="text-lg sm:text-xl text-mist mb-12 max-w-2xl mx-auto leading-relaxed"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              viewport={{ once: true }}
            >
              Let's collaborate on a game that transcends entertainment and becomes an experience worth remembering.
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
