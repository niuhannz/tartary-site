"use client";

import { memo, useEffect, useLayoutEffect, useMemo, useState } from "react";
import {
  AnimatePresence,
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { Material } from "./Material";
import { Text } from "./Text";
import { BorderBeam } from "@/components/magicui/BorderBeam";

/* ═══════════════════════════════════════════════════
   ProductCarousel — 3D rotating cylinder of product cards

   Adapted from cult-ui's ThreeDPhotoCarousel.
   Each card is a glassmorphic Material panel showing a
   Tartary product. Drag to spin, click to expand into
   a full detail view with features list.

   Geometry: Cards are placed around a CSS 3D cylinder
   using rotateY + translateZ. The cylinder radius is
   derived from circumference / (2 * PI).
   ═══════════════════════════════════════════════════ */

// ── SSR-safe layout effect ──
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function useMediaQuery(
  query: string,
  { defaultValue = false }: { defaultValue?: boolean } = {}
): boolean {
  const getMatches = (q: string) =>
    typeof window !== "undefined" ? window.matchMedia(q).matches : defaultValue;

  const [matches, setMatches] = useState(() => getMatches(query));

  useIsomorphicLayoutEffect(() => {
    const mql = window.matchMedia(query);
    const handler = () => setMatches(mql.matches);
    handler();
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

// ── Product data ──
interface ProductCard {
  id: string;
  label: string;
  eyebrow: string;
  accentColor: string;
  headline: string;
  description: string;
  icon: React.ReactNode;
  features: { title: string; desc: string }[];
}

const products: ProductCard[] = [
  {
    id: "tartary-os",
    label: "Tartary OS",
    eyebrow: "System 01",
    accentColor: "#FF6600",
    headline: "AI-native cinematic creation for visionOS.",
    description:
      "Direct immersive films with spatial audio, volumetric scenes, and AI-driven cinematography — all from within Apple Vision Pro.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="14" rx="3" />
        <path d="M10 9L15 11.5L10 14V9Z" fill="currentColor" opacity="0.4" />
        <path d="M8 22H16" />
      </svg>
    ),
    features: [
      { title: "Spatial Direction", desc: "Hand gestures + gaze for composing shots" },
      { title: "AI Cinematography", desc: "Natural language → camera, lighting, composition" },
      { title: "Volumetric Rendering", desc: "Real-time PBR for Vision Pro" },
      { title: "Spatial Audio", desc: "Positional sound design" },
      { title: "Scene Intelligence", desc: "AI continuity and transitions" },
      { title: "Export Pipeline", desc: "Apple Immersive Video, stereo 3D, flat cinema" },
    ],
  },
  {
    id: "mudflood",
    label: "Mudflood",
    eyebrow: "System 02",
    accentColor: "#9B59FF",
    headline: "AI-powered spatial game creation for visionOS.",
    description:
      "Build interactive worlds, design game mechanics, and playtest — all in the space around you.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 8L12 4L19 8V16L12 20L5 16V8Z" />
        <path d="M12 12V20" /><path d="M12 12L19 8" /><path d="M12 12L5 8" />
      </svg>
    ),
    features: [
      { title: "Natural Language Design", desc: "Describe worlds → playable prototypes" },
      { title: "Spatial World Building", desc: "Sculpt with hand gestures" },
      { title: "Procedural Generation", desc: "AI terrain, architecture, NPCs" },
      { title: "Physics Engine", desc: "Spatial physics for mixed reality" },
      { title: "Multiplayer", desc: "SharePlay collaborative experiences" },
      { title: "App Store Pipeline", desc: "One-click visionOS export" },
    ],
  },
  {
    id: "tartary-studio",
    label: "Studio",
    eyebrow: "Creative",
    accentColor: "#E6B450",
    headline: "World-class spatial storytelling.",
    description: "Our in-house creative studio producing immersive films, interactive narratives, and spatial experiences.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
      </svg>
    ),
    features: [
      { title: "Immersive Films", desc: "Spatial cinema for Vision Pro" },
      { title: "Interactive Narratives", desc: "Choose-your-own spatial stories" },
      { title: "Brand Experiences", desc: "Enterprise spatial installations" },
    ],
  },
  {
    id: "tartary-press",
    label: "Press",
    eyebrow: "Media",
    accentColor: "#4ECDC4",
    headline: "News and updates from the frontier.",
    description: "Coverage, announcements, and dispatches from Tartary — the sovereign AI conglomerate building the spatial future.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16a2 2 0 01-2 2zm0 0a2 2 0 01-2-2v-9c0-1.1.9-2 2-2h2" />
        <path d="M18 14h-8" /><path d="M15 18h-5" /><rect x="10" y="6" width="8" height="5" rx="1" />
      </svg>
    ),
    features: [
      { title: "Announcements", desc: "Product launches and updates" },
      { title: "Coverage", desc: "Media features and interviews" },
      { title: "Research", desc: "Technical papers and findings" },
    ],
  },
  {
    id: "tartary-civilian",
    label: "Civilian",
    eyebrow: "Community",
    accentColor: "#FF6B9D",
    headline: "Join the spatial revolution.",
    description: "Community, careers, and ways to participate in Tartary's mission to build the spatial computing future.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
    features: [
      { title: "Community", desc: "Developer forums and events" },
      { title: "Careers", desc: "Build the spatial future with us" },
      { title: "Programs", desc: "Creator grants and partnerships" },
    ],
  },
  {
    id: "tartary-universe",
    label: "Universe",
    eyebrow: "Vision",
    accentColor: "#7B68EE",
    headline: "The Tartary worldview.",
    description: "Our philosophy, lore, and the grand vision behind the sovereign AI conglomerate.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M2 12h20" />
        <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
      </svg>
    ),
    features: [
      { title: "Philosophy", desc: "Spatial sovereignty and AI autonomy" },
      { title: "Lore", desc: "The Tartary mythos" },
      { title: "Roadmap", desc: "Where we're headed" },
    ],
  },
];

