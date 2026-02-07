'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import PageHeader from '@/components/PageHeader';
import SectionReveal from '@/components/SectionReveal';

// ─────────────────────────────── ANIMATION ───────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: 'easeOut' as const },
  },
} as const;

// ─────────────────────────────── TIER DATA ───────────────────────────────
interface PricingTier {
  id: string;
  name: string;
  tagline: string;
  monthlyPrice: number;
  yearlyPrice: number;
  description: string;
  features: string[];
  cta: string;
  accent: string;
  accentGlow: string;
  featured?: boolean;
}

const tiers: PricingTier[] = [
  {
    id: 'member',
    name: 'Member',
    tagline: 'Content Consumption',
    monthlyPrice: 9,
    yearlyPrice: 99,
    description:
      'Full access to the TARTARY universe. Stream films, read publications, explore world archives, and get early access to every release across all divisions.',
    features: [
      'Stream all TARTARY films & anime',
      'Full publishing library access',
      'World archives & lore database',
      'Early access to new releases',
      'Behind-the-scenes content',
      'Community forums & discussions',
      'Monthly digital collectible',
    ],
    cta: 'Join as Member',
    accent: 'rgba(201, 169, 110, 0.5)',
    accentGlow: 'rgba(201, 169, 110, 0.15)',
  },
  {
    id: 'creative',
    name: 'Creative',
    tagline: 'Content Creation',
    monthlyPrice: 29,
    yearlyPrice: 299,
    description:
      'Everything in Member, plus the tools and assets to build within the TARTARY ecosystem. Access MUDFLOOD, asset libraries, and collaborate with the studio.',
    features: [
      'Everything in Member',
      'MUDFLOOD plugin access (beta)',
      'Asset library & texture packs',
      'Character model downloads',
      'World-building templates',
      'Creator community & workshops',
      'Submit work for official canon',
      'Revenue share on approved content',
    ],
    cta: 'Join as Creative',
    accent: 'rgba(217, 119, 6, 0.6)',
    accentGlow: 'rgba(217, 119, 6, 0.2)',
    featured: true,
  },
  {
    id: 'consulting',
    name: 'Consulting',
    tagline: 'Personalized Service',
    monthlyPrice: 199,
    yearlyPrice: 1999,
    description:
      'Direct access to the TARTARY team. Personalized world-building, narrative consulting, technical guidance, and hands-on collaboration for your projects.',
    features: [
      'Everything in Creative',
      'Monthly 1-on-1 strategy sessions',
      'Direct access to studio leads',
      'Custom world-building consultation',
      'Narrative design review',
      'Priority MUDFLOOD support',
      'Co-development opportunities',
      'White-label licensing options',
    ],
    cta: 'Get in Touch',
    accent: 'rgba(139, 92, 246, 0.6)',
    accentGlow: 'rgba(139, 92, 246, 0.2)',
  },
];

// ─────────────────────────────── FAQ ───────────────────────────────
const faqs = [
  {
    q: 'Can I switch tiers at any time?',
    a: 'Yes. Upgrade or downgrade whenever you need to — changes take effect at the start of your next billing cycle. No penalties, no lock-in.',
  },
  {
    q: 'Is MUDFLOOD included with Creative?',
    a: 'Creative members get full beta access to MUDFLOOD, including all current modules. As new features ship, Creative members are first in line.',
  },
  {
    q: 'What does Consulting include exactly?',
    a: 'Consulting is tailored to your needs. It can range from narrative design sessions for your IP, technical integration of MUDFLOOD into your pipeline, to full co-development engagements. We scope it together.',
  },
  {
    q: 'Do you offer team pricing?',
    a: 'For studios and teams of 5+, we offer custom packages. Reach out via the Contact page and we\'ll design something that fits.',
  },
];

