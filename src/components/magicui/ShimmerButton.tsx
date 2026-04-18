"use client";

import React, { type CSSProperties } from "react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════
   ShimmerButton — Button with rotating shimmer effect

   Ported from Magic UI. A CTA button with a rotating
   conic-gradient shimmer effect behind it. Includes
   hover highlight and press feedback.
   ═══════════════════════════════════════════════════ */

export interface ShimmerButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
  children?: React.ReactNode;
}

export const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  (
    {
      shimmerColor = "#FF6600",
      shimmerSize = "0.05em",
      shimmerDuration = "3s",
      borderRadius = "100px",
      background = "rgba(10, 8, 8, 0.85)",
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        style={{
          "--spread": "90deg",
          "--shimmer-color": shimmerColor,
          "--radius": borderRadius,
          "--speed": shimmerDuration,
          "--cut": shimmerSize,
          "--btn-bg": background,
          borderRadius,
        } as CSSProperties}
        className={cn(
          "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap px-6 py-3 text-white",
          "border border-white/10",
          "transform-gpu transition-transform duration-300 ease-in-out active:translate-y-px",
          className
        )}
        ref={ref}
        {...props}
      >
        {/* Shimmer spark */}
        <div className="absolute inset-0 -z-30 overflow-visible blur-[2px]">
          <div className="shimmer-slide absolute inset-0 aspect-square h-full">
            <div className="shimmer-spin absolute -inset-full w-auto rotate-0"
              style={{
                background: `conic-gradient(from calc(270deg - (var(--spread) * 0.5)), transparent 0, var(--shimmer-color) var(--spread), transparent var(--spread))`,
              }}
            />
          </div>
        </div>

        {children}

        {/* Highlight overlay */}
        <div className={cn(
          "absolute inset-0 size-full px-4 py-1.5 text-sm font-medium",
          "shadow-[inset_0_-8px_10px_#ffffff1f]",
          "transform-gpu transition-all duration-300 ease-in-out",
          "group-hover:shadow-[inset_0_-6px_10px_#ffffff3f]",
          "group-active:shadow-[inset_0_-10px_10px_#ffffff3f]"
        )}
        style={{ borderRadius }}
        />

        {/* Backdrop */}
        <div className="absolute -z-20"
          style={{
            inset: shimmerSize,
            background,
            borderRadius,
          }}
        />
      </button>
    );
  }
);

ShimmerButton.displayName = "ShimmerButton";
