"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { RetroGrid } from "@/components/magicui/RetroGrid";
import { Particles } from "@/components/magicui/Particles";
import { AnimatedGridPattern } from "@/components/magicui/AnimatedGridPattern";

/* ═══════════════════════════════════════════════════
   VisionEnvironment — immersive 3D background wrapper

   Enhanced version with:
   - 3D perspective wireframe grid (RetroGrid)
   - Mouse-reactive floating particles
   - Animated grid pattern overlay
   - Atmospheric gradients + vignette
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
      {/* Base dark background */}
      <div className="absolute inset-0 z-[-3] bg-[var(--bg)]" />

      {/* 3D Wireframe perspective grid */}
      <RetroGrid
        angle={65}
        cellSize={50}
        opacity={0.35}
        lineColor="rgba(255, 102, 0, 0.08)"
      />

      {/* Animated grid pattern overlay (subtle pulsing squares) */}
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.06}
        duration={4}
        repeatDelay={1}
        className="absolute inset-0 z-[-2] h-full w-full fill-orange-500/[0.02] stroke-orange-500/[0.04] [mask-image:radial-gradient(600px_circle_at_center,white,transparent)]"
      />

      {/* Atmospheric radial gradients */}
      <div
        className="absolute inset-0 z-[-1]"
        style={{
          background: [
            "radial-gradient(ellipse 80% 50% at 50% 40%, oklch(0.14 0.02 260 / 0.8) 0%, transparent 70%)",
            "radial-gradient(ellipse 60% 40% at 20% 60%, oklch(0.12 0.03 290 / 0.4) 0%, transparent 60%)",
            "radial-gradient(ellipse 50% 35% at 80% 30%, oklch(0.13 0.025 30 / 0.3) 0%, transparent 55%)",
          ].join(", "),
        }}
      />

      {/* Orange accent glow at center bottom */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 z-[-1] w-[600px] h-[300px] rounded-full animate-pulse-glow"
        style={{
          background: "radial-gradient(ellipse at center, oklch(0.6 0.2 30 / 0.15) 0%, transparent 70%)",
        }}
      />

      {/* Mouse-reactive floating particles */}
      <Particles
        className="absolute inset-0 z-[1]"
        quantity={60}
        staticity={40}
        ease={60}
        size={0.5}
        color="#FF6600"
        vx={0}
        vy={-0.02}
      />

      {/* Subtle noise texture */}
      <div
        className="absolute inset-0 z-[1] opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Dim overlay for contrast */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-black/5" />

      {children}
    </div>
  );
}
