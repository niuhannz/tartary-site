"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import GlassCard from "@/components/GlassCard";
import OrbitalRing from "@/components/OrbitalRing";

const ease = [0.23, 1, 0.32, 1];

export default function HomePage() {
  return (
    <div className="relative">
      {/* ═══ HERO SECTION ═══ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Orbital rings decoration */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <OrbitalRing size={600} duration={60} opacity={0.04} />
          <OrbitalRing size={800} duration={90} opacity={0.03} delay={5} />
          <OrbitalRing size={1000} duration={120} opacity={0.02} delay={10} />
        </div>

        {/* Central content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease }}
          >            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-wide uppercase glass-panel">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "var(--color-accent-cyan)" }}
              />
              Built for Apple Vision Pro
            </span>
          </motion.div>

          {/* Main title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease }}
            className="mt-8 text-6xl sm:text-7xl md:text-8xl font-bold tracking-tight leading-[0.95] glass-text-glow"
            style={{ fontFamily: "var(--font-display)" }}
          >
            TARTARY
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-cyan))",
              }}
            >
              OS
            </span>
          </motion.h1>
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7, ease }}
            className="mt-6 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed"
            style={{ color: "var(--color-text-secondary)" }}
          >
            The spatial computing studio pioneering AI-native content creation
            for visionOS. Cinema. Games. Worlds beyond imagination.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9, ease }}
            className="mt-10 flex items-center justify-center gap-4 flex-wrap"
          >
            <Link
              href="/systems"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold transition-all duration-300"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-cyan))",
                color: "white",
                boxShadow: "0 8px 32px oklch(0.75 0.15 250 / 0.3)",
              }}
            >              Explore Systems
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="ml-0.5"
              >
                <path
                  d="M6 3L11 8L6 13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <Link
              href="/about"
              className="glass-panel glass-panel-hover inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold"
              style={{ color: "var(--color-text-secondary)" }}
            >
              About Tartary
            </Link>
          </motion.div>
        </div>

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"          style={{
            background:
              "linear-gradient(to top, var(--color-bg-void), transparent)",
          }}
        />
      </section>

      {/* ═══ SYSTEMS PREVIEW CARDS ═══ */}
      <section className="relative px-6 pb-32 -mt-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease }}
            className="grid md:grid-cols-2 gap-6"
          >
            <GlassCard
              href="/systems#tartary-os"
              eyebrow="System 01"
              title="Tartary OS"
              description="AI-native cinematic content creation. Direct immersive films, compose spatial narratives, and render worlds — all within Vision Pro."
              accentColor="var(--color-accent-primary)"
              icon={
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect
                    x="4"
                    y="6"
                    width="24"
                    height="16"                    rx="3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M13 11L20 14.5L13 18V11Z"
                    fill="currentColor"
                    opacity="0.6"
                  />
                  <path
                    d="M10 26H22"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              }
            />
            <GlassCard
              href="/systems#mudflood"
              eyebrow="System 02"
              title="Mudflood"
              description="AI-powered visionOS game creation. Build interactive spatial experiences with natural language, procedural generation, and real-time collaboration."
              accentColor="var(--color-accent-violet)"
              icon={
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path
                    d="M7 10L16 5L25 10V20L16 25L7 20V10Z"
                    stroke="currentColor"
                    strokeWidth="1.5"                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 15V25"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M16 15L25 10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M16 15L7 10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              }
            />
          </motion.div>
        </div>
      </section>

      {/* ═══ VISION STATEMENT ═══ */}
      <section className="relative px-6 pb-40">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease }}
            className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-snug tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            We believe spatial computing is the{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-violet))",
              }}
            >
              final canvas
            </span>
            {" "}— where cinema, games, and reality converge.
          </motion.p>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="relative px-6 pb-12">
        <div className="max-w-6xl mx-auto">
          <div
            className="h-px w-full mb-8"
            style={{ background: "var(--color-glass-border)" }}
          />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs"
            style={{ color: "var(--color-text-muted)" }}
          >            <span>© 2026 Tartary LLC. All rights reserved.</span>
            <div className="flex items-center gap-6">
              <Link href="/contact" className="hover:text-white/60 transition-colors">
                Contact
              </Link>
              <a href="https://twitter.com/tartary" target="_blank" rel="noopener noreferrer" className="hover:text-white/60 transition-colors">
                Twitter
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}