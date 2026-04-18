"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Material } from "./Material";
import { Text } from "./Text";
import { MotionView } from "./View";

/* ═══════════════════════════════════════════════════
   TartaryOrnament — visionOS-style floating tab bar

   A collapsed pill on the left that expands on hover
   to reveal the 5 Tartary pillars. Each tab links to
   its respective section/page.
   ═══════════════════════════════════════════════════ */

interface OrnamentTab {
  index: string;   // "01" – "05"
  label: string;
  href: string;
  icon: React.ReactNode;
}

const ORNAMENT_VARIANTS = {
  collapsed: {
    width: 52,
    scale: 1.0,
    transition: { delay: 0.8, type: "spring" as const, bounce: 0 },
  },
  expanded: {
    width: "fit-content" as const,
    scale: 1.05,
    transition: { type: "spring" as const, bounce: 0.06, duration: 0.7 },
  },
  whileTap: {
    scale: 1,
    transition: { type: "spring" as const, bounce: 0.1, duration: 0.4 },
  },
};

/* ── Pillar Icons (simple SVGs) ── */
const UniverseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <ellipse cx="12" cy="12" rx="10" ry="4" />
    <line x1="12" y1="2" x2="12" y2="22" />
  </svg>
);

const SystemIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="14" rx="3" />
    <path d="M10 10L15 12.5L10 15V10Z" fill="currentColor" opacity="0.5" />
    <path d="M8 22H16" />
  </svg>
);

const StudioIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 8V4h16v4" />
    <path d="M4 16v4h16v-4" />
    <rect x="7" y="8" width="10" height="8" rx="1" />
  </svg>
);

const PressIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16v16H4z" />
    <path d="M8 8h8" />
    <path d="M8 12h8" />
    <path d="M8 16h4" />
  </svg>
);

const CivilianIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
  </svg>
);

const TABS: OrnamentTab[] = [
  { index: "01", label: "Universe",  href: "/universe",  icon: <UniverseIcon /> },
  { index: "02", label: "System",    href: "/systems",   icon: <SystemIcon /> },
  { index: "03", label: "Studio",    href: "/studio",    icon: <StudioIcon /> },
  { index: "04", label: "Press",     href: "/press",     icon: <PressIcon /> },
  { index: "05", label: "Civilian",  href: "/civilian",  icon: <CivilianIcon /> },
];

interface TartaryOrnamentProps {
  className?: string;
  /** Which tab to highlight as active (href match) — defaults to pathname */
  activeHref?: string;
}

export function TartaryOrnament({ className, activeHref }: TartaryOrnamentProps) {
  const pathname = usePathname();
  const [tapped, setTapped] = useState(false);
  const active = activeHref || pathname;

  return (
    <div className={cn("flex items-center", className)}>
      <MotionView
        material
        variants={ORNAMENT_VARIANTS}
        className="relative z-[42] self-center"
        role="tablist"
        initial="collapsed"
        whileHover="expanded"
        whileFocus="expanded"
        whileTap="whileTap"
        onMouseDown={() => setTapped(true)}
        onMouseUp={() => setTapped(false)}
      >
        <div className="flex flex-col items-start gap-1.5 p-2.5">
          {TABS.map((tab) => {
            const isActive =
              active === tab.href || active.startsWith(`${tab.href}/`);
            return (
              <Link
                key={tab.index}
                href={tab.href}
                className={cn(
                  "group flex w-full items-center justify-stretch rounded-full px-[10px] py-2",
                  "transition-colors duration-200",
                  "vision-pro-ui-hoverable",
                  // before pseudo for hover bg
                  "relative before:absolute before:inset-0 before:rounded-full before:transition-opacity before:duration-300",
                  "before:[background:linear-gradient(0deg,rgba(94,94,94,0.24)_0%,rgba(94,94,94,0.24)_100%),rgba(255,255,255,0.12)]",
                  isActive
                    ? "before:opacity-75 text-white/90"
                    : "before:opacity-0 hover:before:opacity-50 text-white/50 hover:text-white/90"
                )}
                aria-label={tab.label}
              >
                <div className="relative z-10 flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                  {tab.icon}
                </div>
                <motion.span className="ml-4 flex-1 overflow-hidden text-start relative z-10">
                  <Text
                    size="callout"
                    as="span"
                    className="line-clamp-1 w-fit min-w-[60px] truncate font-medium leading-[24px] !opacity-100"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {tab.label}
                  </Text>
                </motion.span>
              </Link>
            );
          })}
        </div>
      </MotionView>
    </div>
  );
}
