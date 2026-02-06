'use client';

import { motion } from 'framer-motion';
import PageHeader from '@/components/PageHeader';
import SectionReveal from '@/components/SectionReveal';

const teamMembers = [
  {
    id: 1,
    name: 'Jake Mahaffy',
    role: 'Director & Filmmaker',
    bio: 'Self-produced micro-budget shorts and features made single-handedly, featuring untrained actors in rural settings, Jake evolved to work with professional actors and crews on projects screened internationally. His work has been exhibited at Sundance, Venice (Orizzonti Prize for Best Film 2015), and SXSW (2016, Grand Jury Prize 2008). Beyond filmmaking, he has founded three filmmaking programs at universities as Associate Professor of Film and Art in the US and New Zealand.',
    accolades: [
      'Venice Orizzonti Prize (2015)',
      'SXSW Grand Jury Prize (2008)',
      'Sundance Selection',
      'Associate Professor - 3 Universities',
    ],
  },
  {
    id: 2,
    name: 'Ran Zheng',
    role: 'Creative Strategist & Financial Expert',
    bio: "Graduated from University of Wisconsin with a Master\u2019s from University of Oxford in Financial Economics, Ran brings deep expertise to the intersection of art and commerce. As a CFA specialized in Chinese film and media industries, she served at China Galaxy Securities, LeTV, and Maoyan Entertainment. Her research on media equity has shaped industry discourse, earning recognition as one of China\u2019s top media industries equity research analysts in 2014.",
    accolades: [
      'University of Oxford - Financial Economics',
      'CFA Designation',
      'China Galaxy Securities',
      'Top Media Analyst (2014)',
    ],
  },
  {
    id: 3,
    name: 'Han Niu',
    role: 'Writer, Director & Producer',
    bio: "Trained in intermedia art and film at University of Auckland with a Doctorate in contemporary art from Central Academy of Fine Arts, China, Han combines Eastern artistic traditions with contemporary cinematic language. As assistant director for John Woo and studying under masters like Abbas Kiarostami, Hou Hsiao-Hsien, and Xu Bing, Han\u2019s work is distinguished by dark humor and visual sophistication. Selected for prestigious programs including Berlinale Talents, Venice Biennale College Cinema, and the Nipkow Fellowship.",
    accolades: [
      'Central Academy of Fine Arts - Doctorate',
      'Berlinale Talents',
      'Venice Biennale College Cinema',
      'Nipkow Fellowship',
    ],
  },
];

