"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { universeMapContent, universeMarkers, type UniverseMarker } from "@/lib/siteContent";
import InfoPanel from "./InfoPanel";
import StaticMap from "./StaticMap";

const ThreeScene = dynamic(() => import("./ThreeScene"), { ssr: false });

function supportsWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function UniverseExplorer() {
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [selected, setSelected] = useState<UniverseMarker | null>(null);
  const [hover, setHover] = useState<{ marker: UniverseMarker; x: number; y: number } | null>(null);

  useEffect(() => {
    setWebgl(supportsWebGL());
    // optional deep-link: /universe?focus=<id> flies straight to that world
    const q = new URLSearchParams(window.location.search);
    const f = q.get("focus") ?? q.get("w");
    if (f) {
      const m = universeMarkers.find((x) => x.id === f);
      if (m) setSelected(m);
    }
  }, []);

  const handleSelect = useCallback((m: UniverseMarker) => {
    setSelected(m);
    setHover(null);
  }, []);

  const handleHover = useCallback((m: UniverseMarker | null, x: number, y: number) => {
    setHover(m ? { marker: m, x, y } : null);
  }, []);

  const focusId = selected?.id ?? null;

  const tooltipLeft = hover ? Math.max(8, Math.min(hover.x + 18, (typeof window !== "undefined" ? window.innerWidth : 1200) - 240)) : 0;
  const tooltipTop = hover ? Math.max(8, Math.min(hover.y + 18, (typeof window !== "undefined" ? window.innerHeight : 800) - 90)) : 0;

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: "100dvh", minHeight: "100vh", background: "#05060c" }}
    >
      {/* ── scene / fallback ── */}
      {webgl === false ? (
        <StaticMap markers={universeMarkers} onSelect={handleSelect} />
      ) : (
        <ThreeScene markers={universeMarkers} focusId={focusId} onSelect={handleSelect} onHover={handleHover} />
      )}

      {/* ── vignette ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 40%, transparent 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* ═══ overlay UI ═══ */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between">
        {/* ── top-left intro ── */}
        <div className="px-6 sm:px-10 pt-24 sm:pt-28 max-w-xl">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="t-micro block mb-3"
            style={{ color: "var(--color-orange)" }}
          >
            {universeMapContent.eyebrow}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-bold tracking-tight leading-[1.05]"
            style={{ fontFamily: "var(--font-logo)", color: "var(--color-bone)", textShadow: "0 0 60px rgba(0,0,0,0.6)" }}
          >
            {universeMapContent.headline}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-4 text-base sm:text-lg max-w-md leading-relaxed"
            style={{ fontFamily: "var(--font-editorial)", fontStyle: "italic", color: "var(--color-parchment)", textShadow: "0 1px 12px rgba(0,0,0,0.7)" }}
          >
            {universeMapContent.sub}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="mt-4 t-micro"
            style={{ color: "var(--color-ash)" }}
          >
            {universeMapContent.hint}
          </motion.p>
        </div>

        {/* ── bottom bar: hot-links + CTA ── */}
        <div className="px-6 sm:px-10 pb-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
          <motion.nav
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap gap-2 pointer-events-auto"
          >
            {universeMapContent.hotLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="px-4 py-2 rounded-full text-[12px] font-semibold tracking-[0.12em] uppercase transition-all duration-200 hover:text-white"
                style={{
                  fontFamily: "var(--font-logo)",
                  color: "var(--color-parchment)",
                  border: "1px solid var(--border)",
                  background: "rgba(10, 8, 8, 0.45)",
                  backdropFilter: "blur(10px)",
                }}
              >
                {l.label}
              </Link>
            ))}
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="pointer-events-auto"
          >
            <Link
              href={universeMapContent.ctaHref}
              className="inline-flex px-7 py-3.5 rounded-full text-[13px] font-semibold tracking-[0.12em] uppercase transition-opacity hover:opacity-90"
              style={{ fontFamily: "var(--font-logo)", background: "var(--color-orange)", color: "#0A0808" }}
            >
              {universeMapContent.cta}
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ── hover tooltip ── */}
      <AnimatePresence>
        {hover && !selected && (
          <motion.div
            key={hover.marker.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="fixed z-40 pointer-events-none px-4 py-2.5 rounded-lg max-w-[220px]"
            style={{
              left: tooltipLeft,
              top: tooltipTop,
              background: "rgba(13, 11, 9, 0.9)",
              border: "1px solid var(--border)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div className="text-[12px] font-bold tracking-wide" style={{ fontFamily: "var(--font-logo)", color: "var(--color-bone)" }}>
              {hover.marker.name}
            </div>
            <div className="text-[10px] mt-0.5 t-micro" style={{ color: "var(--color-ash)" }}>
              {hover.marker.sublabel}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── info panel ── */}
      <AnimatePresence>
        {selected && <InfoPanel marker={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}
