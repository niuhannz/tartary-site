'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import PageHeader from '@/components/PageHeader';
import SectionReveal from '@/components/SectionReveal';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-carbon">
      {/* Page Header */}
      <PageHeader
        label="Contact"
        title="Start a Conversation"
      />

      {/* Contact Section */}
      <section className="py-24 md:py-32 px-6 md:px-10 bg-charcoal">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24">
            {/* Contact Form */}
            <SectionReveal>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              >
                <h2
                  className="text-2xl md:text-3xl mb-10 text-gold"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Send us a Message
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                  >
                    <label
                      htmlFor="name"
                      className="block text-sm text-ash mb-3 tracking-[0.1em] uppercase"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-6 py-4 bg-carbon border border-gold border-opacity-30 text-foreground placeholder-ash focus:outline-none focus:border-gold focus:border-opacity-100 focus:ring-1 focus:ring-gold focus:ring-opacity-20 transition-all duration-300"
                      style={{ fontFamily: 'var(--font-display)' }}
                      placeholder="Your Name"
                    />
                  </motion.div>

                  {/* Email Field */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.8, delay: 0.15 }}
                  >
                    <label
                      htmlFor="email"
                      className="block text-sm text-ash mb-3 tracking-[0.1em] uppercase"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-6 py-4 bg-carbon border border-gold border-opacity-30 text-foreground placeholder-ash focus:outline-none focus:border-gold focus:border-opacity-100 focus:ring-1 focus:ring-gold focus:ring-opacity-20 transition-all duration-300"
                      style={{ fontFamily: 'var(--font-display)' }}
                      placeholder="your@email.com"
                    />
                  </motion.div>

                  {/* Subject Dropdown */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <label
                      htmlFor="subject"
                      className="block text-sm text-ash mb-3 tracking-[0.1em] uppercase"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-carbon border border-gold border-opacity-30 text-foreground focus:outline-none focus:border-gold focus:border-opacity-100 focus:ring-1 focus:ring-gold focus:ring-opacity-20 transition-all duration-300 appearance-none cursor-pointer"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Worlds / IP Development">Worlds / IP Development</option>
                      <option value="Cinema / Film Production">Cinema / Film Production</option>
                      <option value="Games / Interactive">Games / Interactive</option>
                      <option value="Publishing / Literary">Publishing / Literary</option>
                      <option value="Partnership">Partnership</option>
                      <option value="Press">Press</option>
                    </select>
                  </motion.div>

                  {/* Message Field */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.8, delay: 0.25 }}
                  >
                    <label
                      htmlFor="message"
                      className="block text-sm text-ash mb-3 tracking-[0.1em] uppercase"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-6 py-4 bg-carbon border border-gold border-opacity-30 text-foreground placeholder-ash focus:outline-none focus:border-gold focus:border-opacity-100 focus:ring-1 focus:ring-gold focus:ring-opacity-20 transition-all duration-300 resize-none"
                      style={{ fontFamily: 'var(--font-display)' }}
                      placeholder="Tell us about your vision or inquiry..."
                    />
                  </motion.div>

                  {/* Submit Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="pt-4"
                  >
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full px-10 py-4 bg-gold text-carbon font-semibold hover:bg-gold-light disabled:bg-gold disabled:opacity-70 transition-all duration-300 cursor-pointer disabled:cursor-not-allowed"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
                    </button>
                  </motion.div>
                </form>
              </motion.div>
            </SectionReveal>

            {/* Contact Information */}
            <SectionReveal delay={0.2}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              >
                <h2
                  className="text-2xl md:text-3xl mb-10 text-gold"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Contact Information
                </h2>

                {/* Email */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="mb-12"
                >
                  <h3
                    className="text-sm tracking-[0.2em] uppercase text-gold-light mb-3"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    Email
                  </h3>
                  <a
                    href="mailto:hello@tartary.com"
                    className="text-lg text-foreground hover:text-gold transition-colors duration-300"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    hello@tartary.com
                  </a>
                </motion.div>

                {/* Locations */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.8, delay: 0.15 }}
                  className="mb-12"
                >
                  <h3
                    className="text-sm tracking-[0.2em] uppercase text-gold-light mb-6"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    Locations
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p
                        className="text-foreground"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        Los Angeles, CA
                      </p>
                      <p
                        className="text-sm text-ash mt-1"
                        style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
                      >
                        West Coast Creative Hub
                      </p>
                    </div>
                    <div>
                      <p
                        className="text-foreground"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        Nashville, TN
                      </p>
                      <p
                        className="text-sm text-ash mt-1"
                        style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
                      >
                        East Coast Production Base
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Social Links */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="mb-12"
                >
                  <h3
                    className="text-sm tracking-[0.2em] uppercase text-gold-light mb-4"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    Connect With Us
                  </h3>
                  <div className="space-y-2 flex flex-col">
                    <a
                      href="https://vimeo.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground hover:text-gold transition-colors duration-300"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      Vimeo
                    </a>
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground hover:text-gold transition-colors duration-300"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      Instagram
                    </a>
                    <a
                      href="https://imdb.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground hover:text-gold transition-colors duration-300"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      IMDb
                    </a>
                  </div>
                </motion.div>

                {/* Response Time Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.8, delay: 0.25 }}
                  className="pt-8 border-t border-gold border-opacity-20"
                >
                  <p
                    className="text-sm text-ash leading-relaxed"
                    style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
                  >
                    We typically respond to all inquiries within 24-48 hours. Our teams across Worlds, Cinema, Games, and Publishing divisions collaborate to bring your creative vision to life. We look forward to hearing from you.
                  </p>
                </motion.div>
              </motion.div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
        <SectionReveal>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <div className="relative w-full h-full bg-gradient-to-br from-smoke via-charcoal to-carbon flex items-center justify-center overflow-hidden group">
              {/* Animated background elements */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute w-96 h-96 border border-gold border-opacity-10 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                className="absolute w-64 h-64 border border-gold-light border-opacity-10 rounded-full"
              />

              {/* Location Label */}
              <div className="relative z-10 text-center px-6">
                <motion.h3
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="text-3xl md:text-4xl text-gold mb-4"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Los Angeles, CA
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="text-ash"
                  style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
                >
                  TARTARY Creative Studios
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="mt-8"
                >
                  <div className="inline-block w-3 h-3 bg-gold rounded-full" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </SectionReveal>
      </section>

      {/* Final CTA */}
      <section className="py-24 md:py-32 px-6 md:px-10 bg-carbon border-t border-gold border-opacity-20">
        <div className="max-w-2xl mx-auto text-center">
          <SectionReveal>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="text-3xl md:text-4xl mb-8 leading-tight"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Let's Create Together
            </motion.h2>
          </SectionReveal>

          <SectionReveal delay={0.15}>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="text-lg text-ash mb-10"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
            >
              Whether you're exploring immersive worlds, cinematic experiences, interactive games, or literary works, we're here to collaborate. Connect with our Worlds, Cinema, Games, or Publishing divisions and let's build something extraordinary together.
            </motion.p>
          </SectionReveal>

          <SectionReveal delay={0.3}>
            <motion.a
              href="#"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block px-10 py-4 border border-gold text-gold hover:bg-gold hover:text-carbon transition-colors duration-300"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              BACK TO HOME
            </motion.a>
          </SectionReveal>
        </div>
      </section>
    </main>
  );
}
