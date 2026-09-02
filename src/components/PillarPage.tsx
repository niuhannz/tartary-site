"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import StudioPageShell from "@/components/StudioPageShell";
import type { PillarContent } from "@/lib/pillarContent";

const ease = [0.23, 1, 0.32, 1] as const;

export default function PillarPage({ pillar }: { pillar: PillarContent }) {
  return (
    <StudioPageShell
      eyebrow={`${pillar.index} — ${pillar.label}`}
      title={pillar.title}
      subtitle={pillar.subtitle}
    >
      {/* ── Intro ── */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease }}
        className="text-base leading-relaxed max-w-2xl mb-16"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {pillar.intro}
      </motion.p>

      {/* ── Sub-product grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {pillar.subProducts.map((sp, i) => (
          <motion.div
            key={sp.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 + i * 0.08, ease }}
          >
            <Link
              href={`/${pillar.slug}/${sp.slug}`}
              className="group block h-full p-8 rounded-sm transition-colors duration-300 hover:bg-white/[0.03]"
              style={{
                border: "1px solid var(--border)",
                background: "var(--color-obsidian-warm)",
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <span className="t-micro" style={{ color: "var(--color-orange)" }}>
                  {pillar.index}.{String(i + 1).padStart(2, "0")}
                </span>
                {sp.status && (
                  <span className="t-micro" style={{ color: "var(--color-ash)" }}>
                    {sp.status}
                  </span>
                )}
              </div>

              <h2
                className="mt-6 text-2xl font-bold tracking-tight transition-colors duration-300"
                style={{
                  fontFamily: "var(--font-logo)",
                  color: "var(--color-bone)",
                }}
              >
                {sp.label}
              </h2>

              <p
                className="mt-3 text-[15px] leading-relaxed"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {sp.description}
              </p>

              <p
                className="mt-4 text-sm italic"
                style={{
                  fontFamily: "var(--font-editorial)",
                  color: "var(--color-parchment)",
                }}
              >
                {sp.tagline}
              </p>

              <span
                className="mt-6 inline-block t-label transition-colors duration-300"
                style={{ color: "var(--color-ash)", ["--accent" as string]: "var(--color-orange)" }}
              >
                <span className="link-under" style={{ color: "var(--color-parchment)" }}>
                  Explore →
                </span>
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </StudioPageShell>
  );
}