// ─────────────────────────────── PAGE ───────────────────────────────
export default function PricingPage() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('yearly');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <main className="bg-background text-foreground">
      {/* ──────────── HEADER ──────────── */}
      <PageHeader
        label="Pricing"
        title="Choose Your Access"
        description="From exploring the universe to building within it. Every tier unlocks a deeper layer of the TARTARY ecosystem."
      />

      {/* ──────────── BILLING TOGGLE ──────────── */}
      <section className="pt-24 sm:pt-32 pb-8 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <SectionReveal delay={0.1}>
            <div className="flex items-center justify-center gap-4">
              <span
                className={`text-sm tracking-wider uppercase transition-colors duration-300 ${
                  billing === 'monthly' ? 'text-foreground' : 'text-ash'
                }`}
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                Monthly
              </span>

              {/* Toggle */}
              <button
                onClick={() => setBilling(billing === 'monthly' ? 'yearly' : 'monthly')}
                className="relative w-14 h-7 rounded-full border border-gold/30 bg-charcoal transition-colors duration-300 hover:border-gold/60"
                aria-label="Toggle billing period"
              >
                <motion.div
                  className="absolute top-[3px] w-5 h-5 rounded-full bg-gold"
                  animate={{ left: billing === 'monthly' ? '3px' : '33px' }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>

              <span
                className={`text-sm tracking-wider uppercase transition-colors duration-300 ${
                  billing === 'yearly' ? 'text-foreground' : 'text-ash'
                }`}
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                Yearly
              </span>

              {billing === 'yearly' && (
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-[10px] tracking-wider uppercase text-amber-400 border border-amber-400/30 px-2 py-0.5 rounded-full"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  Save ~10%
                </motion.span>
              )}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ──────────── PRICING CARDS ──────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch"
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            viewport={{ once: true }}
          >
            {tiers.map((tier) => {
              const price = billing === 'monthly' ? tier.monthlyPrice : tier.yearlyPrice;
              const period = billing === 'monthly' ? '/mo' : '/yr';

              return (
                <motion.div
                  key={tier.id}
                  variants={itemVariants}
                  className="relative group"
                >
                  {/* Featured badge */}
                  {tier.featured && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                      <span
                        className="text-[10px] tracking-[0.2em] uppercase px-4 py-1.5 rounded-full border border-amber-500/50 bg-amber-500/10 text-amber-400 backdrop-blur-sm"
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        Most Popular
                      </span>
                    </div>
                  )}

                  <motion.div
                    className={`relative h-full rounded-xl overflow-hidden border transition-all duration-500 ${
                      tier.featured
                        ? 'border-amber-500/40 hover:border-amber-500/70'
                        : 'border-white/[0.08] hover:border-gold/40'
                    }`}
                    whileHover={{ y: -6, transition: { duration: 0.3 } }}
                  >
                    {/* Background */}
                    <div className="absolute inset-0 bg-charcoal" />

                    {/* Top accent glow */}
                    <div
                      className="absolute top-0 left-0 right-0 h-px"
                      style={{
                        background: `linear-gradient(to right, transparent, ${tier.accent}, transparent)`,
                      }}
                    />

                    {/* Hover glow */}
                    <div
                      className="absolute -top-20 left-1/2 -translate-x-1/2 w-[200%] h-40 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl"
                      style={{ background: tier.accentGlow }}
                    />

                    {/* Content */}
                    <div className="relative z-10 p-8 sm:p-10 flex flex-col h-full">
                      {/* Tier name & tagline */}
                      <div className="mb-8">
                        <span
                          className="text-[11px] tracking-[0.2em] uppercase text-ash block mb-3"
                          style={{ fontFamily: 'var(--font-mono)' }}
                        >
                          {tier.tagline}
                        </span>
                        <h3
                          className="text-3xl sm:text-4xl font-light text-foreground"
                          style={{ fontFamily: 'var(--font-heading)' }}
                        >
                          {tier.name}
                        </h3>
                      </div>

                      {/* Price */}
                      <div className="mb-8">
                        <div className="flex items-baseline gap-1">
                          <span
                            className="text-5xl sm:text-6xl font-light text-foreground"
                            style={{ fontFamily: 'var(--font-heading)' }}
                          >
                            ${price}
                          </span>
                          <span
                            className="text-sm text-ash tracking-wider"
                            style={{ fontFamily: 'var(--font-mono)' }}
                          >
                            {period}
                          </span>
                        </div>
                        {billing === 'yearly' && (
                          <p
                            className="text-[11px] text-ash/60 mt-2 tracking-wider"
                            style={{ fontFamily: 'var(--font-mono)' }}
                          >
                            ${tier.monthlyPrice}/mo billed monthly
                          </p>
                        )}
                      </div>

                      {/* Description */}
                      <p
                        className="text-sm text-mist leading-relaxed mb-8"
                        style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
                      >
                        {tier.description}
                      </p>

                      {/* Divider */}
                      <div
                        className="h-px mb-8 opacity-30"
                        style={{
                          background: `linear-gradient(to right, ${tier.accent}, transparent)`,
                        }}
                      />

                      {/* Features */}
                      <ul className="space-y-3 mb-10 flex-grow">
                        {tier.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <svg
                              className="w-4 h-4 mt-0.5 shrink-0 text-gold/70"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            <span
                              className="text-sm text-mist"
                              style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
                            >
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {/* CTA */}
                      <Link
                        href={tier.id === 'consulting' ? '/contact' : '/login'}
                        className={`block text-center px-8 py-4 rounded-lg text-sm tracking-[0.15em] uppercase transition-all duration-300 ${
                          tier.featured
                            ? 'bg-gold text-carbon hover:bg-gold-light font-medium'
                            : 'border border-gold/40 text-gold hover:border-gold hover:bg-gold/5'
                        }`}
                        style={{ fontFamily: 'var(--font-heading)', fontWeight: 500 }}
                      >
                        {tier.cta}
                      </Link>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ──────────── COMPARISON STRIP ──────────── */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-charcoal">
        <div className="max-w-5xl mx-auto">
          <SectionReveal delay={0.1}>
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-light mb-6 text-foreground"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                What Sets Each Tier Apart
              </h2>
              <div className="separator w-12 h-0.5 bg-gold mx-auto mb-8 opacity-60" />
            </motion.div>
          </SectionReveal>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            viewport={{ once: true }}
          >
            {[
              {
                title: 'Member',
                icon: '◎',
                summary: 'You experience the universe. Watch, read, explore — full access to everything we release.',
              },
              {
                title: 'Creative',
                icon: '◈',
                summary: 'You build within the universe. Tools, assets, community — everything needed to create.',
              },
              {
                title: 'Consulting',
                icon: '◆',
                summary: 'We build with you. Direct collaboration, strategy sessions, custom world-building.',
              },
            ].map((item) => (
              <motion.div
                key={item.title}
                variants={itemVariants}
                className="text-center md:text-left"
              >
                <span className="text-3xl mb-4 block text-gold/60">{item.icon}</span>
                <h3
                  className="text-xl font-light mb-3 text-foreground"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-sm text-mist leading-relaxed"
                  style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
                >
                  {item.summary}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ──────────── FAQ ──────────── */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-carbon">
        <div className="max-w-3xl mx-auto">
          <SectionReveal delay={0.1}>
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-light mb-6 text-foreground"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Questions
              </h2>
              <div className="separator w-12 h-0.5 bg-gold mx-auto opacity-60" />
            </motion.div>
          </SectionReveal>

          <motion.div
            className="space-y-2"
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            viewport={{ once: true }}
          >
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="border border-white/[0.06] rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-white/[0.02] transition-colors duration-200"
                >
                  <span
                    className="text-sm text-foreground tracking-wide pr-4"
                    style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}
                  >
                    {faq.q}
                  </span>
                  <motion.span
                    className="text-gold/60 text-lg shrink-0"
                    animate={{ rotate: expandedFaq === idx ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    +
                  </motion.span>
                </button>

                <motion.div
                  initial={false}
                  animate={{
                    height: expandedFaq === idx ? 'auto' : 0,
                    opacity: expandedFaq === idx ? 1 : 0,
                  }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <p
                    className="px-6 pb-5 text-sm text-mist leading-relaxed"
                    style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
                  >
                    {faq.a}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ──────────── CTA ──────────── */}
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
              Not Sure Yet?
            </motion.h2>

            <motion.p
              className="text-lg sm:text-xl text-mist mb-12 max-w-2xl mx-auto leading-relaxed"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              viewport={{ once: true }}
            >
              Start with Member and upgrade anytime. No commitments, no contracts — just access to what you need, when you need it.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Link
                href="/login"
                className="px-10 py-4 border-2 border-gold text-gold hover:bg-gold hover:text-carbon transition-all duration-300 font-light tracking-wider text-lg rounded"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Get Started
              </Link>
              <Link
                href="/contact"
                className="px-10 py-4 border-2 border-gold border-opacity-40 text-gold hover:border-opacity-100 hover:bg-gold hover:bg-opacity-5 transition-all duration-300 font-light tracking-wider text-lg rounded"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Talk to Us
              </Link>
            </motion.div>
          </SectionReveal>
        </div>
      </section>
    </main>
  );
}