// ── Animation config ──
const ease = [0.32, 0.72, 0, 1] as const;
const transitionOverlay = { duration: 0.5, ease };

// ── Inner Carousel (memoized) ──
const CarouselInner = memo(function CarouselInner({
  onSelect,
  controls,
  items,
  isActive,
}: {
  onSelect: (product: ProductCard, index: number) => void;
  controls: ReturnType<typeof useAnimation>;
  items: ProductCard[];
  isActive: boolean;
}) {
  const isSmall = useMediaQuery("(max-width: 640px)");
  const cylinderWidth = isSmall ? 900 : 1600;
  const faceCount = items.length;
  const faceWidth = cylinderWidth / faceCount;
  const radius = cylinderWidth / (2 * Math.PI);
  const rotation = useMotionValue(0);
  const transform = useTransform(rotation, (v) => `rotate3d(0, 1, 0, ${v}deg)`);

  return (
    <div
      className="flex h-full items-center justify-center"
      style={{
        perspective: "1200px",
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      <motion.div
        drag={isActive ? "x" : false}
        className="relative flex h-full origin-center cursor-grab justify-center active:cursor-grabbing"
        style={{
          transform,
          rotateY: rotation,
          width: cylinderWidth,
          transformStyle: "preserve-3d",
        }}
        onDrag={(_, info) => {
          if (isActive) rotation.set(rotation.get() + info.offset.x * 0.05);
        }}
        onDragEnd={(_, info) => {
          if (isActive) {
            controls.start({
              rotateY: rotation.get() + info.velocity.x * 0.05,
              transition: { type: "spring", stiffness: 100, damping: 30, mass: 0.1 },
            });
          }
        }}
        animate={controls}
      >
        {items.map((product, i) => (
          <motion.div
            key={product.id}
            className="absolute flex h-full origin-center items-center justify-center p-2"
            style={{
              width: `${faceWidth}px`,
              transform: `rotateY(${i * (360 / faceCount)}deg) translateZ(${radius}px)`,
            }}
            onClick={() => onSelect(product, i)}
          >
            {/* ── Product Card ── */}
            <Material
              thickness="normal"
              className={cn(
                "relative w-full max-w-[240px] p-6 cursor-pointer select-none",
                "!rounded-3xl",
                "transition-all duration-300",
                "hover:scale-[1.03]"
              )}
            >
              {/* Accent glow */}
              <div
                className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-2xl opacity-[0.15] pointer-events-none"
                style={{ background: product.accentColor }}
              />

              <div className="relative z-10">
                {/* Icon */}
                <div
                  className="mb-4"
                  style={{ color: product.accentColor }}
                >
                  {product.icon}
                </div>

                {/* Eyebrow */}
                <Text
                  size="caption2" as="span"
                  className="block mb-1 font-semibold tracking-widest uppercase"
                  style={{ color: product.accentColor, fontFamily: "var(--font-mono)" }}
                >
                  {product.eyebrow}
                </Text>

                {/* Name */}
                <Text
                  size="title3" as="h3"
                  className="mb-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {product.label}
                </Text>

                {/* Tagline */}
                <Text size="caption1" variant="tertiary" className="line-clamp-2">
                  {product.headline}
                </Text>
              </div>
            </Material>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
});

// ── Main export ──
export function ProductCarousel({ className }: { className?: string }) {
  const [activeProduct, setActiveProduct] = useState<ProductCard | null>(null);
  const [isCarouselActive, setIsCarouselActive] = useState(true);
  const controls = useAnimation();

  const handleSelect = (product: ProductCard) => {
    setActiveProduct(product);
    setIsCarouselActive(false);
    controls.stop();
  };

  const handleClose = () => {
    setActiveProduct(null);
    setIsCarouselActive(true);
  };

  return (
    <motion.div layout className={cn("relative", className)}>
      {/* ── Expanded product overlay ── */}
      <AnimatePresence mode="sync">
        {activeProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transitionOverlay}
            onClick={handleClose}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-12"
            style={{ willChange: "opacity" }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 10 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl"
            >
              <Material
                thickness="thick"
                className="!rounded-3xl p-8 sm:p-10 relative overflow-hidden"
              >
                {/* Border beam on expanded card */}
                <BorderBeam
                  size={100}
                  duration={10}
                  colorFrom={activeProduct.accentColor}
                  colorTo="rgba(255,255,255,0.3)"
                  borderWidth={1.5}
                />

                {/* Accent glow */}
                <div
                  className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-3xl opacity-[0.12] pointer-events-none"
                  style={{ background: activeProduct.accentColor }}
                />

                <div className="relative z-10">
                  {/* Close button */}
                  <button
                    onClick={handleClose}
                    className="absolute top-0 right-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>

                  {/* Icon + eyebrow */}
                  <div className="flex items-center gap-3 mb-4">
                    <div style={{ color: activeProduct.accentColor }}>{activeProduct.icon}</div>
                    <Text
                      size="caption1" as="span"
                      className="font-semibold tracking-widest uppercase"
                      style={{ color: activeProduct.accentColor, fontFamily: "var(--font-mono)" }}
                    >
                      {activeProduct.eyebrow}
                    </Text>
                  </div>

                  {/* Title */}
                  <Text
                    size="XLTitle1" as="h2"
                    className="mb-3 tracking-tight"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {activeProduct.label}
                  </Text>

                  {/* Headline */}
                  <Text size="title3" variant="secondary" className="mb-2 !font-normal">
                    {activeProduct.headline}
                  </Text>

                  {/* Description */}
                  <Text size="body" variant="tertiary" className="mb-8">
                    {activeProduct.description}
                  </Text>

                  {/* Features grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {activeProduct.features.map((feat, fi) => (
                      <motion.div
                        key={feat.title}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: fi * 0.06 + 0.2, duration: 0.4 }}
                      >
                        <Material
                          thickness="thinnest"
                          className="p-3 !min-h-0 !min-w-0 !rounded-xl"
                        >
                          <div
                            className="w-1.5 h-1.5 rounded-full mb-2"
                            style={{ background: activeProduct.accentColor }}
                          />
                          <Text size="caption1" as="h4" className="font-semibold mb-1">
                            {feat.title}
                          </Text>
                          <Text size="caption2" variant="tertiary">
                            {feat.desc}
                          </Text>
                        </Material>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </Material>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 3D Carousel ── */}
      <div className="relative h-[400px] sm:h-[450px] w-full overflow-hidden">
        <CarouselInner
          onSelect={handleSelect}
          controls={controls}
          items={products}
          isActive={isCarouselActive}
        />
      </div>

      {/* ── Drag hint ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="text-center mt-2"
      >
        <Text size="caption2" variant="tertiary" as="p" className="flex items-center justify-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5">
            <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
          </svg>
          Drag to explore &middot; Click to expand
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5">
            <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
          </svg>
        </Text>
      </motion.div>
    </motion.div>
  );
}
