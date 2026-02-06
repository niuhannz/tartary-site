'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import SectionReveal from '@/components/SectionReveal';

interface Article {
  id: number;
  title: string;
  date: string;
  excerpt: string;
  category: string;
  image: string;
}

const featuredArticle: Article = {
  id: 1,
  title: 'Venice Biennale 2024: Behind the Scenes',
  date: '2024-11-15',
  excerpt: 'An intimate look at TARTARY\'s latest cinematic installation at the Venice Biennale. Featuring exclusive behind-the-scenes footage and director interviews about the creative process.',
  category: 'Festival',
  image: 'bg-gradient-to-br from-gold/20 via-charcoal to-carbon'
};

const articles: Article[] = [
  {
    id: 2,
    title: 'New Production Partnership Announced',
    date: '2024-10-28',
    excerpt: 'TARTARY partners with renowned cinematographer to launch an ambitious multi-year production initiative exploring narratives from emerging markets.',
    category: 'Production',
    image: 'bg-gradient-to-br from-smoke/30 via-charcoal to-carbon'
  },
  {
    id: 3,
    title: 'Sundance 2025 Selections Revealed',
    date: '2024-10-12',
    excerpt: 'Three TARTARY-produced films selected for Sundance Film Festival 2025. A testament to our commitment to diverse and authentic storytelling.',
    category: 'Festival',
    image: 'bg-gradient-to-br from-gold-light/20 via-charcoal to-carbon'
  },
  {
    id: 4,
    title: 'The Future of Cinematic AI: An Industry Perspective',
    date: '2024-09-30',
    excerpt: 'TARTARY executives discuss the ethical and creative implications of AI in filmmaking, and how we\'re integrating new tools while preserving human artistry.',
    category: 'Industry Insights',
    image: 'bg-gradient-to-br from-gold/20 via-carbon to-charcoal'
  },
  {
    id: 5,
    title: 'Nashville Studio Expansion Complete',
    date: '2024-09-15',
    excerpt: 'Our Tennessee headquarters now features state-of-the-art post-production facilities and expanded creative spaces. Celebrating 500+ sq ft of new collaborative workspace.',
    category: 'Production',
    image: 'bg-gradient-to-br from-smoke/30 via-charcoal to-carbon'
  },
  {
    id: 6,
    title: 'Director Residency Program Launches',
    date: '2024-08-22',
    excerpt: 'TARTARY announces a new mentorship program supporting emerging filmmakers. Selected residents will work directly with our creative team and access world-class facilities.',
    category: 'Community',
    image: 'bg-gradient-to-br from-gold-light/20 via-charcoal to-carbon'
  },
  {
    id: 7,
    title: 'Documentary Series Wins International Recognition',
    date: '2024-08-05',
    excerpt: 'Our latest documentary series earns multiple awards at the International Documentary Festival. A powerful exploration of cultural heritage and contemporary identity.',
    category: 'Festival',
    image: 'bg-gradient-to-br from-gold/20 via-charcoal to-carbon'
  }
];

