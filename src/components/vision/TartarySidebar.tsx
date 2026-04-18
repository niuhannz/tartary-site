"use client";

import { AnimatePresence, motion, useDragControls } from "framer-motion";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Material } from "./Material";
import { Text } from "./Text";
import { View } from "./View";
import { WindowControls } from "./WindowControls";
import { BorderBeam } from "@/components/magicui/BorderBeam";

/* ═══════════════════════════════════════════════════
   TartarySidebar — Draggable Finder-style Material window

   Enhanced with:
   - Framer Motion drag (OS-like window movement)
   - BorderBeam glow effect around the window
   - Animated SVG icons with hover states
   - Richer content layout with feature cards
   - Shimmer CTA button
   ═══════════════════════════════════════════════════ */

interface Product {
  id: string;
  label: string;
  eyebrow: string;
  accentColor: string;
  icon: React.ReactNode;
  headline: string;
  description: string;
  features: { title: string; desc: string; icon: React.ReactNode }[];
}

/* ── Animated SVG Icons ── */
const CinemaIcon = ({ color }: { color: string }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <motion.rect
      x="2" y="4" width="20" height="14" rx="3"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
    />
    <motion.path
      d="M10 9L15 11.5L10 14V9Z"
      fill={color}
      fillOpacity="0.3"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.5, duration: 0.4, type: "spring" }}
    />
    <motion.path
      d="M8 22H16"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.8, duration: 0.5 }}
    />
  </svg>
);

const CubeIcon = ({ color }: { color: string }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <motion.path
      d="M5 8L12 4L19 8V16L12 20L5 16V8Z"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
    />
    <motion.path d="M12 12V20" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6, duration: 0.5 }} />
    <motion.path d="M12 12L19 8" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.8, duration: 0.5 }} />
    <motion.path d="M12 12L5 8" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1, duration: 0.5 }} />
  </svg>
);

/* ── Micro Feature Icons ── */
const FeatureIcon = ({ children }: { children: React.ReactNode }) => (
  <div className="w-5 h-5 flex items-center justify-center opacity-60">
    {children}
  </div>
);

const HandIcon = () => (
  <FeatureIcon>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M18 11V7a2 2 0 0 0-4 0v3m0 0V5a2 2 0 0 0-4 0v6m0 0V4a2 2 0 0 0-4 0v9l-1.8-1.8a2 2 0 0 0-2.83 2.83L8 21h8a4 4 0 0 0 4-4v-6a2 2 0 0 0-4 0v0" />
    </svg>
  </FeatureIcon>
);

const WandIcon = () => (
  <FeatureIcon>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M15 4V2m0 2v2m0-2h2m-2 0h-2" /><path d="M8 16l-5 5" /><path d="M21 3l-8.5 8.5" />
    </svg>
  </FeatureIcon>
);

const CubeSmIcon = () => (
  <FeatureIcon>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M5 8L12 4L19 8V16L12 20L5 16V8Z" />
    </svg>
  </FeatureIcon>
);

const SpeakerIcon = () => (
  <FeatureIcon>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M11 5L6 9H2v6h4l5 4V5z" /><path d="M19.07 4.93a10 10 0 010 14.14" />
    </svg>
  </FeatureIcon>
);

const BrainIcon = () => (
  <FeatureIcon>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M12 2a7 7 0 017 7c0 3-2 5-4 6v3H9v-3c-2-1-4-3-4-6a7 7 0 017-7z" />
    </svg>
  </FeatureIcon>
);

const ExportIcon = () => (
  <FeatureIcon>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  </FeatureIcon>
);

const GlobeIcon = () => (
  <FeatureIcon>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  </FeatureIcon>
);

const PhysicsIcon = () => (
  <FeatureIcon>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="3" /><path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
    </svg>
  </FeatureIcon>
);

const UsersIcon = () => (
  <FeatureIcon>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
    </svg>
  </FeatureIcon>
);

const RocketIcon = () => (
  <FeatureIcon>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z" />
    </svg>
  </FeatureIcon>
);

const TextIcon = () => (
  <FeatureIcon>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M4 7V4h16v3" /><line x1="12" y1="4" x2="12" y2="20" /><line x1="8" y1="20" x2="16" y2="20" />
    </svg>
  </FeatureIcon>
);

const MountainIcon = () => (
  <FeatureIcon>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M8 3l4 8 5-5 5 15H2L8 3z" />
    </svg>
  </FeatureIcon>
);


const products: Product[] = [
  {
    id: "tartary-os",
    label: "Tartary OS",
    eyebrow: "System 01",
    accentColor: "var(--color-orange)",
    icon: <CinemaIcon color="var(--color-orange)" />,
    headline: "AI-native cinematic creation for visionOS.",
    description:
      "Direct immersive films with spatial audio, volumetric scenes, and AI-driven cinematography — all from within Apple Vision Pro.",
    features: [
      { title: "Spatial Direction", desc: "Hand gestures + gaze for composing shots in volumetric space", icon: <HandIcon /> },
      { title: "AI Cinematography", desc: "Natural language to camera movement, lighting, composition", icon: <WandIcon /> },
      { title: "Volumetric Rendering", desc: "Real-time PBR rendering optimized for Vision Pro", icon: <CubeSmIcon /> },
      { title: "Spatial Audio", desc: "Positional sound design integrated into the directing workflow", icon: <SpeakerIcon /> },
      { title: "Scene Intelligence", desc: "AI continuity, transitions, and visual coherence", icon: <BrainIcon /> },
      { title: "Export Pipeline", desc: "Apple Immersive Video, stereo 3D, or flat cinema formats", icon: <ExportIcon /> },
    ],
  },
  {
    id: "mudflood",
    label: "Mudflood",
    eyebrow: "System 02",
    accentColor: "oklch(0.7 0.18 290)",
    icon: <CubeIcon color="oklch(0.7 0.18 290)" />,
    headline: "AI-powered spatial game creation for visionOS.",
    description:
      "Build interactive worlds, design game mechanics, and playtest — all in the space around you. No traditional code required.",
    features: [
      { title: "Natural Language Design", desc: "Describe worlds and mechanics, get playable prototypes", icon: <TextIcon /> },
      { title: "Spatial World Building", desc: "Sculpt terrain and place objects with hand gestures", icon: <MountainIcon /> },
      { title: "Procedural Generation", desc: "AI-driven terrain, vegetation, architecture, NPC behavior", icon: <GlobeIcon /> },
      { title: "Physics & Interaction", desc: "Spatial physics engine tuned for mixed reality", icon: <PhysicsIcon /> },
      { title: "Multiplayer Ready", desc: "SharePlay integration for collaborative spatial experiences", icon: <UsersIcon /> },
      { title: "App Store Pipeline", desc: "One-click export to visionOS app bundle", icon: <RocketIcon /> },
    ],
  },
];

