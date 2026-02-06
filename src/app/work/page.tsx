'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageHeader from '@/components/PageHeader';
import SectionReveal from '@/components/SectionReveal';

type Category = 'All' | 'Feature Films' | 'Short Films' | 'Documentaries' | 'Commercial';

interface Project {
  id: number;
  title: string;
  year: number;
  category: Exclude<Category, 'All'>;
  role: 'Director' | 'Producer' | 'Consultant';
  gradient: string;
  aspectRatio: 'tall' | 'wide' | 'square';
}

const projects: Project[] = [
  {
    id: 1,
    title: 'The Weight of Water',
    year: 2023,
    category: 'Feature Films',
    role: 'Director',
    gradient: 'from-blue-900 via-slate-900 to-black',
    aspectRatio: 'tall',
  },
  {
    id: 2,
    title: 'Silk Roads',
    year: 2022,
    category: 'Documentaries',
    role: 'Producer',
    gradient: 'from-amber-900 via-yellow-900 to-black',
    aspectRatio: 'wide',
  },
  {
    id: 3,
    title: 'Between Tides',
    year: 2021,
    category: 'Short Films',
    role: 'Director',
    gradient: 'from-teal-900 via-slate-800 to-black',
    aspectRatio: 'square',
  },
  {
    id: 4,
    title: 'Neon Dynasty',
    year: 2023,
    category: 'Feature Films',
    role: 'Producer',
    gradient: 'from-purple-900 via-pink-900 to-black',
    aspectRatio: 'tall',
  },
  {
    id: 5,
    title: 'Fragments of Light',
    year: 2020,
    category: 'Documentaries',
    role: 'Director',
    gradient: 'from-orange-900 via-red-900 to-black',
    aspectRatio: 'wide',
  },
  {
    id: 6,
    title: 'The Last Cartographer',
    year: 2022,
    category: 'Feature Films',
    role: 'Consultant',
    gradient: 'from-green-900 via-emerald-900 to-black',
    aspectRatio: 'square',
  },
  {
    id: 7,
    title: 'Meridian',
    year: 2024,
    category: 'Short Films',
    role: 'Director',
    gradient: 'from-indigo-900 via-blue-900 to-black',
    aspectRatio: 'tall',
  },
  {
    id: 8,
    title: 'Empire of Dust',
    year: 2024,
    category: 'Feature Films',
    role: 'Producer',
    gradient: 'from-rose-900 via-orange-900 to-black',
    aspectRatio: 'wide',
  },
];

