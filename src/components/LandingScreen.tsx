"use client";

import { motion } from "framer-motion";
import { GlassCard } from "./ui/GlassCard";
import { GradientButton } from "./ui/GradientButton";
import { trackAction } from "@/lib/analytics/events";
import { useWizardStore } from "@/store/useWizardStore";

const features = [
  {
    title: "AI-powered writing",
    body: "Instant drafts tuned to your role, company, and tone—without the blank page.",
  },
  {
    title: "ATS optimized",
    body: "Clean structure and readable formatting that plays nicely with screening tools.",
  },
  {
    title: "Instant generation",
    body: "Go from job description to polished letter in one guided flow.",
  },
  {
    title: "Edit with confidence",
    body: "Section-based review, quick AI tweaks, and export when you’re ready.",
  },
];

export function LandingScreen() {
  const setPhase = useWizardStore((s) => s.setPhase);
  const setStep = useWizardStore((s) => s.setStep);

  return (
    <div className="relative flex flex-1 flex-col">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-sky-500/20 blur-[100px]"
          animate={{ opacity: [0.4, 0.65, 0.4], scale: [1, 1.08, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-24 bottom-32 h-80 w-80 rounded-full bg-fuchsia-500/15 blur-[110px]"
          animate={{ opacity: [0.35, 0.6, 0.35], scale: [1.05, 1, 1.05] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-violet-600/10 blur-[90px]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center px-4 pb-20 pt-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-violet-300/80">
            Next-gen applications
          </p>
          <h1 className="mx-auto max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
            <span className="bg-gradient-to-r from-sky-300 via-violet-300 to-pink-300 bg-clip-text text-transparent">
              Create Your Professional
            </span>
            <br />
            <span className="text-white">Cover Letter</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/50">
            A calm, focused workspace to craft letters that sound like you—structured for clarity,
            speed, and modern hiring workflows.
          </p>
          <div className="mt-10 flex justify-center">
            <GradientButton
              className="!px-8 !py-3.5 !text-base"
              onClick={() => {
                setPhase("wizard");
                setStep(1);
                trackAction("start_wizard");
              }}
            >
              Get Started
            </GradientButton>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="mt-20 grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i + 0.2 }}
            >
              <GlassCard className="!p-5 h-full" hover>
                <h3 className="text-sm font-semibold text-white">{f.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-white/45">{f.body}</p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
