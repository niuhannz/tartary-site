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

// Featured systems data
const featuredSystems = [
  {
    id: 'mudflood',
    title: 'MUDFLOOD',
    category: 'AI Plugin',
    description:
      'An AI-powered plugin for Unreal Engine that accelerates world-building, procedural generation, and cinematic storytelling workflows. MUDFLOOD brings intelligent automation to every phase of production — from terrain sculpting to NPC behavior design.',
    platforms: ['Unreal Engine 5', 'Windows', 'macOS'],
    color: 'from-amber-900/30 to-orange-950/30',
    accentColor: '#d97706',
    featured: true,
  },
  {
    id: 'atlas-pipeline',
    title: 'Atlas Pipeline',
    category: 'Asset Management',
    description:
      'An internal asset pipeline that streamlines content delivery across film, game, and publishing workflows. Version control, dependency tracking, and cross-platform format conversion built for creative studios.',
    platforms: ['Cross-Platform', 'Cloud'],
    color: 'from-slate-900/30 to-zinc-950/30',
    accentColor: '#94a3b8',
    featured: false,
  },
  {
    id: 'lore-engine',
    title: 'Lore Engine',
    category: 'Narrative Tools',
    description:
      'A structured narrative design system for maintaining consistency across transmedia universes. Character relationships, timeline management, and world-state tracking for properties that span multiple mediums.',
    platforms: ['Web', 'API'],
    color: 'from-violet-900/30 to-purple-950/30',
    accentColor: '#8b5cf6',
    featured: false,
  },
];

// Capabilities
const capabilities = [
  {
    title: 'AI-Driven Workflows',
    description:
      'Machine learning models trained on cinematic production data. Intelligent automation that understands creative intent, not just technical parameters.',
  },
  {
    title: 'Engine Integration',
    description:
      'Deep integration with Unreal Engine, custom render pipelines, and industry-standard DCC tools. Built for real production environments.',
  },
  {
    title: 'Procedural Generation',
    description:
      'Algorithmic world-building that produces coherent, art-directable results. From terrain to architecture to vegetation — generated with narrative purpose.',
  },
  {
    title: 'Open Architecture',
    description:
      'Modular plugin systems designed for extensibility. API-first development that integrates with existing studio pipelines and third-party tools.',
  },
];

