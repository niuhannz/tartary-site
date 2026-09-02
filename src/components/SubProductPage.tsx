"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import StudioPageShell from "@/components/StudioPageShell";
import type { PillarContent, SubProductContent } from "@/lib/pillarContent";

const ease = [0.23, 1, 0.32, 1] as const;

export default function SubProductPage({
  pillar,
  sub,
}: {
  pillar: PillarContent;
  sub: SubProductContent;
}) {
  return (
    <StudioPageShell eyebrow={`${pillar.label} — ${sub.label}`} title={sub.label} subtitle={sub.tagline}>
      {/* ── Status line ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.25 }}
        className="flex items-center gap-3 mb-10"
      >
        <span className="t-micro" style={{ color: "var(--color-orange)" }}>
          {sub.description}
        </span>
        {sub.status && (
          <>
            <span className="w-3 h-px" style={{ background: "var(--border)" }} />
            <span className="t-micro">{sub.status}</span>
          </>
        )}
      </motion.div>

      {/* ── Body ── */}
      <div className="space-y-6 max-w-2xl">
        {sub.body.map((para, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 + i * 0.12, ease }}
            className="text-base leading-relaxed"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {para}
          </motion.p>
        ))}
      </div>

      {/* ── Back to pillar ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mt-16"
      >
        <div className="hairline w-full mb-8" />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href={`/${pillar.slug}`}
            className="t-label transition-colors duration-200 hover:text-white"
            style={{ color: "var(--color-parchment)" }}
          >
            ← {pillar.label}
          </Link>
          <div className="flex flex-wrap items-center gap-5">
            {pillar.subProducts
              .filter((s) => s.slug !== sub.slug)
              .map((s) => (
                <Link
                  key={s.slug}
                  href={`/${pillar.slug}/${s.slug}`}
                  className="t-micro transition-colors duration-200 hover:text-white"
                >
                  {s.label}
                </Link>
              ))}
          </div>
        </div>
      </motion.div>
    </StudioPageShell>
  );
}