export default function Team() {
  return (
    <main className="min-h-screen bg-carbon">
      {/* Page Header */}
      <PageHeader
        label="The Team"
        title="Three Visions, One Studio"
      />

      {/* Team Members Section */}
      <section className="py-24 md:py-32 px-6 md:px-10 bg-carbon">
        <div className="max-w-[1400px] mx-auto">
          {/* Jake Mahaffy */}
          <SectionReveal className="mb-32 md:mb-48">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
              {/* Portrait - Left */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="aspect-[3/4] bg-gradient-to-b from-smoke to-charcoal rounded-sm overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center text-ash text-sm tracking-widest" style={{ fontFamily: 'var(--font-mono)' }}>
                    PORTRAIT
                  </div>
                </div>
              </motion.div>

              {/* Content - Right */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col justify-start pt-4 md:pt-0"
              >
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="text-5xl md:text-6xl mb-4 leading-tight"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {teamMembers[0].name}
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                  className="text-sm tracking-[0.2em] uppercase text-gold mb-8"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {teamMembers[0].role}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="mb-10"
                >
                  <p
                    className="text-lg text-foreground leading-relaxed"
                    style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
                  >
                    {teamMembers[0].bio}
                  </p>
                </motion.div>

                {/* Accolades */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-wrap gap-3"
                >
                  {teamMembers[0].accolades.map((accolade, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-4 py-2 border border-gold border-opacity-50 text-gold-light hover:border-opacity-100 transition-colors duration-300"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      {accolade}
                    </span>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </SectionReveal>

          {/* Ran Zheng */}
          <SectionReveal className="mb-32 md:mb-48">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
              {/* Content - Left (flipped order) */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col justify-start pt-4 md:pt-0 order-2 md:order-1"
              >
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="text-5xl md:text-6xl mb-4 leading-tight"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {teamMembers[1].name}
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                  className="text-sm tracking-[0.2em] uppercase text-gold mb-8"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {teamMembers[1].role}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="mb-10"
                >
                  <p
                    className="text-lg text-foreground leading-relaxed"
                    style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
                  >
                    {teamMembers[1].bio}
                  </p>
                </motion.div>

                {/* Accolades */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-wrap gap-3"
                >
                  {teamMembers[1].accolades.map((accolade, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-4 py-2 border border-gold border-opacity-50 text-gold-light hover:border-opacity-100 transition-colors duration-300"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      {accolade}
                    </span>
                  ))}
                </motion.div>
              </motion.div>

              {/* Portrait - Right (flipped order) */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="order-1 md:order-2"
              >
                <div className="aspect-[3/4] bg-gradient-to-b from-charcoal to-smoke rounded-sm overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center text-ash text-sm tracking-widest" style={{ fontFamily: 'var(--font-mono)' }}>
                    PORTRAIT
                  </div>
                </div>
              </motion.div>
            </div>
          </SectionReveal>

          {/* Han Niu */}
          <SectionReveal className="mb-32 md:mb-48">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
              {/* Portrait - Left */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="aspect-[3/4] bg-gradient-to-b from-smoke to-charcoal rounded-sm overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center text-ash text-sm tracking-widest" style={{ fontFamily: 'var(--font-mono)' }}>
                    PORTRAIT
                  </div>
                </div>
              </motion.div>

              {/* Content - Right */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col justify-start pt-4 md:pt-0"
              >
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="text-5xl md:text-6xl mb-4 leading-tight"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {teamMembers[2].name}
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                  className="text-sm tracking-[0.2em] uppercase text-gold mb-8"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {teamMembers[2].role}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="mb-10"
                >
                  <p
                    className="text-lg text-foreground leading-relaxed"
                    style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
                  >
                    {teamMembers[2].bio}
                  </p>
                </motion.div>

                {/* Accolades */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-wrap gap-3"
                >
                  {teamMembers[2].accolades.map((accolade, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-4 py-2 border border-gold border-opacity-50 text-gold-light hover:border-opacity-100 transition-colors duration-300"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      {accolade}
                    </span>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Collective Section */}
      <section className="py-24 md:py-32 px-6 md:px-10 bg-charcoal border-t border-gold border-opacity-20">
        <div className="max-w-[1000px] mx-auto">
          <SectionReveal>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl md:text-5xl mb-12 leading-tight"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Together
            </motion.h2>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <div className="space-y-8">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="text-lg text-foreground leading-relaxed"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
              >
                What makes TARTARY unique is not the individual accomplishments of our team members, but the way their distinct visions converge. Jake's grounded, intuitive filmmaking language; Ran's strategic understanding of global markets and finance; and Han's sophisticated artistic sensibility informed by Eastern and Western masters—these three perspectives create something greater than their sum.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="text-lg text-foreground leading-relaxed"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
              >
                We bridge the gap between independent cinema and international commerce, between artistic integrity and strategic vision, between East and West. We believe exceptional storytelling doesn't have to choose between art and accessibility—when guided by a clear artistic voice, these forces amplify each other.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="text-lg text-foreground leading-relaxed"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
              >
                This is the TARTARY difference: a studio where visionary filmmaking meets worldly strategy, where artistic ambition is grounded in practical expertise, and where boundary-crossing cinema is the natural result of three minds committed to the same uncompromising vision.
              </motion.p>
            </div>
          </SectionReveal>

          {/* Divider */}
          <SectionReveal delay={0.3}>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="mt-16 separator origin-left"
            />
          </SectionReveal>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 px-6 md:px-10 bg-carbon">
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
              Work With Us
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
              Whether you're bringing a script, a vision, or a challenge that requires boundary-crossing cinema, let's explore what's possible together.
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
