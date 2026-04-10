"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

/** Paper-like preview for empty state or final export */
export function DocumentPreview({ children, className = "" }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={[
        "relative overflow-hidden rounded-sm bg-[#0f1419] shadow-[0_24px_80px_rgba(0,0,0,0.55)]",
        "before:pointer-events-none before:absolute before:inset-0 before:rounded-sm before:ring-1 before:ring-white/10",
        className,
      ].join(" ")}
    >
      <div className="relative min-h-[280px] bg-gradient-to-b from-white/[0.07] to-transparent px-8 py-10 text-[13px] leading-[1.75] text-white/85">
        <div className="pointer-events-none absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-sky-500 via-violet-500 to-pink-500 opacity-80" />
        {children}
      </div>
    </motion.div>
  );
}
