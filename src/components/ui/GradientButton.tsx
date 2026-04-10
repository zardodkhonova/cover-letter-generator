"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

type GradientButtonProps = HTMLMotionProps<"button"> & {
  children: ReactNode;
  variant?: "primary" | "ghost";
};

export function GradientButton({
  children,
  className = "",
  variant = "primary",
  disabled,
  type = "button",
  ...rest
}: GradientButtonProps) {
  if (variant === "ghost") {
    return (
      <motion.button
        type={type}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        disabled={disabled}
        className={[
          "rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/90 backdrop-blur-sm transition-colors hover:bg-white/10",
          disabled ? "cursor-not-allowed opacity-50" : "",
          className,
        ].join(" ")}
        {...rest}
      >
        {children}
      </motion.button>
    );
  }

  return (
    <motion.button
      type={type}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      disabled={disabled}
      className={[
        "relative overflow-hidden rounded-xl bg-gradient-to-r from-sky-500 via-violet-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_32px_rgba(139,92,246,0.35)] transition-shadow duration-300 hover:shadow-[0_12px_40px_rgba(236,72,153,0.25)]",
        disabled ? "cursor-not-allowed opacity-50" : "",
        className,
      ].join(" ")}
      {...rest}
    >
      <span className="relative z-10">{children}</span>
      <span
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-500 hover:opacity-100"
        aria-hidden
      />
    </motion.button>
  );
}
