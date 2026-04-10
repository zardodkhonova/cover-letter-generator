"use client";

import { motion } from "framer-motion";

type Props = {
  label?: string;
  onClick: () => void;
};

export function BackButton({ label = "Back", onClick }: Props) {
  return (
    <motion.button
      type="button"
      whileHover={{ x: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/55 px-3 py-2 text-xs font-medium text-white/80 backdrop-blur-md transition-colors hover:bg-white/10 hover:text-white"
    >
      <span aria-hidden>←</span>
      <span>{label}</span>
    </motion.button>
  );
}
