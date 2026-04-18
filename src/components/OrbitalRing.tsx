"use client";

import { motion } from "framer-motion";

interface OrbitalRingProps {
  size: number;
  duration: number;
  opacity: number;
  delay?: number;
}

export default function OrbitalRing({
  size,
  duration,
  opacity,
  delay = 0,
}: OrbitalRingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1, rotate: 360 }}
      transition={{
        opacity: { duration: 2, delay },
        scale: { duration: 2, delay },
        rotate: { duration, repeat: Infinity, ease: "linear" },
      }}
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        border: `1px solid oklch(1 0 0 / ${opacity})`,
        transform: "rotateX(60deg)",
      }}
    />
  );
}
