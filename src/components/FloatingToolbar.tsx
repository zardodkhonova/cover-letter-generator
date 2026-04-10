"use client";

import { motion } from "framer-motion";

type Props = {
  onBold: () => void;
  onItalic: () => void;
  onImprove: () => void;
  onShorten: () => void;
  onExpand: () => void;
  disabled?: boolean;
  busy?: boolean;
};

const btn =
  "rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-35";

/** Compact floating formatting / AI actions for the editor step */
export function FloatingToolbar({
  onBold,
  onItalic,
  onImprove,
  onShorten,
  onExpand,
  disabled,
  busy,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="pointer-events-auto flex flex-wrap items-center gap-1 rounded-2xl border border-white/10 bg-black/50 px-2 py-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl"
    >
      <span className="px-1 text-[10px] font-semibold uppercase tracking-wider text-white/35">Format</span>
      <button type="button" className={btn} onClick={onBold} disabled={disabled || busy}>
        Bold
      </button>
      <button type="button" className={btn} onClick={onItalic} disabled={disabled || busy}>
        Italic
      </button>
      <span className="mx-1 h-4 w-px bg-white/10" aria-hidden />
      <span className="px-1 text-[10px] font-semibold uppercase tracking-wider text-white/35">AI</span>
      <button type="button" className={btn} onClick={onImprove} disabled={disabled || busy}>
        Improve
      </button>
      <button type="button" className={btn} onClick={onShorten} disabled={disabled || busy}>
        Shorten
      </button>
      <button type="button" className={btn} onClick={onExpand} disabled={disabled || busy}>
        Expand
      </button>
    </motion.div>
  );
}
