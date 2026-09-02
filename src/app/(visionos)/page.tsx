"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Material, Text } from "@/components/vision";
import { RetroGrid } from "@/components/magicui";
import { homeContent, techProducts } from "@/lib/siteContent";

const ease = [0.23, 1, 0.32, 1] as const;

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
};

export default function HomePage() {
  const h = homeContent;

  return (
    <div className="relative">
      {/* ════════════════════════════════════════
          HERO
      ════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-28 pb-20 overflow-hidden">
        <RetroGrid opacity={0.35} angle={70} cellSize={70} />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Material thickness="thinnest" className="inline-flex items-center gap-2 px-4 py-1.5 !rounded-full !min-h-0 !min-w-0 mb-8">
              <Text size="caption1" as="span" className="font-semibold tracking-[0.2em] uppercase" style={{ color: "var(--color-orange)" }}>
                {h.eyebrow}
              </Text>
            </Material>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease }}
            className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[0.95] glass-text-glow"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {h.headline}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease }}
          >
            <Text size="title3" variant="secondary" className="mt-7 max-w-2xl mx-auto !font-normal">
              {h.subheadline}
            </Text>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease }}
            className="mt-10 flex items-center justify-center gap-4 flex-wrap"
          >
            <Link
              href="/universe"
              className="inline-flex items-center px-8 py-3.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, var(--color-orange), #c44d00)",
                color: "white",
                boxShadow: "0 8px 32px rgba(255,102,0,0.25)",
              }}
            >
              {h.primaryCta}
            </Link>
            <Link href="/book-demo">
              <Material thickness="thin" className="!rounded-full !min-h-0 !min-w-0 inline-flex">
                <span className="px-8 py-3.5 text-sm font-semibold text-white/70 hover:text-white transition-colors">
                  {h.secondaryCta}
                </span>
              </Material>
            </Link>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-1.5 rounded-full bg-white/40" />
          </motion.div>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════
          TECHNOLOGY
      ════════════════════════════════════════ */}
      <section className="px-6 pb-32">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp} transition={{ duration: 0.9, ease }}>
            <Text size="caption1" as="span" className="block font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "var(--color-orange)" }}>
              01 — Technology
            </Text>
            <Text size="XLTitle2" as="h2" className="tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              {h.technologySection.title}
            </Text>
            <Text size="title3" variant="secondary" className="mt-4 max-w-2xl !font-normal">
              {h.technologySection.subtitle}
            </Text>
          </motion.div>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {techProducts.map((p, i) => (
              <motion.div
                key={p.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: i * 0.1, ease }}
              >
                <Link href={`/technology/${p.slug}`} className="block h-full">
                  <Material thickness="normal" className="glass-panel-hover h-full">
                    <div className="p-8 flex flex-col h-full">
                      <Text size="caption1" as="span" className="font-semibold tracking-[0.15em] uppercase" style={{ color: "var(--color-orange)" }}>
                        {String(i + 1).padStart(2, "0")}
                      </Text>
                      <Text size="headline" as="h3" className="mt-5 tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                        {p.name}
                      </Text>
                      <Text size="callout" variant="secondary" className="mt-3 flex-1">
                        {p.sub}
                      </Text>
                      <span className="mt-6 text-[13px] font-semibold tracking-[0.12em] uppercase" style={{ color: "var(--color-bone)" }}>
                        Book a Demo →
                      </span>
                    </div>
                  </Material>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          IP UNIVERSE
      ════════════════════════════════════════ */}
      <section className="px-6 pb-32">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp} transition={{ duration: 0.9, ease }}>
            <Text size="caption1" as="span" className="block font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "var(--color-orange)" }}>
              02 — IP Universe
            </Text>
            <Text size="XLTitle2" as="h2" className="tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              {h.universeSection.title}
            </Text>
            <Text size="title3" variant="secondary" className="mt-4 max-w-2xl !font-normal">
              {h.universeSection.subtitle}
            </Text>
          </motion.div>

          <div className="mt-12 grid sm:grid-cols-3 gap-5">
            {h.universeSection.preview.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: i * 0.1, ease }}
              >
                <Material thickness="thin" className="glass-panel-hover h-full">
                  <div className="p-8">
                    <Text size="headline" as="h3" className="tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                      {item.label}
                    </Text>
                    <Text size="callout" variant="secondary" className="mt-3">
                      {item.text}
                    </Text>
                  </div>
                </Material>
              </motion.div>
            ))}
          </div>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.8, ease }}
            className="mt-10 flex items-center gap-4 flex-wrap"
          >
            <Link
              href="/universe"
              className="inline-flex items-center px-8 py-3.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, var(--color-orange), #c44d00)",
                color: "white",
                boxShadow: "0 8px 32px rgba(255,102,0,0.25)",
              }}
            >
              {h.universeSection.ctaPrimary}
            </Link>
            <Link href="/universe/licensing">
              <Material thickness="thin" className="!rounded-full !min-h-0 !min-w-0 inline-flex">
                <span className="px-8 py-3.5 text-sm font-semibold text-white/70 hover:text-white transition-colors">
                  {h.universeSection.ctaSecondary}
                </span>
              </Material>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SYNERGY
      ════════════════════════════════════════ */}
      <section className="px-6 pb-32">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeUp} transition={{ duration: 0.9, ease }}>
            <Material thickness="thick" className="p-10 sm:p-14 text-center">
              <Text size="XLTitle2" as="h3" className="tracking-tight mb-5" style={{ fontFamily: "var(--font-display)" }}>
                {h.synergy.title}
              </Text>
              <Text size="title3" variant="secondary" className="max-w-2xl mx-auto !font-normal">
                {h.synergy.body}
              </Text>
            </Material>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative px-6 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="hairline w-full mb-8" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs" style={{ color: "var(--color-ash)" }}>
            <span>© 2026 TARTARY. All rights reserved.</span>
            <div className="flex items-center gap-6">
              <Link href="/technology" className="hover:text-white/60 transition-colors">Technology</Link>
              <Link href="/universe" className="hover:text-white/60 transition-colors">IP Universe</Link>
              <Link href="/compliance" className="hover:text-white/60 transition-colors">IP &amp; Compliance</Link>
              <Link href="/book-demo" className="hover:text-white/60 transition-colors">Book Demo</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