export default function News() {
  return (
    <main className="min-h-screen bg-carbon">
      {/* Page Header */}
      <PageHeader
        label="Journal"
        title="Dispatches from the Studio"
      />

      {/* Featured Article */}
      <section className="py-16 md:py-24 px-6 md:px-10 bg-charcoal">
        <div className="max-w-[1400px] mx-auto">
          <SectionReveal>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="group"
            >
              <Link href="#" className="block">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-stretch">
                  {/* Featured Image */}
                  <div className="relative overflow-hidden aspect-video md:aspect-auto md:h-[500px] border border-gold border-opacity-30 group-hover:border-opacity-60 transition-colors duration-300">
                    <div className={`w-full h-full ${featuredArticle.image} flex items-center justify-center relative`}>
                      <div className="absolute inset-0 bg-gradient-to-t from-carbon via-transparent to-transparent opacity-60" />
                      <motion.div
                        initial={{ scale: 0.95 }}
                        whileHover={{ scale: 1 }}
                        transition={{ duration: 0.4 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <div className="text-gold opacity-40">
                          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                          </svg>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Featured Content */}
                  <div className="flex flex-col justify-center py-6 md:py-0">
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                      className="mb-6 inline-block"
                    >
                      <span
                        className="text-xs tracking-[0.25em] uppercase text-gold border border-gold border-opacity-50 px-4 py-2"
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        {featuredArticle.category}
                      </span>
                    </motion.div>

                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.15 }}
                      className="text-3xl md:text-4xl leading-tight mb-6 group-hover:text-gold-light transition-colors duration-300"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {featuredArticle.title}
                    </motion.h2>

                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="text-foreground leading-relaxed mb-6"
                      style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
                    >
                      {featuredArticle.excerpt}
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.25 }}
                      className="flex items-center gap-8 pt-6 border-t border-gold border-opacity-20"
                    >
                      <span
                        className="text-sm text-ash tracking-[0.15em] uppercase"
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        {new Date(featuredArticle.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                      <span className="text-gold text-sm group-hover:translate-x-2 transition-transform duration-300">→</span>
                    </motion.div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </SectionReveal>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-24 md:py-32 px-6 md:px-10 bg-carbon">
        <div className="max-w-[1400px] mx-auto">
          <SectionReveal>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="text-3xl md:text-4xl mb-16 md:mb-24 leading-tight"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Latest Dispatches
            </motion.h2>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            {articles.map((article, index) => (
              <SectionReveal key={article.id} delay={index * 0.1}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="group flex flex-col h-full"
                >
                  <Link href="#" className="flex flex-col h-full">
                    {/* Article Image */}
                    <div className="relative overflow-hidden aspect-video mb-6 border border-gold border-opacity-30 group-hover:border-opacity-60 group-hover:shadow-lg group-hover:shadow-gold/10 transition-all duration-300">
                      <div className={`w-full h-full ${article.image}`} />
                      <div className="absolute inset-0 bg-gradient-to-t from-carbon via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-300" />
                    </div>

                    {/* Article Content */}
                    <div className="flex flex-col flex-grow">
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="mb-4 inline-block"
                      >
                        <span
                          className="text-xs tracking-[0.2em] uppercase text-gold"
                          style={{ fontFamily: 'var(--font-mono)' }}
                        >
                          {article.category}
                        </span>
                      </motion.div>

                      <h3
                        className="text-xl md:text-2xl leading-tight mb-4 group-hover:text-gold-light transition-colors duration-300"
                        style={{ fontFamily: 'var(--font-heading)' }}
                      >
                        {article.title}
                      </h3>

                      <p
                        className="text-ash mb-6 flex-grow"
                        style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
                      >
                        {article.excerpt}
                      </p>

                      <div
                        className="text-xs text-mist tracking-[0.15em] uppercase"
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        {new Date(article.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </SectionReveal>
            ))}
          </div>

          {/* Load More Button */}
          <SectionReveal delay={0.6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="flex justify-center mt-16 md:mt-24"
            >
              <button
                className="px-10 py-4 border border-gold text-gold hover:bg-gold hover:text-carbon transition-colors duration-300"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                LOAD MORE
              </button>
            </motion.div>
          </SectionReveal>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-24 md:py-32 px-6 md:px-10 bg-charcoal border-t border-gold border-opacity-20">
        <div className="max-w-2xl mx-auto text-center">
          <SectionReveal>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="text-3xl md:text-4xl mb-6 leading-tight"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Stay Updated
            </motion.h2>
          </SectionReveal>

          <SectionReveal delay={0.15}>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="text-lg text-ash mb-8"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
            >
              Subscribe to receive the latest dispatches from TARTARY, featuring festival selections, production updates, and industry insights.
            </motion.p>
          </SectionReveal>

          <SectionReveal delay={0.3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-grow px-6 py-3 bg-carbon border border-gold border-opacity-30 text-foreground placeholder-ash focus:outline-none focus:border-opacity-100 transition-colors duration-300"
                style={{ fontFamily: 'var(--font-display)' }}
              />
              <button
                className="px-8 py-3 border border-gold text-gold hover:bg-gold hover:text-carbon transition-colors duration-300 whitespace-nowrap"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                SUBSCRIBE
              </button>
            </motion.div>
          </SectionReveal>
        </div>
      </section>
    </main>
  );
}
