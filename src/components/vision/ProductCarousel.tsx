"use client";

import {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
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

/* ═══════════════════════════════════════════════════════════════
   ProductCarousel — Intro-Disclosure Circle Carousel

   A 3D rotating cylinder of glassmorphic product cards with
   auto-rotation and a focal "intro disclosure" panel. The
   active/focused card sits front-center with a progressive
   reveal panel showing product details, features, and CTA.

   Inspired by cult-ui's intro-disclosure + ThreeDPhotoCarousel.

   Drag to spin manually · Tap a card to focus · Auto-rotates
   when idle · The focal card expands into a disclosure sheet.
   ═══════════════════════════════════════════════════════════════ */

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
  href: string;
}

const products: ProductCard[] = [
  {
    id: "world",
    label: "World",
    eyebrow: "IP Universe",
    accentColor: "#7B68EE",
    headline: "Two sovereign worlds. One mythology.",
    description:
      "Heavenfall and On the Water's Margin — interconnected narrative worlds spanning spatial cinema, games, and print.",
    href: "/world",
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20" />
        <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
      </svg>
    ),
    features: [
      { title: "Heavenfall", desc: "The World of Heavenfall" },
      { title: "On the Water's Margin", desc: "The World of On the Water's Margin" },
    ],
  },
  {
    id: "films",
    label: "Films",
    eyebrow: "Cinema",
    accentColor: "#FF6600",
    headline: "Spatial cinema. Immersive production.",
    description:
      "From film to animation to virtual production — our studios craft immersive narratives for Vision Pro and beyond.",
    href: "/films",
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="14" rx="3" />
        <path d="M10 9L15 11.5L10 14V9Z" fill="currentColor" opacity="0.4" />
        <path d="M8 22H16" />
      </svg>
    ),
    features: [
      { title: "Gelatin Silver", desc: "Film production arm" },
      { title: "Swing Gang", desc: "Virtual production unit" },
      { title: "Niji", desc: "Animation studio" },
      { title: "Cineschool", desc: "Film education platform" },
    ],
  },
  {
    id: "artifacts",
    label: "Artifacts",
    eyebrow: "Products",
    accentColor: "#E6B450",
    headline: "Tools that build worlds.",
    description:
      "Creation engines, reading platforms, and publishing infrastructure — the instruments of sovereign storytelling.",
    href: "/artifacts",
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    features: [
      { title: "Tartary OS", desc: "Cinematic spatial operating system" },
      { title: "Mudflood", desc: "Game creation engine for Vision Pro" },
      { title: "Readen", desc: "Reading platform" },
      { title: "Publishing", desc: "Books & print" },
    ],
  },
  {
    id: "lab",
    label: "Lab",
    eyebrow: "Experimental",
    accentColor: "#4ECDC4",
    headline: "Where AI meets narrative intelligence.",
    description:
      "Experimental AI companions, narrative engines, and interactive R&D — pushing the boundary of what stories can do.",
    href: "/lab",
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 3h6v5l4 8H5l4-8V3z" />
        <path d="M9 3h6" />
        <circle cx="13" cy="14" r="1.2" fill="currentColor" opacity="0.5" />
        <circle cx="10" cy="16" r="0.8" fill="currentColor" opacity="0.5" />
      </svg>
    ),
    features: [
      { title: "Lucas", desc: "Personal AI companion" },
      { title: "Fatestack", desc: "Narrative decision engine" },
      { title: "Invisible Friend", desc: "Ambient intelligence" },
      { title: "Game Studio", desc: "Interactive experiences R&D" },
    ],
  },
];

// ── Animation constants ──
const ease = [0.32, 0.72, 0, 1] as const;
const springConfig = { type: "spring" as const, stiffness: 100, damping: 30, mass: 0.1 };
const AUTO_ROTATE_SPEED = 0.15; // deg per frame
const AUTO_ROTATE_DELAY = 3000; // ms of idle before auto-rotate resumes

