"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ReactNode } from "react";

interface StudioPageShellProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export default function StudioPageShell({
  eyebrow,
  title,
  subtitle,
  children,
}: StudioPageShellProps) {
  return (
    <div className="min-h-screen">
      <section className="pt-32 sm:pt-40 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {eyebrow && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-xs font-semibold tracking-widest uppercase block mb-4"
              style={{ color: "var(--color-text-muted)" }}            >
              {eyebrow}
            </motion.span>
          )}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="text-5xl sm:text-6xl font-bold tracking-tight leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-4 text-lg max-w-2xl leading-relaxed"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      </section>

      {children && (
        <section className="px-6 pb-32">
          <div className="max-w-4xl mx-auto">{children}</div>        </section>
      )}

      {/* Footer */}
      <footer className="px-6 pb-12">
        <div className="max-w-6xl mx-auto">
          <div
            className="h-px w-full mb-8"
            style={{ background: "var(--color-glass-border)" }}
          />
          <div
            className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs"
            style={{ color: "var(--color-text-muted)" }}
          >
            <span>© 2026 Tartary LLC. All rights reserved.</span>
            <div className="flex items-center gap-6">
              <Link
                href="/contact"
                className="hover:text-white/60 transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}