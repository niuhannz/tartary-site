"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Material, MotionView, Text, WindowControls } from "@/components/vision";

const ease = [0.23, 1, 0.32, 1] as const;

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
};

/* ── Feature card using Material glass ── */
function FeatureItem({
  title,
  description,
  accentColor,
}: {
  title: string;
  description: string;
  accentColor: string;
}) {
  return (
    <Material thickness="normal" className="group transition-transform duration-300 hover:scale-[1.02]">
      <div className="p-6 sm:p-8">
        <div
          className="w-2 h-2 rounded-full mb-4"
          style={{ background: accentColor }}
        />
        <Text
          size="headline"
          as="h4"
          className="mb-2 tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </Text>
        <Text size="callout" variant="secondary">
          {description}
        </Text>
      </div>
    </Material>
  );
}

export default function SystemsPage() {
  return (
    <div className="relative">
      {/* ════════════════════════════════════════════
          HEADER
      ════════════════════════════════════════════ */}
      <section className="pt-32 sm:pt-40 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Material thickness="thinnest" className="inline-flex items-center gap-2 px-4 py-1.5 !rounded-full !min-h-0 !min-w-0 mb-6">
              <Text size="caption1" as="span" className="font-semibold tracking-widest uppercase" style={{ color: "var(--color-orange)" }}>
                02 — Systems
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
            Two systems.
            <br />
            One spatial future.
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease }}
          >
            <Text
              size="title3"
              variant="secondary"
              className="mt-6 max-w-2xl mx-auto !font-normal"
            >
              Purpose-built AI engines for Apple Vision Pro — one for cinematic
              storytelling, one for interactive worlds. Both native. Both
              unprecedented.
            </Text>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          TARTARY OS — Cinematic Content Creation
      ════════════════════════════════════════════ */}
      <section id="tartary-os" className="px-6 pb-32 scroll-mt-32">
        <div className="max-w-6xl mx-auto">
          <motion.div
            {...fadeUp}
            transition={{ duration: 1, ease }}
          >
            <Material thickness="thick" className="relative overflow-hidden mb-10">
              {/* Background accent glow */}
              <div
                className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl opacity-10"
                style={{ background: "var(--color-orange)" }}
              />

              <div className="relative z-10 p-10 sm:p-14">
                <div className="flex items-center gap-4 mb-8">
                  <Material thickness="thin" className="!min-h-0 !min-w-0 w-16 h-16 !rounded-2xl flex items-center justify-center" style={{ borderColor: "color-mix(in oklch, var(--color-orange) 25%, transparent)" }}>
                    <svg
                      width="32" height="32" viewBox="0 0 32 32" fill="none"
                      style={{ color: "var(--color-orange)" }}
                    >
                      <rect x="4" y="6" width="24" height="16" rx="3" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M13 11L20 14.5L13 18V11Z" fill="currentColor" opacity="0.6" />
                      <path d="M10 26H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </Material>
                  <div>
                    <Text size="caption1" as="span" className="block font-semibold tracking-widest uppercase" style={{ color: "var(--color-orange)" }}>
                      System 01
                    </Text>
                    <Text size="XLTitle2" as="h2" className="tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                      Tartary OS
                    </Text>
                  </div>
                </div>

                <Text size="title3" variant="secondary" className="max-w-3xl mb-4 !font-normal">
                  AI-native cinematic content creation for visionOS. Direct
                  immersive films with spatial audio, volumetric scenes, and
                  AI-driven cinematography — all from within Apple Vision Pro.
                </Text>
                <Text size="body" variant="tertiary" className="max-w-3xl">
                  Tartary OS reimagines the filmmaking pipeline for spatial
                  computing. From script to spatial scene, every step is
                  designed to leverage the full power of visionOS — hand
                  tracking for direction, eye tracking for focus, and AI
                  co-pilots that understand cinematic language.
                </Text>
              </div>

              {/* Window controls */}
              <div className="flex justify-center pb-3">
                <WindowControls className="relative bottom-0" />
              </div>
            </Material>
          </motion.div>

          {/* Features grid */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 1, delay: 0.2, ease }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <FeatureItem
              title="Spatial Direction"
              description="Use hand gestures and gaze to compose shots, place cameras, and direct actors in volumetric space."
              accentColor="var(--color-orange)"
            />
            <FeatureItem
              title="AI Cinematography"
              description="Describe your vision in natural language. The AI co-pilot translates intent into camera movement, lighting, and composition."
              accentColor="var(--color-orange)"
            />
            <FeatureItem
              title="Volumetric Rendering"
              description="Real-time volumetric scene rendering with physically-based materials optimized for Vision Pro's display system."
              accentColor="var(--color-orange)"
            />
            <FeatureItem
              title="Spatial Audio Engine"
              description="Positional audio design integrated into the directing workflow. Place, shape, and animate sound sources in 3D space."
              accentColor="var(--color-orange)"
            />
            <FeatureItem
              title="Scene Intelligence"
              description="AI understands scene context — suggesting transitions, matching continuity, and maintaining visual coherence across edits."
              accentColor="var(--color-orange)"
            />
            <FeatureItem
              title="Export Pipeline"
              description="Render to Apple Immersive Video, stereoscopic 3D, or flat cinema formats. One project, every screen."
              accentColor="var(--color-orange)"
            />
          </motion.div>
        </div>
      </section>

      {/* Divider */}
      <div className="px-6">
        <div className="max-w-6xl mx-auto hairline" />
      </div>

      {/* ════════════════════════════════════════════
          MUDFLOOD — Game Creation
      ════════════════════════════════════════════ */}
      <section id="mudflood" className="px-6 py-32 scroll-mt-32">
        <div className="max-w-6xl mx-auto">
          <motion.div
            {...fadeUp}
            transition={{ duration: 1, ease }}
          >
            <Material thickness="thick" className="relative overflow-hidden mb-10">
              {/* Background accent glow */}
              <div
                className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl opacity-10"
                style={{ background: "oklch(0.7 0.18 290)" }}
              />

              <div className="relative z-10 p-10 sm:p-14">
                <div className="flex items-center gap-4 mb-8">
                  <Material thickness="thin" className="!min-h-0 !min-w-0 w-16 h-16 !rounded-2xl flex items-center justify-center" style={{ borderColor: "color-mix(in oklch, oklch(0.7 0.18 290) 25%, transparent)" }}>
                    <svg
                      width="32" height="32" viewBox="0 0 32 32" fill="none"
                      style={{ color: "oklch(0.7 0.18 290)" }}
                    >
                      <path d="M7 10L16 5L25 10V20L16 25L7 20V10Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                      <path d="M16 15V25" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M16 15L25 10" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M16 15L7 10" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </Material>
                  <div>
                    <Text size="caption1" as="span" className="block font-semibold tracking-widest uppercase" style={{ color: "oklch(0.7 0.18 290)" }}>
                      System 02
                    </Text>
                    <Text size="XLTitle2" as="h2" className="tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                      Mudflood
                    </Text>
                  </div>
                </div>

                <Text size="title3" variant="secondary" className="max-w-3xl mb-4 !font-normal">
                  AI-powered spatial game creation for visionOS. Build
                  interactive worlds, design game mechanics, and playtest — all
                  in the space around you.
                </Text>
                <Text size="body" variant="tertiary" className="max-w-3xl">
                  Mudflood turns game development into a spatial conversation.
                  Describe a world, sculpt terrain with your hands, define
                  rules in natural language, and watch AI generate playable
                  experiences in real time. From concept to visionOS App Store
                  — no traditional code required.
                </Text>
              </div>

              {/* Window controls */}
              <div className="flex justify-center pb-3">
                <WindowControls className="relative bottom-0" />
              </div>
            </Material>
          </motion.div>

          {/* Features grid */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 1, delay: 0.2, ease }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <FeatureItem
              title="Natural Language Design"
              description="Describe game worlds, characters, and mechanics in plain English. AI generates playable prototypes in seconds."
              accentColor="oklch(0.7 0.18 290)"
            />
            <FeatureItem
              title="Spatial World Building"
              description="Sculpt terrain, place objects, and design environments using hand gestures in your physical space."
              accentColor="oklch(0.7 0.18 290)"
            />
            <FeatureItem
              title="Procedural Generation"
              description="AI-driven procedural systems for terrain, vegetation, architecture, and NPC behavior that evolve with your design intent."
              accentColor="oklch(0.7 0.18 290)"
            />
            <FeatureItem
              title="Physics & Interaction"
              description="Built-in spatial physics engine tuned for visionOS. Objects behave naturally in mixed reality without manual configuration."
              accentColor="oklch(0.7 0.18 290)"
            />
            <FeatureItem
              title="Multiplayer Ready"
              description="SharePlay integration from day one. Design collaborative and competitive spatial experiences for groups."
              accentColor="oklch(0.7 0.18 290)"
            />
            <FeatureItem
              title="App Store Pipeline"
              description="One-click export to visionOS app bundle. Mudflood handles code generation, optimization, and submission preparation."
              accentColor="oklch(0.7 0.18 290)"
            />
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          BOTTOM CTA
      ════════════════════════════════════════════ */}
      <section className="px-6 pb-32">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            {...fadeUp}
            transition={{ duration: 1, ease }}
          >
            <Material thickness="thick" className="p-12 sm:p-16">
              <Text
                size="XLTitle2"
                as="h3"
                className="tracking-tight mb-4 glass-text-glow"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Ready to build the future?
              </Text>
              <Text size="body" variant="secondary" className="max-w-lg mx-auto mb-8">
                We&apos;re looking for visionary creators, developers, and
                storytellers to shape spatial computing with us.
              </Text>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Link
                  href="/contact"
                  className="inline-flex items-center px-7 py-3.5 rounded-full text-sm font-semibold transition-all duration-300"
                  style={{
                    background: "linear-gradient(135deg, var(--color-orange), oklch(0.7 0.18 290))",
                    color: "white",
                    boxShadow: "0 8px 32px oklch(0.75 0.15 250 / 0.3)",
                  }}
                >
                  Get in Touch
                </Link>
                <Link href="/world">
                  <Material thickness="thin" className="!rounded-full !min-h-0 !min-w-0 inline-flex">
                    <span className="px-7 py-3.5 text-sm font-semibold text-white/60 hover:text-white/90 transition-colors">
                      Explore Universe
                    </span>
                  </Material>
                </Link>
              </div>

              {/* Window controls */}
              <div className="flex justify-center mt-6">
                <WindowControls className="relative bottom-0" />
              </div>
            </Material>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative px-6 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="hairline w-full mb-8" />
          <div
            className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs"
            style={{ color: "var(--color-ash)" }}
          >
            <span>© 2026 Tartary LLC. All rights reserved.</span>
            <div className="flex items-center gap-6">
              <Link href="/contact" className="hover:text-white/60 transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
