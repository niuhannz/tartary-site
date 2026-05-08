"use client";

import { motion } from "framer-motion";
import {
  Text,
  TartaryOrnament,
  ProductCarousel,
  VisionEnvironment,
} from "@/components/vision";
import { ShimmerButton } from "@/components/magicui/ShimmerButton";

const ease = [0.23, 1, 0.32, 1];

export default function HomePage() {
  return (
    <VisionEnvironment>
      {/* ── Ornament: floating left pillar nav ── */}
      <div className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-30 hidden md:block">
        <TartaryOrnament activeHref="/world" />
      </div>

      {/* ── Main spatial layout ── */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-6xl xl:max-w-7xl mx-auto">
        {/* Wordmark above the carousel */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease }}
          className="mb-2 text-center"
        >
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[0.32em] uppercase glass-text-glow"
            style={{ fontFamily: "var(--font-display)" }}
          >
            TARTARY
          </h1>
          <Text size="caption1" variant="tertiary" as="p" className="mt-2 tracking-widest uppercase" style={{ fontFamily: "var(--font-mono)" }}>
            Sovereign AI Conglomerate
          </Text>
        </motion.div>

        {/* ── 3D Product Carousel ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease }}
          className="w-full"
        >
          <ProductCarousel />
        </motion.div>

        {/* Tagline + CTA below the carousel */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-4 text-center flex flex-col items-center gap-4"
        >
          <Text size="footnote" variant="tertiary" as="p" className="max-w-lg mx-auto">
            Spatial computing is the final canvas — where cinema, games, and reality converge.
          </Text>
          <ShimmerButton
            shimmerColor="#FF6600"
            background="rgba(10, 8, 8, 0.75)"
            shimmerDuration="3s"
            className="text-sm font-medium tracking-wide"
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" />
                <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" opacity="0.6" />
              </svg>
              Watch Spatial Demo
            </span>
          </ShimmerButton>
        </motion.div>
      </div>

      {/* ── Mobile ornament (bottom bar) ── */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 md:hidden">
        <TartaryOrnament activeHref="/world" className="!flex-row" />
      </div>
    </VisionEnvironment>
  );
}
