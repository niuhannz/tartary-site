"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ReactNode } from "react";

interface GlassCardProps {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  accentColor: string;
  icon: ReactNode;
}

export default function GlassCard({
  href,
  eyebrow,
  title,
  description,
  accentColor,
  icon,
}: GlassCardProps) {
  return (
    <Link href={href} className="block group">
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="glass-panel relative overflow-hidden p-8 sm:p-10 h-full"
      >
        {/* Accent glow */}
        <div
          className="absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl"
          style={{ background: accentColor }}
        />

        {/* Icon */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
          style={{
            background: `color-mix(in oklch, ${accentColor} 15%, transparent)`,
            color: accentColor,
            border: `1px solid color-mix(in oklch, ${accentColor} 20%, transparent)`,
          }}
        >
          {icon}
        </div>

        {/* Content */}
        <span
          className="text-xs font-semibold tracking-widest uppercase block mb-3"
          style={{ color: accentColor }}
        >
          {eyebrow}
        </span>
        <h3
          className="text-2xl sm:text-3xl font-bold tracking-tight mb-3"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </h3>
        <p
          className="text-sm leading-relaxed max-w-md"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {description}
        </p>

        {/* Arrow */}
        <div className="mt-6 flex items-center gap-2 text-sm font-medium">
          <span style={{ color: accentColor }}>Learn more</span>
          <motion.svg
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
          </motion.svg>
        </div>
      </motion.div>
    </Link>
  );
}
