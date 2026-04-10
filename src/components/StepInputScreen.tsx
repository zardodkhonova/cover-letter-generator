"use client";

import { motion } from "framer-motion";
import { GlassCard } from "./ui/GlassCard";
import { GlowInput } from "./ui/GlowInput";
import { GlowTextarea } from "./ui/GlowTextarea";
import { GradientButton } from "./ui/GradientButton";
import { DocumentPreview } from "./DocumentPreview";
import { LETTER_TEMPLATES, type LetterTemplateId } from "@/lib/templates";
import { useWizardStore, type Tone } from "@/store/useWizardStore";

const tones: Tone[] = ["Professional", "Friendly", "Bold"];

export function StepInputScreen() {
  const patch = useWizardStore((s) => s.patch);
  const setStep = useWizardStore((s) => s.setStep);
  const fullName = useWizardStore((s) => s.fullName);
  const email = useWizardStore((s) => s.email);
  const jobTitle = useWizardStore((s) => s.jobTitle);
  const companyName = useWizardStore((s) => s.companyName);
  const jobDescription = useWizardStore((s) => s.jobDescription);
  const tone = useWizardStore((s) => s.tone);
  const templateId = useWizardStore((s) => s.templateId);

  const canContinue =
    fullName.trim() && email.trim() && jobTitle.trim() && companyName.trim() && jobDescription.trim();

  return (
    <div className="mx-auto grid w-full max-w-6xl flex-1 gap-8 px-4 py-6 lg:grid-cols-2 lg:gap-10 lg:px-8">
      <GlassCard className="order-2 lg:order-1">
        <h2 className="text-lg font-semibold text-white">Your details</h2>
        <p className="mt-1 text-sm text-white/45">Step 1 — we’ll use this to personalize every paragraph.</p>
        <form
          className="mt-6 flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (canContinue) setStep(2);
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <GlowInput
              label="Full name"
              name="fullName"
              value={fullName}
              onChange={(e) => patch({ fullName: e.target.value })}
              placeholder="Jordan Lee"
              autoComplete="name"
            />
            <GlowInput
              label="Email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => patch({ email: e.target.value })}
              placeholder="you@email.com"
              autoComplete="email"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <GlowInput
              label="Job title"
              name="jobTitle"
              value={jobTitle}
              onChange={(e) => patch({ jobTitle: e.target.value })}
              placeholder="Product Designer"
            />
            <GlowInput
              label="Company name"
              name="companyName"
              value={companyName}
              onChange={(e) => patch({ companyName: e.target.value })}
              placeholder="Northwind Labs"
            />
          </div>
          <GlowTextarea
            label="Job description"
            name="jobDescription"
            value={jobDescription}
            onChange={(e) => patch({ jobDescription: e.target.value })}
            placeholder="Paste the posting or summarize responsibilities, must-haves, and culture signals."
            rows={8}
            className="min-h-[180px]"
          />
          <div className="flex flex-col gap-2">
            <label htmlFor="tone-step1" className="text-xs font-medium tracking-wide text-white/55">
              Tone
            </label>
            <select
              id="tone-step1"
              value={tone}
              onChange={(e) => patch({ tone: e.target.value as Tone })}
              className="h-11 w-full rounded-xl border border-white/10 bg-black/30 px-4 text-sm text-white/90 outline-none transition-[border-color,box-shadow] duration-300 focus:border-violet-400/50 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)]"
            >
              {tones.map((t) => (
                <option key={t} value={t} className="bg-zinc-900">
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="template-step1" className="text-xs font-medium tracking-wide text-white/55">
              Industry template
            </label>
            <select
              id="template-step1"
              value={templateId}
              onChange={(e) => patch({ templateId: e.target.value as LetterTemplateId })}
              className="h-11 w-full rounded-xl border border-white/10 bg-black/30 px-4 text-sm text-white/90 outline-none transition-[border-color,box-shadow] duration-300 focus:border-violet-400/50 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)]"
            >
              {Object.entries(LETTER_TEMPLATES).map(([id, t]) => (
                <option key={id} value={id} className="bg-zinc-900">
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <GradientButton type="submit" disabled={!canContinue} className="mt-2 w-full sm:w-auto">
            Continue
          </GradientButton>
        </form>
      </GlassCard>

      <motion.div
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.08, duration: 0.4 }}
        className="order-1 flex flex-col lg:order-2"
      >
        <p className="mb-3 text-center text-xs font-medium uppercase tracking-wider text-white/35 lg:text-left">
          Live preview
        </p>
        <DocumentPreview className="flex-1">
          <div className="flex min-h-[240px] flex-col items-center justify-center text-center">
            <p className="max-w-[220px] text-sm text-white/35">
              Your cover letter will appear here after generation.
            </p>
          </div>
        </DocumentPreview>
      </motion.div>
    </div>
  );
}
