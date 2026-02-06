'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import SectionReveal from '@/components/SectionReveal';

export default function Services() {
  const services = [
    {
      number: '01',
      title: 'Production',
      description: 'Full-service film and content production from concept through final delivery.',
      bullets: [
        'Cinematography and technical direction',
        'Lighting design and grip services',
        'Sound recording and live audio',
        'Equipment coordination and logistics',
        'Set design and production design',
      ],
    },
    {
      number: '02',
      title: 'Consulting',
      description: 'Strategic guidance for ambitious film projects at any stage of development.',
      bullets: [
        'Market analysis and competitive positioning',
        'Distribution strategy and release planning',
        'Festival strategy and selection',
        'Budget optimization and financing guidance',
        'Production timeline and workflow planning',
      ],
    },
    {
      number: '03',
      title: 'Producing',
      description: 'Creative and executive producing services to bring your vision to reality.',
      bullets: [
        'Script development and story consulting',
        'Talent attachment and casting strategy',
        'Financing and partnership development',
        'Creative oversight and production management',
        'Post-production supervision and finishing',
      ],
    },
    {
      number: '04',
      title: 'Advisory',
      description: 'Industry expertise and strategic counsel for cross-cultural collaborations.',
      bullets: [
        'China-US co-production expertise',
        'International market entry strategy',
        'Cross-cultural storytelling and adaptation',
        'Festival and industry relationships',
        'Long-term partnership development',
      ],
    },
  ];

  const processSteps = [
    { step: 'Discovery', description: 'Understanding your vision and project scope' },
    { step: 'Development', description: 'Planning and strategic preparation' },
    { step: 'Execution', description: 'Bringing the project to life' },
    { step: 'Delivery', description: 'Finishing and release strategy' },
  ];

  return (
    <main className="min-h-screen bg-carbon">
      {/* Page Header */}
      <PageHeader
        label="Services"
        title="End-to-End Cinematic Excellence"
        description="TARTARY offers comprehensive production, consulting, producing, and advisory services designed to elevate your creative vision at every stage of development."
      />

      {/* Services Grid Section */}
      <section className="py-24 md:py-32 px-6 md:px-10 bg-charcoal">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            {services.map((service, index) => (
              <SectionReveal key={service.number} delay={index * 0.1}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="border border-gold border-opacity-30 p-8 md:p-10 hover:border-opacity-60 transition-all duration-300 group hover:bg-smoke hover:bg-opacity-50"
                >
                  {/* Service Number */}
                  <div className="mb-8 flex items-baseline gap-3">
                    <span
                      className="text-4xl md:text-5xl text-gold font-bold tracking-wide group-hover:text-gold-light transition-colors duration-300"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      {service.number}
                    </span>
                    <div className="flex-grow h-px bg-gradient-to-r from-gold to-transparent opacity-30 group-hover:opacity-60 transition-opacity duration-300" />
                  </div>

                  {/* Service Title */}
                  <h3
                    className="text-2xl md:text-3xl mb-4 text-gold-light group-hover:text-gold transition-colors duration-300"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {service.title}
                  </h3>

                  {/* Service Description */}
                  <p
                    className="text-base md:text-lg text-foreground mb-8 leading-relaxed"
                    style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
                  >
                    {service.description}
                  </p>

                  {/* Bullet Points */}
                  <ul className="space-y-3">
                    {service.bullets.map((bullet, bulletIndex) => (
                      <motion.li
                        key={bulletIndex}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{
                          duration: 0.6,
                          delay: index * 0.1 + bulletIndex * 0.05,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="flex gap-4 text-ash group-hover:text-foreground transition-colors duration-300"
                      >
                        <span className="text-gold mt-1.5 flex-shrink-0">→</span>
                        <span
                          style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
                        >
                          {bullet}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* How We Work Section */}
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
              How We Work
            </motion.h2>
          </SectionReveal>

          {/* Process Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4">
            {processSteps.map((item, index) => (
              <SectionReveal key={index} delay={index * 0.1}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="relative"
                >
                  {/* Step Container */}
                  <div className="flex flex-col">
                    {/* Step Circle */}
                    <div className="mb-6 md:mb-8">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-gold flex items-center justify-center bg-gold bg-opacity-10 hover:bg-opacity-20 transition-colors duration-300 mx-auto md:mx-0">
                        <span
                          className="text-gold font-bold text-lg md:text-xl"
                          style={{ fontFamily: 'var(--font-mono)' }}
                        >
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>
                    </div>

                    {/* Step Title */}
                    <h3
                      className="text-xl md:text-2xl text-gold-light mb-3 text-center md:text-left"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {item.step}
                    </h3>

                    {/* Step Description */}
                    <p
                      className="text-ash text-center md:text-left text-sm md:text-base"
                      style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
                    >
                      {item.description}
                    </p>

                    {/* Connector Line (desktop only) */}
                    {index < processSteps.length - 1 && (
                      <div className="hidden md:block absolute left-[50%] md:left-[calc(50%+3rem)] top-20 w-full h-0.5 bg-gradient-to-r from-gold to-transparent opacity-30 -z-10" />
                    )}
                  </div>
                </motion.div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Clients & Partners Section */}
      <section className="py-24 md:py-32 px-6 md:px-10 bg-charcoal">
        <div className="max-w-[1400px] mx-auto">
          <SectionReveal>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2
                className="text-4xl md:text-5xl mb-8 leading-tight"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Who We Work With
              </h2>

              <p
                className="text-lg md:text-xl text-foreground leading-relaxed mb-8"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
              >
                We collaborate with independent filmmakers, emerging studios, and international production partners who share our commitment to authentic storytelling and artistic excellence.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                {[
                  {
                    label: 'Independent Filmmakers',
                    description: 'Supporting visionary directors bringing original stories to the world',
                  },
                  {
                    label: 'Studios & Producers',
                    description: 'Partnering with established entities on new and ambitious projects',
                  },
                  {
                    label: 'International Co-Productions',
                    description: 'Bridging Eastern and Western traditions through collaborative cinema',
                  },
                ].map((partner, index) => (
                  <SectionReveal key={index} delay={index * 0.1}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-80px' }}
                      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                      className="border border-gold border-opacity-20 p-6 md:p-8 hover:border-opacity-40 transition-colors duration-300"
                    >
                      <h3
                        className="text-lg md:text-xl text-gold-light mb-3"
                        style={{ fontFamily: 'var(--font-heading)' }}
                      >
                        {partner.label}
                      </h3>
                      <p
                        className="text-ash text-sm md:text-base"
                        style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
                      >
                        {partner.description}
                      </p>
                    </motion.div>
                  </SectionReveal>
                ))}
              </div>
            </motion.div>
          </SectionReveal>
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
              className="text-3xl md:text-5xl mb-8 leading-tight"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Ready to bring your vision to life?
            </motion.h2>
          </SectionReveal>

          <SectionReveal delay={0.2}>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="text-lg md:text-xl text-ash mb-12 max-w-2xl mx-auto"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
            >
              Whether you're an independent filmmaker, established studio, or visionary with an ambitious project, let's explore how TARTARY can help bring your story to the world.
            </motion.p>
          </SectionReveal>

          <SectionReveal delay={0.3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Link
                href="/contact"
                className="px-10 py-4 border border-gold text-gold hover:bg-gold hover:text-carbon transition-all duration-300 font-semibold"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                GET IN TOUCH
              </Link>
              <Link
                href="/work"
                className="px-10 py-4 border border-gold border-opacity-40 text-gold hover:border-opacity-100 transition-all duration-300"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                EXPLORE OUR WORK
              </Link>
            </motion.div>
          </SectionReveal>
        </div>
      </section>
    </main>
  );
}
