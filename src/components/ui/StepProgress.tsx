"use client";

import { motion } from "framer-motion";
import type { WizardStep } from "@/store/useWizardStore";

const STEPS: { id: WizardStep; label: string }[] = [
  { id: 1, label: "Details" },
  { id: 2, label: "Generate" },
  { id: 3, label: "Review" },
  { id: 4, label: "Export" },
];

export function StepProgress({ current }: { current: WizardStep }) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-2">
        {STEPS.map((s, i) => {
          const done = current > s.id;
          const active = current === s.id;
          return (
            <div key={s.id} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex w-full items-center">
                {i > 0 ? (
                  <div
                    className={[
                      "h-px flex-1 rounded-full transition-colors duration-500",
                      current > STEPS[i - 1].id ? "bg-gradient-to-r from-sky-500 to-violet-500" : "bg-white/10",
                    ].join(" ")}
                  />
                ) : null}
                <motion.div
                  initial={false}
                  animate={{
                    scale: active ? 1.06 : 1,
                    opacity: active || done ? 1 : 0.45,
                  }}
                  className={[
                    "mx-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                    done
                      ? "border-transparent bg-gradient-to-br from-sky-500 to-fuchsia-500 text-white"
                      : active
                        ? "border-violet-400/50 bg-white/10 text-white"
                        : "border-white/10 bg-black/20 text-white/50",
                  ].join(" ")}
                >
                  {done ? "✓" : s.id}
                </motion.div>
                {i < STEPS.length - 1 ? (
                  <div
                    className={[
                      "h-px flex-1 rounded-full transition-colors duration-500",
                      done ? "bg-gradient-to-r from-violet-500 to-fuchsia-500" : "bg-white/10",
                    ].join(" ")}
                  />
                ) : null}
              </div>
              <span
                className={[
                  "hidden text-[10px] font-medium uppercase tracking-wider sm:block",
                  active ? "text-white" : "text-white/40",
                ].join(" ")}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
