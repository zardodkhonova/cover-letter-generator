"use client";

import type { TextareaHTMLAttributes } from "react";

type GlowTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
};

export function GlowTextarea({ label, id, className = "", ...rest }: GlowTextareaProps) {
  const inputId = id ?? rest.name;
  return (
    <div className="flex flex-col gap-2">
      {label ? (
        <label htmlFor={inputId} className="text-xs font-medium tracking-wide text-white/55">
          {label}
        </label>
      ) : null}
      <textarea
        id={inputId}
        className={[
          "min-h-[120px] w-full resize-y rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm leading-relaxed text-white/90 outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-white/25 focus:border-violet-400/50 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)]",
          className,
        ].join(" ")}
        {...rest}
      />
    </div>
  );
}
