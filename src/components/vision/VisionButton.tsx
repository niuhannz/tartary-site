"use client";

import React from "react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════
   VisionButton — visionOS-style button with
   hover bg reveal and layered before pseudo-element
   ═══════════════════════════════════════════════════ */

type Variant = "default" | "primary" | "secondary" | "link";
type Size = "default" | "icon";

interface VisionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
}

const baseClasses = cn(
  "vision-pro-ui-hoverable",
  "relative flex min-h-[44px] min-w-[44px] items-center justify-center",
  "text-[17px] leading-[22px] font-medium",
  "rounded-md ring-offset-white *:pointer-events-none",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2",
  "[&_svg]:shrink-0 [&_svg]:stroke-[2.25px]",
  "[&_svg]:transition-opacity [&_svg]:duration-300",
  "disabled:pointer-events-none disabled:opacity-40",
  // before pseudo for hover background
  "before:absolute before:inset-0 before:z-0 before:rounded-[var(--radius,0.375rem)]",
  "before:[background-blend-mode:color-dodge,lighten] before:transition-opacity before:duration-300",
  "before:[background:linear-gradient(0deg,rgba(94,94,94,0.24)_0%,rgba(94,94,94,0.24)_100%),rgba(255,255,255,0.12)]",
  "before:opacity-0"
);

const variantClasses: Record<Variant, string> = {
  default: cn(
    "text-white/90",
    "[&_svg]:text-white [&_svg]:opacity-[0.96]",
    "before:opacity-75 hover:before:opacity-[0.96]"
  ),
  primary: cn(
    "text-white/90 bg-[oklch(0.625_0.18_251)]",
    "hover:text-white",
    "[&_svg]:text-white [&_svg]:opacity-[0.96]",
    "before:[background:oklch(0.625_0.18_251)] before:opacity-15 hover:before:opacity-[0.15]"
  ),
  secondary: cn(
    "text-white/50 hover:text-white/95 transition-colors",
    "[&_svg]:text-white [&_svg]:opacity-60 [&_svg]:hover:opacity-[0.96]",
    "hover:before:opacity-50"
  ),
  link: cn(
    "text-[#5ac8f5]",
    "[&_svg]:text-[#5ac8f5] [&_svg]:opacity-70 [&_svg]:hover:opacity-[0.96]",
    "hover:before:opacity-50 before:opacity-0"
  ),
};

const sizeClasses: Record<Size, string> = {
  default: "h-[2.75rem] px-[20px]",
  icon: "h-[2.75rem] w-[2.75rem] [--radius:50%]",
};

const VisionButton = React.forwardRef<HTMLButtonElement, VisionButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
VisionButton.displayName = "VisionButton";

export { VisionButton };
export type { VisionButtonProps };
