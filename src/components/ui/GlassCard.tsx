"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type GlassCardProps = {
  children: ReactNode;
  className?: string;
  hover?: boolean;
};

/** Frosted glass panel with subtle border */
export function GlassCard({ children, className = "", hover = true }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={[
        "rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_8px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl",
        hover ? "transition-shadow duration-300 hover:border-white/15 hover:shadow-[0_12px_48px_rgba(99,102,241,0.12)]" : "",
        className,
      ].join(" ")}
    >
      {children}
    </motion.div>
  );
}
