"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { UniverseMarker } from "@/lib/siteContent";

const KIND_LABEL: Record<UniverseMarker["kind"], string> = {
  world: "World",
  character: "Character",
  story: "Story",
};

const KIND_COLOR: Record<UniverseMarker["kind"], string> = {
  world: "#FF6600",
  character: "#b9d0ff",
  story: "#e7c77a",
};

export default function InfoPanel({
  marker,
  onClose,
}: {
  marker: UniverseMarker;
  onClose: () => void;
}) {
  return (
    <motion.aside
      key={marker.id}
      initial={{ x: 420, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 420, opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className="absolute top-0 right-0 bottom-0 w-[min(400px,88vw)] z-30 flex flex-col overflow-hidden"
      style={{
        background: "rgba(13, 11, 9, 0.82)",
        backdropFilter: "blur(28px) saturate(1.3)",
        WebkitBackdropFilter: "blur(28px) saturate(1.3)",
        borderLeft: "1px solid var(--border)",
      }}
    >
      {/* header */}
      <div className="px-7 pt-7 pb-5 flex items-start justify-between" style={{ borderBottom: "1px solid var(--border)" }}>
        <div>
          <div
            className="t-micro mb-2"
            style={{ color: KIND_COLOR[marker.kind] }}
          >
            {KIND_LABEL[marker.kind]} · {marker.sublabel}
          </div>
          <h2
            className="text-2xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-logo)", color: "var(--color-bone)" }}
          >
            {marker.name}
          </h2>
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="w-9 h-9 flex items-center justify-center rounded-full transition-colors hover:bg-white/10"
          style={{ color: "var(--color-parchment)" }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </button>
      </div>

      {/* body */}
      <div className="px-7 py-6 overflow-y-auto flex-1">
        <p
          className="text-[15px] leading-relaxed italic mb-6"
          style={{ fontFamily: "var(--font-editorial)", color: "var(--color-parchment)" }}
        >
          “{marker.tagline}”
        </p>

        <p
          className="text-sm leading-relaxed mb-8"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {marker.lore}
        </p>

        {/* facts */}
        <div className="mb-8">
          {marker.facts.map((f) => (
            <div
              key={f.label}
              className="flex items-center justify-between py-2.5"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <span className="t-label" style={{ color: "var(--color-ash)" }}>
                {f.label}
              </span>
              <span className="text-[13px] text-right" style={{ color: "var(--color-bone)" }}>
                {f.value}
              </span>
            </div>
          ))}
        </div>

        {/* concept-art frames (placeholders) */}
        <div className="mb-8">
          <div className="t-micro mb-3">Concept art</div>
          <div className="grid grid-cols-2 gap-2">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="aspect-[4/5] relative overflow-hidden"
                style={{
                  background: `linear-gradient(160deg, ${
                    marker.kind === "world" ? "#1a1208" : marker.kind === "character" ? "#0c1220" : "#16110a"
                  } 0%, #0a0808 100%)`,
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  className="absolute inset-0 opacity-40"
                  style={{
                    backgroundImage: `radial-gradient(ellipse 60% 40% at 30% 30%, ${KIND_COLOR[marker.kind]}33, transparent 70%)`,
                  }}
                />
                <span
                  className="absolute bottom-2 left-2 text-[9px] tracking-wider uppercase"
                  style={{ color: "var(--color-ash)" }}
                >
                  {marker.name} — {String(i + 1).padStart(2, "0")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* footer CTA */}
      <div className="px-7 py-5" style={{ borderTop: "1px solid var(--border)" }}>
        <Link
          href={marker.href}
          className="flex items-center justify-center w-full px-6 py-3.5 rounded-full text-[13px] font-semibold tracking-[0.12em] uppercase transition-opacity hover:opacity-90"
          style={{ fontFamily: "var(--font-logo)", background: KIND_COLOR[marker.kind], color: "#0A0808" }}
        >
          {marker.hrefLabel} →
        </Link>
      </div>
    </motion.aside>
  );
}