export default function SystemsPage() {
  return (
    <main className="bg-background text-foreground">
      {/* ──────────────────────────────────────────── PAGE HEADER ─────────────────────────────────────────── */}
      <PageHeader
        label="Systems"
        title="Build the Machine"
        description="Software tools and AI systems designed to amplify creative production. Engines, plugins, and pipelines built by storytellers for storytellers."
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
                &ldquo;The best tools disappear — leaving only the work.&rdquo;
              </h2>
              <div className="separator w-12 h-0.5 bg-gold mx-auto mb-8 opacity-60" />
              <p
                className="text-lg text-mist leading-relaxed"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
              >
                TARTARY Systems is the engineering arm of the studio. We build the software
                that powers our own productions — and then we share it. Every tool we create
                emerges from real production needs: the friction of world-building at scale,
                the complexity of managing transmedia narratives, the gap between creative
                vision and technical execution. Our systems are opinionated, battle-tested,
                and designed for studios that refuse to compromise.
              </p>
            </motion.div>
          </SectionReveal>
        </div>
      </section>

      {/* ──────────────────────────────────────────── HERO: MUDFLOOD ─────────────────────────────────────────── */}
      <section className="py-24 sm:py-40 px-4 sm:px-6 lg:px-8 bg-charcoal relative overflow-hidden">
        {/* Subtle animated gradient background */}
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 30% 50%, rgba(217, 119, 6, 0.06) 0%, transparent 60%), radial-gradient(ellipse at 70% 60%, rgba(201, 169, 110, 0.04) 0%, transparent 50%)',
          }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative z-10 max-w-7xl mx-auto">
          <SectionReveal delay={0.1}>
            <motion.div
              className="mb-16 sm:mb-20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              {/* MUDFLOOD badge */}
              <motion.div
                className="flex items-center gap-3 mb-8"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span
                  className="text-xs uppercase tracking-[0.2em] text-amber-400"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  Now in Development
                </span>
              </motion.div>

              <h2
                className="text-5xl sm:text-6xl lg:text-8xl font-light mb-6 text-foreground"
                style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}
              >
                MUDFLOOD
              </h2>
              <p
                className="text-xl sm:text-2xl text-mist mb-4 max-w-3xl"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
              >
                AI-Powered World-Building for Unreal Engine
              </p>
              <div className="separator w-16 h-0.5 bg-amber-500 mb-8 opacity-80" />
              <p
                className="text-lg text-mist max-w-2xl leading-relaxed"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
              >
                MUDFLOOD is an AI plugin that brings intelligent automation to Unreal Engine.
                Procedural terrain generation, AI-driven NPC behavior systems, cinematic
                camera automation, and narrative-aware environment design — all guided by
                machine learning models trained on production data from our own cinematic
                universes.
              </p>
            </motion.div>
          </SectionReveal>

          {/* MUDFLOOD feature grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            viewport={{ once: true }}
          >
            {[
              {
                icon: '⛰',
                title: 'Terrain Intelligence',
                desc: 'AI-sculpted landscapes that respond to narrative context. Describe a biome, a mood, a story beat — MUDFLOOD generates terrain that serves the narrative.',
              },
              {
                icon: '🧠',
                title: 'NPC Behavior Design',
                desc: 'Behavioral AI systems that create believable, context-aware NPCs. Characters that react, remember, and evolve based on player interaction and world state.',
              },
              {
                icon: '🎥',
                title: 'Cinematic Automation',
                desc: 'Camera systems informed by decades of film language. Dynamic shot composition, intelligent cutting, and mood-responsive lighting — automated but art-directed.',
              },
              {
                icon: '🏛',
                title: 'Architecture Generation',
                desc: 'Procedural structures with historical and cultural coherence. From ancient citadels to speculative megastructures — generated with architectural logic.',
              },
              {
                icon: '🌿',
                title: 'Biome Ecosystems',
                desc: 'Interconnected vegetation, weather, and wildlife systems. Environments that feel alive because they simulate actual ecological relationships.',
              },
              {
                icon: '⚡',
                title: 'Real-Time Iteration',
                desc: 'Generate, evaluate, and refine in real-time within the Unreal Editor. No export pipelines, no waiting — immediate creative feedback loops.',
              },
            ].map((feature, idx) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="group p-8 border border-amber-500/20 rounded-lg hover:border-amber-500/60 hover:bg-amber-500/5 transition-all duration-500"
              >
                <div className="text-2xl mb-4">{feature.icon}</div>
                <h4
                  className="text-lg font-light text-foreground mb-3 group-hover:text-amber-300 transition-colors duration-500"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {feature.title}
                </h4>
                <p
                  className="text-sm text-mist group-hover:text-foreground transition-colors duration-500 leading-relaxed"
                  style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
                >
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Platform badges */}
          <motion.div
            className="flex flex-wrap gap-3 mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            {['Unreal Engine 5', 'Windows', 'macOS', 'AI/ML', 'C++', 'Blueprints'].map(
              (tag, idx) => (
                <motion.span
                  key={tag}
                  variants={badgeVariants}
                  initial="hidden"
                  whileInView="visible"
                  transition={{ delay: idx * 0.06 }}
                  viewport={{ once: true }}
                  className="text-xs uppercase tracking-widest px-3 py-1.5 border border-amber-500/40 text-amber-400 rounded hover:border-amber-500/80 hover:bg-amber-500/10 transition-all duration-500"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {tag}
                </motion.span>
              )
            )}
          </motion.div>
        </div>
      </section>

      {/* ──────────────────────────────────────────── MORE SYSTEMS ─────────────────────────────────────────── */}
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
                Studio Systems
              </h2>
              <div className="separator w-12 h-0.5 bg-gold mx-auto mb-8 opacity-60" />
              <p
                className="text-lg text-mist max-w-2xl mx-auto"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Internal tools refined through production and offered to the creative community.
              </p>
            </motion.div>
          </SectionReveal>

          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10"
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            viewport={{ once: true }}
          >
            {featuredSystems
              .filter((s) => !s.featured)
              .map((system) => (
                <motion.div key={system.id} variants={itemVariants}>
                  <motion.div
                    className="group relative rounded-lg overflow-hidden border-2 border-gold border-opacity-30 transition-all duration-500"
                    initial="rest"
                    whileHover="hover"
                    variants={cardHoverVariants}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${system.color} opacity-100`}
                    />
                    <motion.div
                      className="absolute -inset-1 rounded-lg opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500"
                      style={{ background: system.accentColor }}
                    />

                    <div className="relative p-8 sm:p-10 z-10 flex flex-col h-full">
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-xs uppercase tracking-widest px-3 py-1.5 border border-gold border-opacity-50 text-gold rounded-full group-hover:border-opacity-100 group-hover:bg-gold group-hover:bg-opacity-10 transition-all duration-500 w-fit mb-6"
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        {system.category}
                      </motion.span>

                      <h3
                        className="text-3xl sm:text-3xl lg:text-4xl font-light mb-4 text-foreground group-hover:text-gold-light transition-colors duration-500"
                        style={{ fontFamily: 'var(--font-heading)' }}
                      >
                        {system.title}
                      </h3>

                      <p
                        className="text-base text-mist group-hover:text-foreground transition-colors duration-500 mb-8 leading-relaxed flex-grow"
                        style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
                      >
                        {system.description}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {system.platforms.map((platform, idx) => (
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
                Engineering Philosophy
              </h2>
              <div className="separator w-12 h-0.5 bg-gold mx-auto mb-8 opacity-60" />
              <p
                className="text-lg text-mist max-w-2xl mx-auto"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Software built with the same creative rigor we bring to storytelling.
              </p>
            </motion.div>
          </SectionReveal>

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
                <motion.div
                  className="w-12 h-12 rounded-lg border border-gold border-opacity-40 flex items-center justify-center mb-6 group-hover:border-opacity-100 group-hover:bg-gold group-hover:bg-opacity-10 transition-all duration-500"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-lg text-gold group-hover:text-gold-light transition-colors duration-500">
                    {idx === 0 && '🤖'}
                    {idx === 1 && '🔧'}
                    {idx === 2 && '🌐'}
                    {idx === 3 && '📐'}
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
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              'radial-gradient(circle at center, rgba(201, 169, 110, 0.05) 0%, transparent 70%)',
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
              Interested in MUDFLOOD?
            </motion.h2>

            <motion.p
              className="text-lg sm:text-xl text-mist mb-12 max-w-2xl mx-auto leading-relaxed"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              viewport={{ once: true }}
            >
              We&apos;re building tools for the next generation of cinematic creators. Get in touch to learn more or join the early access program.
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
                Request Early Access
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
