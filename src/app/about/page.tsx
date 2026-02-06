'use client';

import { motion } from 'framer-motion';
import PageHeader from '@/components/PageHeader';
import SectionReveal from '@/components/SectionReveal';

export default function About() {
  return (
    <main className="min-h-screen bg-carbon">
      {/* Page Header */}
      <PageHeader
        label="About"
        title="Where Vision Meets Craft"
        description="An award-winning cinematic studio bridging Eastern and Western storytelling traditions across California and Tennessee."
      />

      {/* Origin Story Section */}
      <section className="py-24 md:py-32 px-6 md:px-10 bg-charcoal">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start">
            {/* Left Column - Quote */}
            <SectionReveal>
              <motion.blockquote
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="text-2xl md:text-3xl leading-relaxed text-gold-light italic"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                "Cinema is not just about images and sound—it's about creating portals into human consciousness."
              </motion.blockquote>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="mt-6 text-sm tracking-[0.2em] uppercase text-ash"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                — TARTARY Founding Principle
              </motion.p>
            </SectionReveal>

            {/* Right Column - Story */}
            <SectionReveal delay={0.2}>
              <div className="space-y-6">
                <p
                  className="text-lg text-foreground leading-relaxed"
                  style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
                >
                  Founded in 2009, TARTARY emerged from a simple conviction: that cinema could transcend cultural boundaries and speak to the shared human experience. What began as a small production collective in California has evolved into an internationally recognized studio, with offices spanning from Los Angeles to Nashville.
                </p>
                <p
                  className="text-lg text-foreground leading-relaxed"
                  style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
                >
                  Our name, inspired by historical cartography and the concept of hidden territories, reflects our mission: to explore uncharted emotional landscapes through film and visual storytelling. We believe the most powerful stories are those that bridge Eastern contemplative traditions with Western narrative dynamism.
                </p>
                <p
                  className="text-lg text-foreground leading-relaxed"
                  style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
                >
                  Over fifteen years, we've worked with visionary directors, producers, and artists to create work that resonates at festivals from Venice to Sundance. Our projects have been selected over 50 times at major international film festivals, with multiple award selections and a Venice Orizzonti Prize for our feature work.
                </p>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 md:py-32 px-6 md:px-10 bg-carbon">
        <div className="max-w-[1400px] mx-auto">
          <SectionReveal>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl md:text-5xl mb-20 leading-tight"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Our Philosophy
            </motion.h2>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Authenticity */}
            <SectionReveal delay={0.1}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="border border-gold border-opacity-30 p-8 md:p-10 hover:border-opacity-60 transition-colors duration-300 group"
              >
                <div className="w-12 h-12 border border-gold mb-6 flex items-center justify-center group-hover:bg-gold group-hover:bg-opacity-10 transition-colors duration-300">
                  <span
                    className="text-gold text-lg font-bold"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    01
                  </span>
                </div>
                <h3
                  className="text-2xl mb-4 text-gold"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Authenticity
                </h3>
                <p
                  className="text-ash leading-relaxed"
                  style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
                >
                  We believe in telling genuine stories that honor their subjects and respect their audiences. Every project begins with deep research and cultural sensitivity.
                </p>
              </motion.div>
            </SectionReveal>

            {/* Innovation */}
            <SectionReveal delay={0.2}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="border border-gold border-opacity-30 p-8 md:p-10 hover:border-opacity-60 transition-colors duration-300 group"
              >
                <div className="w-12 h-12 border border-gold mb-6 flex items-center justify-center group-hover:bg-gold group-hover:bg-opacity-10 transition-colors duration-300">
                  <span
                    className="text-gold text-lg font-bold"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    02
                  </span>
                </div>
                <h3
                  className="text-2xl mb-4 text-gold"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Innovation
                </h3>
                <p
                  className="text-ash leading-relaxed"
                  style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
                >
                  We embrace emerging technologies and experimental approaches while remaining grounded in timeless storytelling principles. Innovation serves the story, never the reverse.
                </p>
              </motion.div>
            </SectionReveal>

            {/* Collaboration */}
            <SectionReveal delay={0.3}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="border border-gold border-opacity-30 p-8 md:p-10 hover:border-opacity-60 transition-colors duration-300 group"
              >
                <div className="w-12 h-12 border border-gold mb-6 flex items-center justify-center group-hover:bg-gold group-hover:bg-opacity-10 transition-colors duration-300">
                  <span
                    className="text-gold text-lg font-bold"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    03
                  </span>
                </div>
                <h3
                  className="text-2xl mb-4 text-gold"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Collaboration
                </h3>
                <p
                  className="text-ash leading-relaxed"
                  style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
                >
                  Great cinema is made by diverse minds working in harmony. We cultivate relationships with filmmakers, artists, and creatives across cultures and disciplines.
                </p>
              </motion.div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* By The Numbers Section */}
      <section className="py-24 md:py-32 px-6 md:px-10 bg-charcoal">
        <div className="max-w-[1400px] mx-auto">
          <SectionReveal>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl md:text-5xl mb-20 leading-tight text-center"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              By The Numbers
            </motion.h2>
          </SectionReveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {/* Experience */}
            <SectionReveal delay={0.1}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="text-center"
              >
                <div
                  className="text-5xl md:text-6xl text-gold mb-4 font-bold"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  15+
                </div>
                <p
                  className="text-sm tracking-[0.15em] uppercase text-ash"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  Years Experience
                </p>
              </motion.div>
            </SectionReveal>

            {/* Continents */}
            <SectionReveal delay={0.2}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="text-center"
              >
                <div
                  className="text-5xl md:text-6xl text-gold mb-4 font-bold"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  3
                </div>
                <p
                  className="text-sm tracking-[0.15em] uppercase text-ash"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  Continents
                </p>
              </motion.div>
            </SectionReveal>

            {/* Festival Selections */}
            <SectionReveal delay={0.3}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="text-center"
              >
                <div
                  className="text-5xl md:text-6xl text-gold mb-4 font-bold"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  50+
                </div>
                <p
                  className="text-sm tracking-[0.15em] uppercase text-ash"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  Festival Selections
                </p>
              </motion.div>
            </SectionReveal>

            {/* Award */}
            <SectionReveal delay={0.4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="text-center"
              >
                <div
                  className="text-sm md:text-lg text-gold mb-4 font-bold tracking-wide"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  ORIZZONTI PRIZE
                </div>
                <p
                  className="text-sm tracking-[0.15em] uppercase text-ash"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  Venice Film Festival
                </p>
              </motion.div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* Approach Section */}
      <section className="py-24 md:py-32 px-6 md:px-10 bg-carbon">
        <div className="max-w-[1400px] mx-auto">
          <SectionReveal>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl md:text-5xl mb-20 leading-tight"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Our Approach
            </motion.h2>
          </SectionReveal>

          <div className="max-w-2xl">
            {/* Step 1 */}
            <SectionReveal delay={0.1}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="mb-16 md:mb-24 flex gap-8 md:gap-12"
              >
                <div className="flex flex-col items-center">
                  <div
                    className="w-12 h-12 rounded-full border-2 border-gold flex items-center justify-center bg-gold bg-opacity-10 mb-6"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    <span className="text-gold font-bold text-sm">01</span>
                  </div>
                  <div className="hidden md:block w-0.5 bg-gradient-to-b from-gold to-transparent h-24" />
                </div>
                <div className="pt-1 pb-8">
                  <h3
                    className="text-2xl text-gold mb-4"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    Development & Conceptualization
                  </h3>
                  <p
                    className="text-foreground leading-relaxed"
                    style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
                  >
                    Every project begins with deep conceptual work. We spend time understanding the story's essence, thematic intentions, and cultural context. We collaborate with writers, researchers, and subject matter experts to build a solid foundation.
                  </p>
                </div>
              </motion.div>
            </SectionReveal>

            {/* Step 2 */}
            <SectionReveal delay={0.2}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="mb-16 md:mb-24 flex gap-8 md:gap-12"
              >
                <div className="flex flex-col items-center">
                  <div
                    className="w-12 h-12 rounded-full border-2 border-gold flex items-center justify-center bg-gold bg-opacity-10 mb-6"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    <span className="text-gold font-bold text-sm">02</span>
                  </div>
                  <div className="hidden md:block w-0.5 bg-gradient-to-b from-gold to-transparent h-24" />
                </div>
                <div className="pt-1 pb-8">
                  <h3
                    className="text-2xl text-gold mb-4"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    Pre-Production & Planning
                  </h3>
                  <p
                    className="text-foreground leading-relaxed"
                    style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
                  >
                    We meticulously plan every aspect—from shot lists and storyboards to location scouting and production design. This phase ensures alignment across all creative departments and prepares us for efficient, intentional execution on set.
                  </p>
                </div>
              </motion.div>
            </SectionReveal>

            {/* Step 3 */}
            <SectionReveal delay={0.3}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="mb-16 md:mb-24 flex gap-8 md:gap-12"
              >
                <div className="flex flex-col items-center">
                  <div
                    className="w-12 h-12 rounded-full border-2 border-gold flex items-center justify-center bg-gold bg-opacity-10 mb-6"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    <span className="text-gold font-bold text-sm">03</span>
                  </div>
                  <div className="hidden md:block w-0.5 bg-gradient-to-b from-gold to-transparent h-24" />
                </div>
                <div className="pt-1 pb-8">
                  <h3
                    className="text-2xl text-gold mb-4"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    Production
                  </h3>
                  <p
                    className="text-foreground leading-relaxed"
                    style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
                  >
                    On set, we balance meticulous planning with creative spontaneity. Our experienced crews maintain the highest production standards while remaining flexible enough to capture unexpected magic—the moments that elevate a good film to a great one.
                  </p>
                </div>
              </motion.div>
            </SectionReveal>

            {/* Step 4 */}
            <SectionReveal delay={0.4}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="flex gap-8 md:gap-12"
              >
                <div className="flex flex-col items-center">
                  <div
                    className="w-12 h-12 rounded-full border-2 border-gold flex items-center justify-center bg-gold bg-opacity-10"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    <span className="text-gold font-bold text-sm">04</span>
                  </div>
                </div>
                <div className="pt-1">
                  <h3
                    className="text-2xl text-gold mb-4"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    Post-Production & Finishing
                  </h3>
                  <p
                    className="text-foreground leading-relaxed"
                    style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
                  >
                    In post, we transform raw footage into finished cinema. Through editing, color grading, sound design, and music composition, we refine every frame to achieve our artistic vision. This final phase determines how audiences experience the emotional and technical dimensions of the work.
                  </p>
                </div>
              </motion.div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 px-6 md:px-10 bg-charcoal border-t border-gold border-opacity-20">
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
              Ready to Create Something Extraordinary?
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
              Let's collaborate on your next project. Whether you're a filmmaker, brand, or visionary with a story to tell, we'd love to hear from you.
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
              GET IN TOUCH
            </motion.a>
          </SectionReveal>
        </div>
      </section>
    </main>
  );
}
