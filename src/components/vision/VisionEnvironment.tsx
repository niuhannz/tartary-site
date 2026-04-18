"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/* ═══════════════════════════════════════════════════
   VisionEnvironment — immersive background wrapper

   Matches vision-ui's EnvironmentProvider pattern:
   - Full viewport coverage
   - Atmospheric dark gradient background
   - Inset shadow vignette (box-shadow inset)
   - data-vision-os-ui attribute for font/cursor
   - Content centered with responsive padding
   ═══════════════════════════════════════════════════ */

interface VisionEnvironmentProps {
  children: ReactNode;
  className?: string;
}

export function VisionEnvironment({ children, className }: VisionEnvironmentProps) {
  return (
    <div
      className={cn(
        "h-dvh w-full",
        "relative mx-auto flex items-center justify-center overflow-hidden",
        "px-4 py-1 sm:px-8 md:px-12 lg:px-16",
        // Inset vignette shadow (matching vision-ui)
        "after:pointer-events-none after:absolute after:inset-0 after:z-[0] after:overflow-hidden",
        "after:[box-shadow:inset_0_0_16px_16px_var(--bg)]",
        className
      )}
      data-vision-os-ui
    >
      {/* Atmospheric dark gradient background */}
      <div
        className="absolute inset-0 z-[-1]"
        style={{
          background: [
            "radial-gradient(ellipse 80% 50% at 50% 40%, oklch(0.14 0.02 260 / 0.8) 0%, transparent 70%)",
            "radial-gradient(ellipse 60% 40% at 20% 60%, oklch(0.12 0.03 290 / 0.4) 0%, transparent 60%)",
            "radial-gradient(ellipse 50% 35% at 80% 30%, oklch(0.13 0.025 30 / 0.3) 0%, transparent 55%)",
            "var(--bg)",
          ].join(", "),
        }}
      />

      {/* Subtle noise texture */}
      <div
        className="absolute inset-0 z-[0] opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Dim overlay for contrast */}
      <div className="pointer-events-none absolute inset-0 z-[0] bg-black/10" />

      {children}
    </div>
  );
}
