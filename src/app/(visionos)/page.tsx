"use client";

import { motion } from "framer-motion";
import {
  Text,
  TartaryOrnament,
  TartarySidebar,
  VisionEnvironment,
} from "@/components/vision";
import { ShimmerButton } from "@/components/magicui/ShimmerButton";

const ease = [0.23, 1, 0.32, 1];

export default function HomePage() {
  return (
    <VisionEnvironment>
      {/* ── Ornament: floating left pillar nav ── */}
      <div className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-30 hidden md:block">
        <TartaryOrnament activeHref="/systems" />
      </div>

      {/* ── Main spatial layout ── */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-5xl xl:max-w-6xl mx-auto">
        {/* Wordmark above the window */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease }}
          className="mb-6 text-center"
        >
          <h1
            className="text-2xl sm:text-3xl font-bold tracking-[0.32em] uppercase glass-text-glow"
            style={{ fontFamily: "var(--font-display)" }}
          >
            TARTARY
          </h1>
          <Text size="caption1" variant="tertiary" as="p" className="mt-1 tracking-widest uppercase" style={{ fontFamily: "var(--font-mono)" }}>
            Sovereign AI Conglomerate
          </Text>
        </motion.div>

        {/* Main window — Finder-style Sidebar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease }}
          className="w-full"
        >
          <TartarySidebar />
        </motion.div>

        {/* Tagline + CTA below the window */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-8 text-center flex flex-col items-center gap-4"
        >
          <Text size="footnote" variant="tertiary" as="p" className="max-w-md mx-auto">
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
        <TartaryOrnament activeHref="/systems" className="!flex-row" />
      </div>
    </VisionEnvironment>
  );
}
