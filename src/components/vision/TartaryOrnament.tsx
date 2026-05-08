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
   to reveal the 4 Tartary pillars. Each tab links to
   its respective section/page.
   ═══════════════════════════════════════════════════ */

interface OrnamentTab {
  index: string;   // "01" – "04"
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
const WorldIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20" />
    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
  </svg>
);

const FilmsIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="14" rx="3" />
    <path d="M10 9L15 11.5L10 14V9Z" fill="currentColor" opacity="0.4" />
    <path d="M8 22H16" />
  </svg>
);

const ArtifactsIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);

const LabIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 3h6v5l4 8H5l4-8V3z" />
    <path d="M9 3h6" />
    <circle cx="13" cy="14" r="1" fill="currentColor" opacity="0.5" />
    <circle cx="10" cy="16" r="0.7" fill="currentColor" opacity="0.5" />
  </svg>
);

const TABS: OrnamentTab[] = [
  { index: "01", label: "World",     href: "/world",     icon: <WorldIcon /> },
  { index: "02", label: "Films",     href: "/films",     icon: <FilmsIcon /> },
  { index: "03", label: "Artifacts", href: "/artifacts",  icon: <ArtifactsIcon /> },
  { index: "04", label: "Lab",       href: "/lab",       icon: <LabIcon /> },
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
