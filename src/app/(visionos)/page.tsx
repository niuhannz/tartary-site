"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Material, MotionView, Text, VisionButton, WindowControls } from "@/components/vision";
import OrbitalRing from "@/components/OrbitalRing";

const ease = [0.23, 1, 0.32, 1];

/* ── Product card using vision-ui Material ── */
function ProductWindow({
  href,
  eyebrow,
  title,
  description,
  accentColor,
  icon,
}: {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  accentColor: string;
  icon: React.ReactNode;
}) {
  return (
    <Link href={href} className="block group">
      <MotionView
        material={{ thickness: "thick" }}
        whileHover={{ y: -4, scale: 1.015 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="relative overflow-hidden h-full"
      >
        {/* Content overlay tint */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            background: `radial-gradient(ellipse at 30% 20%, ${accentColor}, transparent 70%)`,
          }}
        />

        <div className="relative z-10 p-8 sm:p-10">
          {/* Icon */}
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
            style={{
              background: `color-mix(in oklch, ${accentColor} 15%, transparent)`,
              color: accentColor,
              border: `1px solid color-mix(in oklch, ${accentColor} 25%, transparent)`,
            }}
          >
            {icon}
          </div>

          {/* Eyebrow */}
          <Text
            size="footnote"
            variant="secondary"
            as="span"
            className="block mb-3 font-semibold tracking-widest uppercase"
            style={{ color: accentColor }}
          >
            {eyebrow}
          </Text>

          {/* Title */}
          <Text
            size="title1"
            as="h3"
            className="tracking-tight mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {title}
          </Text>

          {/* Description */}
          <Text size="callout" variant="secondary" className="max-w-md">
            {description}
          </Text>

          {/* Arrow */}
          <div className="mt-6 flex items-center gap-2">
            <Text size="callout" as="span" style={{ color: accentColor }}>
              Learn more
            </Text>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="group-hover:translate-x-1 transition-transform"
              style={{ color: accentColor }}
            >
              <path
                d="M3 8H13M13 8L9 4M13 8L9 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Window controls at bottom */}
        <div className="flex justify-center pb-2">
          <WindowControls className="relative bottom-0" />
        </div>
      </MotionView>
    </Link>
  );
}

export default function HomePage() {
  return (
    <div className="relative">
      {/* ════════════════════════════════════════════
          HERO SECTION
      ════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Orbital rings decoration */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <OrbitalRing size={600} duration={60} opacity={0.04} />
          <OrbitalRing size={800} duration={90} opacity={0.03} delay={5} />
          <OrbitalRing size={1000} duration={120} opacity={0.02} delay={10} />
        </div>

        {/* Central hero content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          {/* Eyebrow badge — Material pill */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease }}
          >
            <Material thickness="thin" className="inline-flex items-center gap-2 px-5 py-2 !rounded-full !min-h-0 !min-w-0">
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: "var(--color-orange)" }}
              />
              <Text size="caption1" variant="secondary" as="span" className="font-medium tracking-wide uppercase">
                Built for Apple Vision Pro
              </Text>
            </Material>
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
                  "linear-gradient(135deg, var(--color-orange), oklch(0.75 0.15 250))",
              }}
            >
              OS
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7, ease }}
          >
            <Text
              size="title3"
              variant="secondary"
              className="mt-6 max-w-2xl mx-auto !font-normal"
            >
              The spatial computing studio pioneering AI-native content creation
              for visionOS. Cinema. Games. Worlds beyond imagination.
            </Text>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9, ease }}
            className="mt-10 flex items-center justify-center gap-4 flex-wrap"
          >
            <Link href="/systems">
              <VisionButton
                variant="primary"
                className="!rounded-full !px-7 !h-[3rem] !bg-[var(--color-orange)] before:!bg-[var(--color-orange)]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Explore Systems
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </VisionButton>
            </Link>
            <Link href="/universe">
              <Material thickness="thin" className="!rounded-full !min-h-0 !min-w-0">
                <VisionButton
                  variant="secondary"
                  className="!rounded-full !px-7 !h-[3rem]"
                >
                  <span className="relative z-10">Our Universe</span>
                </VisionButton>
              </Material>
            </Link>
          </motion.div>
        </div>

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
          style={{
            background: "linear-gradient(to top, var(--bg), transparent)",
          }}
        />
      </section>

      {/* ════════════════════════════════════════════
          SYSTEMS PREVIEW — Material Window Cards
      ════════════════════════════════════════════ */}
      <section className="relative px-6 pb-32 -mt-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease }}
            className="grid md:grid-cols-2 gap-6"
          >
            <ProductWindow
              href="/systems#tartary-os"
              eyebrow="System 01"
              title="Tartary OS"
              description="AI-native cinematic content creation. Direct immersive films, compose spatial narratives, and render worlds — all within Vision Pro."
              accentColor="var(--color-orange)"
              icon={
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect x="4" y="6" width="24" height="16" rx="3" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M13 11L20 14.5L13 18V11Z" fill="currentColor" opacity="0.6" />
                  <path d="M10 26H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              }
            />
            <ProductWindow
              href="/systems#mudflood"
              eyebrow="System 02"
              title="Mudflood"
              description="AI-powered visionOS game creation. Build interactive spatial experiences with natural language, procedural generation, and real-time collaboration."
              accentColor="oklch(0.7 0.18 290)"
              icon={
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M7 10L16 5L25 10V20L16 25L7 20V10Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                  <path d="M16 15V25" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M16 15L25 10" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M16 15L7 10" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              }
            />
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          VISION STATEMENT — Material Window
      ════════════════════════════════════════════ */}
      <section className="relative px-6 pb-40">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease }}
          >
            <Material thickness="thin" className="p-12 sm:p-16">
              <Text
                size="XLTitle2"
                as="p"
                className="!font-semibold tracking-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                We believe spatial computing is the{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, var(--color-orange), oklch(0.7 0.18 290))",
                  }}
                >
                  final canvas
                </span>
                {" "}— where cinema, games, and reality converge.
              </Text>
            </Material>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════ */}
      <footer className="relative px-6 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="hairline w-full mb-8" />
          <div
            className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs"
            style={{ color: "var(--color-ash)" }}
          >
            <span>© 2026 Tartary LLC. All rights reserved.</span>
            <div className="flex items-center gap-6">
              <Link href="/contact" className="hover:text-white/60 transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