const categories: Category[] = ['All', 'Feature Films', 'Short Films', 'Documentaries', 'Commercial'];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function Work() {
  const [activeFilter, setActiveFilter] = useState<Category>('All');

  const filteredProjects =
    activeFilter === 'All'
      ? projects
      : projects.filter((project) => project.category === activeFilter);

  const getAspectRatioClass = (ratio: string): string => {
    switch (ratio) {
      case 'tall':
        return 'md:col-span-1 md:row-span-2';
      case 'wide':
        return 'md:col-span-2 md:row-span-1';
      case 'square':
        return 'md:col-span-1 md:row-span-1';
      default:
        return 'md:col-span-1 md:row-span-1';
    }
  };

  const getImageHeight = (ratio: string): string => {
    switch (ratio) {
      case 'tall':
        return 'h-96 md:h-full';
      case 'wide':
        return 'h-64 md:h-80';
      case 'square':
        return 'h-64 md:h-80';
      default:
        return 'h-64';
    }
  };

  return (
    <main className="min-h-screen bg-carbon">
      {/* Page Header */}
      <PageHeader
        label="Selected Work"
        title="A Body of Work"
        description="A curated selection of TARTARY's cinematic projects spanning feature films, documentaries, and short-form content. Each project represents our commitment to storytelling excellence and visual innovation."
      />

      {/* Filter Bar */}
      <section className="py-12 md:py-16 px-6 md:px-10 bg-charcoal border-b border-gold border-opacity-20">
        <div className="max-w-[1400px] mx-auto">
          <SectionReveal>
            <div className="flex flex-wrap gap-4 md:gap-8">
              {categories.map((category, index) => (
                <motion.button
                  key={category}
                  onClick={() => setActiveFilter(category)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className={`text-sm md:text-base tracking-[0.15em] uppercase transition-all duration-300 relative pb-2 ${
                    activeFilter === category
                      ? 'text-gold'
                      : 'text-mist hover:text-foreground'
                  }`}
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {category}
                  {activeFilter === category && (
                    <motion.div
                      layoutId="underline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Project Grid */}
      <section className="py-24 md:py-32 px-6 md:px-10 bg-carbon">
        <div className="max-w-[1400px] mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="grid grid-cols-1 md:grid-cols-3 auto-rows-max gap-4 md:gap-6"
            >
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  variants={itemVariants}
                  className={`group cursor-pointer overflow-hidden ${getAspectRatioClass(
                    project.aspectRatio
                  )}`}
                >
                  <div
                    className={`relative ${getImageHeight(project.aspectRatio)} bg-gradient-to-br ${project.gradient} rounded-sm overflow-hidden`}
                  >
                    {/* Background Gradient */}
                    <div className="absolute inset-0 opacity-60" />

                    {/* Content */}
                    <div className="relative h-full flex flex-col justify-between p-6 md:p-8 z-10">
                      {/* Top Content */}
                      <div>
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.6, delay: 0.1 }}
                          className="text-xs tracking-[0.2em] uppercase text-gold-light mb-3"
                          style={{ fontFamily: 'var(--font-mono)' }}
                        >
                          {project.year} · {project.category}
                        </motion.p>

                        <motion.h3
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.15 }}
                          className="text-2xl md:text-3xl leading-tight text-foreground mb-3"
                          style={{ fontFamily: 'var(--font-heading)' }}
                        >
                          {project.title}
                        </motion.h3>
                      </div>

                      {/* Bottom Content */}
                      <div className="flex items-center justify-between">
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.6, delay: 0.2 }}
                          className="text-sm text-gold-light tracking-wide"
                          style={{ fontFamily: 'var(--font-mono)' }}
                        >
                          {project.role}
                        </motion.p>
                      </div>
                    </div>

                    {/* Hover Overlay */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center z-20"
                    >
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        whileHover={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="text-center"
                      >
                        <p
                          className="text-lg text-gold tracking-wide flex items-center gap-2"
                          style={{ fontFamily: 'var(--font-mono)' }}
                        >
                          View Project
                          <span className="text-xl">→</span>
                        </p>
                      </motion.div>
                    </motion.div>

                    {/* Hover Border Glow */}
                    <motion.div
                      whileHover={{ opacity: 1 }}
                      initial={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 border border-gold border-opacity-50 pointer-events-none"
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Awards Bar Section */}
      <section className="py-24 md:py-32 px-6 md:px-10 bg-charcoal border-t border-gold border-opacity-20">
        <div className="max-w-[1400px] mx-auto">
          <SectionReveal>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl md:text-5xl mb-16 leading-tight"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Recognition
            </motion.h2>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Award 1 */}
            <SectionReveal delay={0.1}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="border-l-2 border-gold pl-6 md:pl-8"
              >
                <p
                  className="text-xs tracking-[0.2em] uppercase text-gold mb-3"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  Venice Film Festival
                </p>
                <p
                  className="text-2xl md:text-3xl text-foreground mb-4 leading-tight"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Orizzonti Prize
                </p>
                <p
                  className="text-sm md:text-base text-ash"
                  style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
                >
                  The Weight of Water (2023)
                </p>
              </motion.div>
            </SectionReveal>

            {/* Award 2 */}
            <SectionReveal delay={0.2}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="border-l-2 border-gold pl-6 md:pl-8"
              >
                <p
                  className="text-xs tracking-[0.2em] uppercase text-gold mb-3"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  Sundance Film Festival
                </p>
                <p
                  className="text-2xl md:text-3xl text-foreground mb-4 leading-tight"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Directing Award
                </p>
                <p
                  className="text-sm md:text-base text-ash"
                  style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
                >
                  Between Tides (2021)
                </p>
              </motion.div>
            </SectionReveal>

            {/* Award 3 */}
            <SectionReveal delay={0.3}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="border-l-2 border-gold pl-6 md:pl-8"
              >
                <p
                  className="text-xs tracking-[0.2em] uppercase text-gold mb-3"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  Berlin International Film Festival
                </p>
                <p
                  className="text-2xl md:text-3xl text-foreground mb-4 leading-tight"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Golden Bear Selection
                </p>
                <p
                  className="text-sm md:text-base text-ash"
                  style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
                >
                  Silk Roads (2022)
                </p>
              </motion.div>
            </SectionReveal>

            {/* Award 4 */}
            <SectionReveal delay={0.4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="border-l-2 border-gold pl-6 md:pl-8"
              >
                <p
                  className="text-xs tracking-[0.2em] uppercase text-gold mb-3"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  Cannes Film Festival
                </p>
                <p
                  className="text-2xl md:text-3xl text-foreground mb-4 leading-tight"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Official Selection
                </p>
                <p
                  className="text-sm md:text-base text-ash"
                  style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
                >
                  Neon Dynasty (2023)
                </p>
              </motion.div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 px-6 md:px-10 bg-carbon border-t border-gold border-opacity-20">
        <div className="max-w-[1400px] mx-auto text-center">
          <SectionReveal>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="text-3xl md:text-4xl mb-8 leading-tight"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Interested in a Collaboration?
            </motion.h2>
          </SectionReveal>

          <SectionReveal delay={0.2}>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="text-lg text-ash mb-10 max-w-2xl mx-auto"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
            >
              Whether you're developing a feature, documentary, or looking for production expertise, we'd
              love to discuss your project.
            </motion.p>
          </SectionReveal>

          <SectionReveal delay={0.3}>
            <motion.a
              href="/contact"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block px-10 py-4 border border-gold text-gold hover:bg-gold hover:text-carbon transition-colors duration-300"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              START A PROJECT
            </motion.a>
          </SectionReveal>
        </div>
      </section>
    </main>
  );
}