export function TartarySidebar({ className }: { className?: string }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = products[activeIdx];
  const dragControls = useDragControls();
  const constraintsRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={constraintsRef} className={cn("flex flex-col items-center relative", className)}>
      {/* ── Draggable window container ── */}
      <motion.div
        drag
        dragControls={dragControls}
        dragListener={false}
        dragMomentum={false}
        dragElastic={0.1}
        dragConstraints={constraintsRef}
        whileDrag={{ scale: 1.01, cursor: "grabbing" }}
        className="w-full max-w-4xl xl:max-w-5xl relative"
      >
        <View
          material={{ thickness: "thick" }}
          className="w-full isolate"
          style={{
            "--sidebar-width": "220px",
            "--content-height": "max(420px, 60dvh)",
          } as React.CSSProperties}
        >
          {/* Border beam glow effect */}
          <BorderBeam
            size={120}
            duration={12}
            colorFrom="#FF6600"
            colorTo="oklch(0.7 0.18 290)"
            borderWidth={1.5}
          />

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
                  <motion.button
                    key={product.id}
                    onClick={() => setActiveIdx(idx)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className={cn(
                      "w-full flex items-center gap-3 rounded-full px-3 py-2.5 text-left transition-all duration-200",
                      "relative before:absolute before:inset-0 before:rounded-full before:transition-opacity before:duration-300",
                      "before:[background:linear-gradient(0deg,rgba(94,94,94,0.24)_0%,rgba(94,94,94,0.24)_100%),rgba(255,255,255,0.12)]",
                      activeIdx === idx
                        ? "before:opacity-75 text-white/90"
                        : "before:opacity-0 hover:before:opacity-40 text-white/50 hover:text-white/80"
                    )}
                  >
                    <div className="relative z-10 flex-shrink-0">{product.icon}</div>
                    <div className="relative z-10 flex-1 min-w-0">
                      <Text size="callout" as="span" className="block truncate font-medium !opacity-100">
                        {product.label}
                      </Text>
                      <Text size="caption1" variant="tertiary" as="span" className="block truncate">
                        {product.eyebrow}
                      </Text>
                    </div>
                    {/* Active indicator dot */}
                    {activeIdx === idx && (
                      <motion.div
                        layoutId="sidebar-active-dot"
                        className="relative z-10 w-1.5 h-1.5 rounded-full"
                        style={{ background: product.accentColor }}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Separator */}
              <div className="mx-4 my-2 h-px bg-white/[0.06]" />

              {/* Footer / brand */}
              <div className="px-5 py-4 mt-auto">
                <Text size="caption2" variant="tertiary" as="span" className="block" style={{ fontFamily: "var(--font-mono)" }}>
                  TARTARY LLC
                </Text>
                <Text size="caption2" variant="tertiary" as="span">
                  &copy; 2026
                </Text>
              </div>
            </div>

            {/* ── RIGHT: Content area ── */}
            <div className="relative overflow-hidden rounded-r-[var(--view-radius,34px)]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
                  transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                  className="h-full overflow-y-auto p-8 sm:p-10"
                >
                  {/* Accent glow */}
                  <div
                    className="absolute -top-32 -right-32 w-80 h-80 rounded-full blur-3xl opacity-[0.1] pointer-events-none animate-pulse-glow"
                    style={{ background: active.accentColor }}
                  />

                  <div className="relative z-10">
                    {/* Eyebrow */}
                    <Text
                      size="caption1" as="span"
                      className="block mb-2 font-semibold tracking-widest uppercase"
                      style={{ color: active.accentColor }}
                    >
                      {active.eyebrow}
                    </Text>

                    {/* Product name */}
                    <Text
                      size="XLTitle1" as="h3"
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
                      {active.features.map((feat, fi) => (
                        <motion.div
                          key={feat.title}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: fi * 0.06 + 0.2, duration: 0.4 }}
                        >
                          <Material
                            thickness="thinnest"
                            className="p-4 !min-h-0 !min-w-0 !rounded-2xl group/feat hover:bg-white/[0.03] transition-colors duration-300"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <div style={{ color: active.accentColor }}>
                                {feat.icon}
                              </div>
                              <Text size="footnote" as="h4" className="font-semibold">
                                {feat.title}
                              </Text>
                            </div>
                            <Text size="caption1" variant="tertiary">
                              {feat.desc}
                            </Text>
                          </Material>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </View>

        {/* Window controls below — grab bar triggers drag */}
        <WindowControls
          className="mt-0"
          onStartDrag={(e: React.PointerEvent) => dragControls.start(e)}
        />
      </motion.div>
    </div>
  );
}
