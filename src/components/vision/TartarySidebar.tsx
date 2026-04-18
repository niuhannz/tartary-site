"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Material } from "./Material";
import { Text } from "./Text";
import { View } from "./View";
import { WindowControls } from "./WindowControls";

/* ═══════════════════════════════════════════════════
   TartarySidebar — Finder-style Material window

   Left pane: product navigation (Tartary OS, Mudflood)
   Right pane: product detail content with features
   Bottom: visionOS WindowControls
   ═══════════════════════════════════════════════════ */

interface Product {
  id: string;
  label: string;
  eyebrow: string;
  accentColor: string;
  icon: React.ReactNode;
  headline: string;
  description: string;
  features: { title: string; desc: string }[];
}

const products: Product[] = [
  {
    id: "tartary-os",
    label: "Tartary OS",
    eyebrow: "System 01",
    accentColor: "var(--color-orange)",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="14" rx="3" />
        <path d="M10 9L15 11.5L10 14V9Z" fill="currentColor" opacity="0.5" />
        <path d="M8 22H16" />
      </svg>
    ),
    headline: "AI-native cinematic creation for visionOS.",
    description:
      "Direct immersive films with spatial audio, volumetric scenes, and AI-driven cinematography — all from within Apple Vision Pro. From script to spatial scene, every step leverages the full power of visionOS.",
    features: [
      { title: "Spatial Direction", desc: "Hand gestures + gaze for composing shots in volumetric space" },
      { title: "AI Cinematography", desc: "Natural language → camera movement, lighting, composition" },
      { title: "Volumetric Rendering", desc: "Real-time PBR rendering optimized for Vision Pro" },
      { title: "Spatial Audio", desc: "Positional sound design integrated into the directing workflow" },
      { title: "Scene Intelligence", desc: "AI continuity, transitions, and visual coherence" },
      { title: "Export Pipeline", desc: "Apple Immersive Video, stereo 3D, or flat cinema formats" },
    ],
  },
  {
    id: "mudflood",
    label: "Mudflood",
    eyebrow: "System 02",
    accentColor: "oklch(0.7 0.18 290)",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 8L12 4L19 8V16L12 20L5 16V8Z" />
        <path d="M12 12V20" />
        <path d="M12 12L19 8" />
        <path d="M12 12L5 8" />
      </svg>
    ),
    headline: "AI-powered spatial game creation for visionOS.",
    description:
      "Build interactive worlds, design game mechanics, and playtest — all in the space around you. From concept to visionOS App Store, no traditional code required.",
    features: [
      { title: "Natural Language Design", desc: "Describe worlds and mechanics → playable prototypes in seconds" },
      { title: "Spatial World Building", desc: "Sculpt terrain and place objects with hand gestures" },
      { title: "Procedural Generation", desc: "AI-driven terrain, vegetation, architecture, NPC behavior" },
      { title: "Physics & Interaction", desc: "Spatial physics engine tuned for mixed reality" },
      { title: "Multiplayer Ready", desc: "SharePlay integration for collaborative spatial experiences" },
      { title: "App Store Pipeline", desc: "One-click export to visionOS app bundle" },
    ],
  },
];

export function TartarySidebar({ className }: { className?: string }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = products[activeIdx];

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <View
        material={{ thickness: "thick" }}
        className="w-full max-w-4xl xl:max-w-5xl isolate"
        style={{
          "--sidebar-width": "220px",
          "--content-height": "max(420px, 60dvh)",
        } as React.CSSProperties}
      >
        {/* Dark overlay on the glass */}
        <div className="absolute inset-0 z-[5] rounded-[var(--view-radius,34px)] bg-black/[0.15] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-[220px_1fr] min-h-[420px] sm:min-h-[60dvh]">
          {/* ── LEFT: Sidebar navigation ── */}
          <div className="flex flex-col bg-black/10 rounded-l-[var(--view-radius,34px)] overflow-hidden">
            {/* Header */}
            <div className="px-5 pt-6 pb-4">
              <Text size="title2" as="h2" style={{ fontFamily: "var(--font-display)" }}>
                Systems
              </Text>
            </div>

            {/* Product list */}
            <div className="flex-1 px-2 space-y-1">
              {products.map((product, idx) => (
                <button
                  key={product.id}
                  onClick={() => setActiveIdx(idx)}
                  className={cn(
                    "w-full flex items-center gap-3 rounded-full px-3 py-2.5 text-left transition-all duration-200",
                    "relative before:absolute before:inset-0 before:rounded-full before:transition-opacity before:duration-300",
                    "before:[background:linear-gradient(0deg,rgba(94,94,94,0.24)_0%,rgba(94,94,94,0.24)_100%),rgba(255,255,255,0.12)]",
                    activeIdx === idx
                      ? "before:opacity-75 text-white/90"
                      : "before:opacity-0 hover:before:opacity-40 text-white/50 hover:text-white/80"
                  )}
                >
                  <div
                    className="relative z-10 flex-shrink-0"
                    style={{ color: product.accentColor }}
                  >
                    {product.icon}
                  </div>
                  <div className="relative z-10 flex-1 min-w-0">
                    <Text
                      size="callout"
                      as="span"
                      className="block truncate font-medium !opacity-100"
                    >
                      {product.label}
                    </Text>
                    <Text size="caption1" variant="tertiary" as="span" className="block truncate">
                      {product.eyebrow}
                    </Text>
                  </div>
                </button>
              ))}
            </div>

            {/* Footer / brand */}
            <div className="px-5 py-4 mt-auto">
              <Text size="caption2" variant="tertiary" as="span" className="block" style={{ fontFamily: "var(--font-mono)" }}>
                TARTARY LLC
              </Text>
              <Text size="caption2" variant="tertiary" as="span">
                © 2026
              </Text>
            </div>
          </div>

          {/* ── RIGHT: Content area ── */}
          <div className="relative overflow-hidden rounded-r-[var(--view-radius,34px)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                className="h-full overflow-y-auto p-8 sm:p-10"
              >
                {/* Accent glow */}
                <div
                  className="absolute -top-32 -right-32 w-80 h-80 rounded-full blur-3xl opacity-[0.08] pointer-events-none"
                  style={{ background: active.accentColor }}
                />

                <div className="relative z-10">
                  {/* Eyebrow */}
                  <Text
                    size="caption1"
                    as="span"
                    className="block mb-2 font-semibold tracking-widest uppercase"
                    style={{ color: active.accentColor }}
                  >
                    {active.eyebrow}
                  </Text>

                  {/* Product name */}
                  <Text
                    size="XLTitle1"
                    as="h3"
                    className="tracking-tight mb-4"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {active.label}
                  </Text>

                  {/* Headline */}
                  <Text size="title3" variant="secondary" className="max-w-xl mb-3 !font-normal">
                    {active.headline}
                  </Text>

                  {/* Description */}
                  <Text size="body" variant="tertiary" className="max-w-xl mb-8">
                    {active.description}
                  </Text>

                  {/* Features grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {active.features.map((feat) => (
                      <Material
                        key={feat.title}
                        thickness="thinnest"
                        className="p-4 !min-h-0 !min-w-0 !rounded-2xl"
                      >
                        <div
                          className="w-1.5 h-1.5 rounded-full mb-2"
                          style={{ background: active.accentColor }}
                        />
                        <Text size="footnote" as="h4" className="font-semibold mb-1">
                          {feat.title}
                        </Text>
                        <Text size="caption1" variant="tertiary">
                          {feat.desc}
                        </Text>
                      </Material>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </View>

      {/* Window controls below the window */}
      <WindowControls className="mt-0" />
    </div>
  );
}
