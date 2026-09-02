"use client";

import { motion } from "framer-motion";

const ease = [0.23, 1, 0.32, 1] as const;

export default function HomePage() {
  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ background: "#0A0808" }}>
      {/* ── Center wordmark ── */}
      <div className="absolute inset-0 z-[2] flex flex-col items-center justify-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-[0.3em] uppercase"
          style={{
            fontFamily: "var(--font-logo)",
            color: "var(--color-bone)",
          }}
        >
          TARTARY
        </motion.h1>
      </div>

      {/* ── Scroll hint at bottom ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[2]"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-1.5 rounded-full bg-white/40" />
        </motion.div>
      </motion.div>
    </div>
  );
}
