"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Props = {
  text: string;
  /** Change to restart typing */
  animKey: string | number;
  /** Receives the full `text` that was animated (avoids stale closures in parent). */
  onComplete?: (fullText: string) => void;
  className?: string;
};

/**
 * Reveals text character-by-character (mock AI stream).
 */
export function AiTypingAnimation({ text, animKey, onComplete, className = "" }: Props) {
  const [shown, setShown] = useState("");
  const [done, setDone] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    setShown("");
    setDone(false);
    // Do not call onComplete for empty text (prevents finishing the flow with no letter).
    if (!text) {
      return;
    }
    const fullText = text;
    let i = 0;
    const ms = fullText.length > 1400 ? 4 : 10;
    const id = window.setInterval(() => {
      i += 1;
      setShown(fullText.slice(0, i));
      if (i >= fullText.length) {
        window.clearInterval(id);
        setDone(true);
        onCompleteRef.current?.(fullText);
      }
    }, ms);
    return () => window.clearInterval(id);
  }, [text, animKey]);

  return (
    <div
      className={[
        "min-h-[200px] whitespace-pre-wrap rounded-xl border border-white/10 bg-black/25 p-4 text-sm leading-relaxed text-white/90",
        className,
      ].join(" ")}
    >
      {shown}
      <AnimatePresence>
        {!done ? (
          <motion.span
            key="caret"
            className="ml-0.5 inline-block h-4 w-0.5 translate-y-0.5 bg-violet-400"
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ repeat: Infinity, duration: 0.9 }}
            aria-hidden
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
