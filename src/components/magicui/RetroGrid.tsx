"use client";

import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════
   RetroGrid — Pure CSS 3D perspective wireframe grid

   A lightweight alternative to Magic UI's WebGL version.
   Uses CSS perspective transforms for the 3D effect with
   an animated scroll via CSS keyframes.
   ═══════════════════════════════════════════════════ */

interface RetroGridProps {
  className?: string;
  angle?: number;
  cellSize?: number;
  opacity?: number;
  lineColor?: string;
}

export function RetroGrid({
  className,
  angle = 65,
  cellSize = 60,
  opacity = 0.5,
  lineColor = "rgba(255,255,255,0.12)",
}: RetroGridProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
      style={{ opacity }}
    >
      {/* Perspective container */}
      <div
        className="absolute inset-0"
        style={{ perspective: "200px" }}
      >
        {/* Rotated grid plane */}
        <div
          className="absolute inset-0"
          style={{ transform: `rotateX(${angle}deg)` }}
        >
          {/* Scrolling grid */}
          <div
            className="retro-grid-scroll absolute w-[600vw] h-[300vh] origin-[100%_0_0]"
            style={{
              marginLeft: "-200%",
              backgroundImage: `linear-gradient(to right, ${lineColor} 1px, transparent 0), linear-gradient(to bottom, ${lineColor} 1px, transparent 0)`,
              backgroundSize: `${cellSize}px ${cellSize}px`,
              transform: "translateY(-50%)",
            }}
          />
        </div>
      </div>

      {/* Gradient fade to match background */}
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)] via-[var(--bg)]/30 to-transparent" style={{ height: "30%" }} />
    </div>
  );
}
