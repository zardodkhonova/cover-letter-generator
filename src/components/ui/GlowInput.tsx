"use client";

import type { InputHTMLAttributes } from "react";

type GlowInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function GlowInput({ label, id, className = "", ...rest }: GlowInputProps) {
  const inputId = id ?? rest.name;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={inputId} className="text-xs font-medium tracking-wide text-white/55">
        {label}
      </label>
      <input
        id={inputId}
        className={[
          "h-11 w-full rounded-xl border border-white/10 bg-black/30 px-4 text-sm text-white/90 outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-white/25 focus:border-violet-400/50 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)]",
          className,
        ].join(" ")}
        {...rest}
      />
    </div>
  );
}
