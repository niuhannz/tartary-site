"use client";

import { motion } from "framer-motion";
import type { ReactNode, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { type GlassThickness, Material, type MaterialProps } from "./Material";

interface ViewProps extends HTMLAttributes<HTMLDivElement> {
  material?: boolean | { thickness?: GlassThickness };
  children?: ReactNode;
}

function View({ className, material = false, children, ...rest }: ViewProps) {
  if (material) {
    const thickness =
      typeof material === "object" ? material.thickness : "normal";
    return (
      <Material
        thickness={thickness}
        className={cn("overflow-hidden", className)}
        {...(rest as MaterialProps)}
      >
        {children}
      </Material>
    );
  }
  return (
    <div className={cn("overflow-hidden", className)} {...rest}>
      {children}
    </div>
  );
}

const MotionView = motion.create(View);

export { View, MotionView };
export type { ViewProps };