// ── Focal Disclosure Panel ──
// Shows when a product card is clicked — progressive reveal of details
function FocalDisclosure({
  product,
  onClose,
}: {
  product: ProductCard;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 sm:p-12"
    >
      <motion.div
        initial={{ scale: 0.88, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 15 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl"
      >
        <Material thickness="thick" className="!rounded-[28px] relative overflow-hidden">
          <BorderBeam
            size={120}
            duration={8}
            colorFrom={product.accentColor}
            colorTo="rgba(255,255,255,0.2)"
            borderWidth={1.5}
          />

          {/* Ambient accent glow */}
          <div
            className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-[80px] opacity-[0.10] pointer-events-none"
            style={{ background: product.accentColor }}
          />
          <div
            className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full blur-[60px] opacity-[0.06] pointer-events-none"
            style={{ background: product.accentColor }}
          />

          <div className="relative z-10 p-8 sm:p-10">
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/[0.08] flex items-center justify-center hover:bg-white/[0.15] transition-colors backdrop-blur-sm"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>

            {/* ── Step 1: Identity ── */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              className="flex items-center gap-4 mb-6"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{
                  background: `${product.accentColor}18`,
                  border: `1px solid ${product.accentColor}30`,
                }}
              >
                <div style={{ color: product.accentColor }}>{product.icon}</div>
              </div>
              <div>
                <Text
                  size="caption1" as="span"
                  className="block font-semibold tracking-[0.2em] uppercase mb-1"
                  style={{ color: product.accentColor, fontFamily: "var(--font-mono)" }}
                >
                  {product.eyebrow}
                </Text>
                <Text
                  size="XLTitle1" as="h2"
                  className="tracking-tight leading-none"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {product.label}
                </Text>
              </div>
            </motion.div>

            {/* ── Step 2: Headline + Description (progressive) ── */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              className="mb-8"
            >
              <Text size="title3" variant="secondary" className="mb-3 !font-normal leading-relaxed">
                {product.headline}
              </Text>
              <Text size="body" variant="tertiary" className="leading-relaxed">
                {product.description}
              </Text>
            </motion.div>

            {/* ── Step 3: Features grid (staggered) ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.4 }}
              className="mb-8"
            >
              <Text
                size="caption1" as="span"
                className="block font-semibold tracking-[0.15em] uppercase mb-4"
                style={{ color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-mono)" }}
              >
                Capabilities
              </Text>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {product.features.map((feat, fi) => (
                  <motion.div
                    key={feat.title}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      delay: fi * 0.06 + 0.4,
                      duration: 0.4,
                      ease: [0.23, 1, 0.32, 1],
                    }}
                  >
                    <Material
                      thickness="thinnest"
                      className="p-3.5 !min-h-0 !min-w-0 !rounded-xl hover:scale-[1.02] transition-transform"
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full mb-2.5"
                        style={{ background: product.accentColor }}
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
            </motion.div>

            {/* ── Step 4: CTA ── */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="flex items-center gap-3"
            >
              <a
                href={product.href}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: `linear-gradient(135deg, ${product.accentColor}, ${product.accentColor}88)`,
                  color: "white",
                  boxShadow: `0 8px 32px ${product.accentColor}40`,
                }}
              >
                Explore {product.label}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
                </svg>
              </a>
              <button
                onClick={onClose}
                className="px-5 py-3 rounded-2xl text-sm font-medium text-white/40 hover:text-white/60 hover:bg-white/[0.05] transition-all"
              >
                Back
              </button>
            </motion.div>
          </div>
        </Material>
      </motion.div>
    </motion.div>
  );
}

// ── Carousel Card ──
function CarouselCard({
  product,
  isFocal,
  onClick,
}: {
  product: ProductCard;
  isFocal: boolean;
  onClick: () => void;
}) {
  return (
    <Material
      thickness={isFocal ? "normal" : "thin"}
      className={cn(
        "relative w-full max-w-[220px] sm:max-w-[240px] cursor-pointer select-none",
        "!rounded-[24px] overflow-hidden",
        "transition-all duration-500",
        isFocal
          ? "scale-[1.08] shadow-2xl"
          : "scale-100 hover:scale-[1.03]"
      )}
      onClick={onClick}
    >
      {/* Active indicator beam */}
      {isFocal && (
        <BorderBeam
          size={80}
          duration={6}
          colorFrom={product.accentColor}
          colorTo="rgba(255,255,255,0.15)"
          borderWidth={1}
        />
      )}

      {/* Accent glow */}
      <div
        className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-2xl pointer-events-none transition-opacity duration-500"
        style={{
          background: product.accentColor,
          opacity: isFocal ? 0.2 : 0.1,
        }}
      />

      <div className="relative z-10 p-5 sm:p-6">
        {/* Icon in accent container */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-all duration-500"
          style={{
            background: isFocal ? `${product.accentColor}20` : `${product.accentColor}10`,
            border: `1px solid ${product.accentColor}${isFocal ? "40" : "20"}`,
            color: product.accentColor,
          }}
        >
          {product.icon}
        </div>

        {/* Eyebrow */}
        <Text
          size="caption2" as="span"
          className="block mb-1 font-semibold tracking-[0.18em] uppercase"
          style={{ color: product.accentColor, fontFamily: "var(--font-mono)" }}
        >
          {product.eyebrow}
        </Text>

        {/* Label */}
        <Text
          size="title3" as="h3"
          className="mb-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {product.label}
        </Text>

        {/* Tagline */}
        <Text size="caption1" variant="tertiary" className="line-clamp-2 leading-relaxed">
          {product.headline}
        </Text>

        {/* Focus hint — only on focal card */}
        <AnimatePresence>
          {isFocal && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 12 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="overflow-hidden"
            >
              <div
                className="flex items-center gap-1.5 text-xs font-medium"
                style={{ color: product.accentColor }}
              >
                <span>Tap to explore</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
                </svg>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Material>
  );
}

// ── Inner Carousel (memoized) ──
const CarouselInner = memo(function CarouselInner({
  onSelect,
  controls,
  items,
  isActive,
  focalIndex,
  onFocalChange,
}: {
  onSelect: (product: ProductCard, index: number) => void;
  controls: ReturnType<typeof useAnimation>;
  items: ProductCard[];
  isActive: boolean;
  focalIndex: number;
  onFocalChange: (index: number) => void;
}) {
  const isSmall = useMediaQuery("(max-width: 640px)");
  const cylinderWidth = isSmall ? 900 : 1600;
  const faceCount = items.length;
  const faceWidth = cylinderWidth / faceCount;
  const radius = cylinderWidth / (2 * Math.PI);
  const rotation = useMotionValue(0);
  const transform = useTransform(rotation, (v) => `rotate3d(0, 1, 0, ${v}deg)`);

  // Track which card is closest to front
  useEffect(() => {
    const unsubscribe = rotation.on("change", (v) => {
      const anglePerCard = 360 / faceCount;
      // Normalize rotation to 0-360
      const normalizedAngle = (((-v % 360) + 360) % 360);
      const closestIndex = Math.round(normalizedAngle / anglePerCard) % faceCount;
      onFocalChange(closestIndex);
    });
    return unsubscribe;
  }, [rotation, faceCount, onFocalChange]);

  // Auto-rotation
  const autoRotateRef = useRef<number | null>(null);
  const lastInteractionRef = useRef<number>(0);

  useEffect(() => {
    if (!isActive) {
      if (autoRotateRef.current) cancelAnimationFrame(autoRotateRef.current);
      return;
    }

    const tick = () => {
      const now = Date.now();
      if (now - lastInteractionRef.current > AUTO_ROTATE_DELAY) {
        rotation.set(rotation.get() - AUTO_ROTATE_SPEED);
      }
      autoRotateRef.current = requestAnimationFrame(tick);
    };

    autoRotateRef.current = requestAnimationFrame(tick);
    return () => {
      if (autoRotateRef.current) cancelAnimationFrame(autoRotateRef.current);
    };
  }, [isActive, rotation]);

  const handleDrag = useCallback(
    (_: unknown, info: { offset: { x: number } }) => {
      if (isActive) {
        lastInteractionRef.current = Date.now();
        rotation.set(rotation.get() + info.offset.x * 0.05);
      }
    },
    [isActive, rotation]
  );

  const handleDragEnd = useCallback(
    (_: unknown, info: { velocity: { x: number } }) => {
      if (isActive) {
        lastInteractionRef.current = Date.now();
        controls.start({
          rotateY: rotation.get() + info.velocity.x * 0.05,
          transition: springConfig,
        });
      }
    },
    [isActive, controls, rotation]
  );

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
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
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
            onClick={() => {
              lastInteractionRef.current = Date.now();
              onSelect(product, i);
            }}
          >
            <CarouselCard
              product={product}
              isFocal={i === focalIndex}
              onClick={() => {
                lastInteractionRef.current = Date.now();
                onSelect(product, i);
              }}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
});

// ── Focal indicator dots ──
function FocalDots({
  items,
  activeIndex,
}: {
  items: ProductCard[];
  activeIndex: number;
}) {
  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      {items.map((item, i) => (
        <motion.div
          key={item.id}
          className="rounded-full transition-all duration-300"
          animate={{
            width: i === activeIndex ? 20 : 6,
            height: 6,
            opacity: i === activeIndex ? 1 : 0.25,
            background: i === activeIndex ? item.accentColor : "rgba(255,255,255,0.5)",
          }}
          transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
        />
      ))}
    </div>
  );
}

// ── Main export ──
export function ProductCarousel({ className }: { className?: string }) {
  const [activeProduct, setActiveProduct] = useState<ProductCard | null>(null);
  const [isCarouselActive, setIsCarouselActive] = useState(true);
  const [focalIndex, setFocalIndex] = useState(0);
  const controls = useAnimation();

  const handleSelect = useCallback((product: ProductCard) => {
    setActiveProduct(product);
    setIsCarouselActive(false);
    controls.stop();
  }, [controls]);

  const handleClose = useCallback(() => {
    setActiveProduct(null);
    setIsCarouselActive(true);
  }, []);

  const handleFocalChange = useCallback((index: number) => {
    setFocalIndex(index);
  }, []);

  return (
    <motion.div layout className={cn("relative", className)}>
      {/* ── Expanded product — Intro Disclosure overlay ── */}
      <AnimatePresence mode="sync">
        {activeProduct && (
          <FocalDisclosure product={activeProduct} onClose={handleClose} />
        )}
      </AnimatePresence>

      {/* ── 3D Cylinder Carousel ── */}
      <div className="relative h-[380px] sm:h-[430px] w-full overflow-hidden">
        {/* Soft vignette edges */}
        <div
          className="absolute inset-y-0 left-0 w-24 sm:w-40 z-10 pointer-events-none"
          style={{
            background: "linear-gradient(to right, oklch(0.06 0.015 260 / 0.9), transparent)",
          }}
        />
        <div
          className="absolute inset-y-0 right-0 w-24 sm:w-40 z-10 pointer-events-none"
          style={{
            background: "linear-gradient(to left, oklch(0.06 0.015 260 / 0.9), transparent)",
          }}
        />

        <CarouselInner
          onSelect={handleSelect}
          controls={controls}
          items={products}
          isActive={isCarouselActive}
          focalIndex={focalIndex}
          onFocalChange={handleFocalChange}
        />
      </div>

      {/* ── Focal indicator dots ── */}
      <FocalDots items={products} activeIndex={focalIndex} />

      {/* ── Active product name ── */}
      <motion.div
        key={products[focalIndex]?.id}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center mt-3"
      >
        <Text
          size="caption1" as="p"
          variant="tertiary"
          className="flex items-center justify-center gap-2"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <span
            className="w-2 h-2 rounded-full inline-block"
            style={{ background: products[focalIndex]?.accentColor }}
          />
          {products[focalIndex]?.label}
          <span className="opacity-40">·</span>
          <span className="opacity-40">Drag to explore · Click to expand</span>
        </Text>
      </motion.div>
    </motion.div>
  );
}
