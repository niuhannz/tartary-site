"use client";

import React from "react";
import { cn } from "@/lib/utils";

/* ── visionOS Typography Scale ── */
const sizeClasses: Record<string, string> = {
  title1:     "leading-loose text-2xl font-bold",
  title2:     "leading-7 text-[22px] font-bold",
  title3:     "leading-normal text-[19px] font-bold",
  largeTitle: "leading-[38px] text-[29px] font-bold",
  XLTitle1:   "leading-[56px] text-5xl font-bold",
  XLTitle2:   "leading-[46px] text-[38px] font-bold",
  headline:   "leading-snug text-[17px] font-bold",
  body:       "leading-snug text-[17px]",
  callout:    "leading-tight text-[15px]",
  subheadline:"leading-tight text-[15px] font-normal",
  footnote:   "leading-[18px] text-[13px]",
  caption1:   "leading-none text-xs",
  caption2:   "leading-none text-xs",
};

const variantClasses: Record<string, string> = {
  default:   "text-white opacity-95",
  secondary: "text-white opacity-55",
  tertiary:  "text-white opacity-[0.31]",
};

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  size?: keyof typeof sizeClasses;
  variant?: keyof typeof variantClasses;
  as?: "p" | "span" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div";
}

const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  (
    {
      className,
      variant = "default",
      size = "body",
      as: Tag = "p",
      ...props
    },
    ref
  ) => {
    return (
      <Tag
        className={cn(
          variantClasses[variant],
          sizeClasses[size],
          "transition-all duration-500",
          className
        )}
        ref={ref as React.Ref<HTMLParagraphElement>}
        {...props}
      />
    );
  }
);
Text.displayName = "Text";

export { Text };
export type { TextProps };
