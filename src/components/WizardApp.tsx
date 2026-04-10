"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { LandingScreen } from "./LandingScreen";
import { Navbar } from "./Navbar";
import { StepFinalizeScreen } from "./StepFinalizeScreen";
import { StepGenerateScreen } from "./StepGenerateScreen";
import { StepInputScreen } from "./StepInputScreen";
import { StepReviewScreen } from "./StepReviewScreen";
import { BackButton } from "./ui/BackButton";
import { StepProgress } from "./ui/StepProgress";
import { trackAction } from "@/lib/analytics/events";
import { saveDraft } from "@/lib/lettersClient";
import type { LetterTemplateId } from "@/lib/templates";
import { useWizardStore, wizardPersistSlice } from "@/store/useWizardStore";

export function WizardApp() {
  const [mounted, setMounted] = useState(false);
  const { isSignedIn } = useAuth();
  const searchParams = useSearchParams();
  const phase = useWizardStore((s) => s.phase);
  const step = useWizardStore((s) => s.step);
  const hydrate = useWizardStore((s) => s.hydrate);
  const persist = useWizardStore((s) => s.persist);
  const patch = useWizardStore((s) => s.patch);
  const setPhase = useWizardStore((s) => s.setPhase);
  const setStep = useWizardStore((s) => s.setStep);

  useEffect(() => {
    setMounted(true);
    hydrate();
    trackAction("page_view_home");
  }, [hydrate]);

  useEffect(() => {
    if (!mounted) return;
    let t: number | undefined;
    let prev = JSON.stringify(wizardPersistSlice(useWizardStore.getState()));
    const unsub = useWizardStore.subscribe((state) => {
      const next = JSON.stringify(wizardPersistSlice(state));
      if (next === prev) return;
      prev = next;
      if (t !== undefined) window.clearTimeout(t);
      t = window.setTimeout(() => persist(), 550);
    });
    return () => {
      if (t !== undefined) window.clearTimeout(t);
      unsub();
    };
  }, [mounted, persist]);

  useEffect(() => {
    if (!mounted || !isSignedIn) return;
    let t: number | undefined;
    const unsub = useWizardStore.subscribe((state) => {
      if (state.phase !== "wizard") return;
      if (t !== undefined) window.clearTimeout(t);
      t = window.setTimeout(() => {
        void saveDraft({
          fullName: state.fullName,
          email: state.email,
          jobTitle: state.jobTitle,
          companyName: state.companyName,
          jobDescription: state.jobDescription,
          tone: state.tone,
          templateId: state.templateId,
          generatedLetter: state.generatedLetter,
          opening: state.opening,
          body: state.body,
          closing: state.closing,
        });
      }, 1500);
    });
    return () => {
      if (t !== undefined) window.clearTimeout(t);
      unsub();
    };
  }, [isSignedIn, mounted]);

  useEffect(() => {
    if (!mounted || !isSignedIn) return;
    const draftId = searchParams.get("draftId");
    if (!draftId) return;
    void (async () => {
      const res = await fetch(`/api/letters/${draftId}`);
      if (!res.ok) return;
      const data = (await res.json()) as {
        letter?: {
          full_name?: string;
          email?: string;
          job_title?: string;
          company_name?: string;
          job_description?: string;
          tone?: "Professional" | "Friendly" | "Bold";
          template_id?: string;
          letter_text?: string;
          opening?: string;
          body?: string;
          closing?: string;
        };
      };
      const l = data.letter;
      if (!l) return;
      patch({
        fullName: l.full_name ?? "",
        email: l.email ?? "",
        jobTitle: l.job_title ?? "",
        companyName: l.company_name ?? "",
        jobDescription: l.job_description ?? "",
        tone: (l.tone as "Professional" | "Friendly" | "Bold") ?? "Professional",
        templateId: (l.template_id as LetterTemplateId) ?? "general",
        generatedLetter: l.letter_text ?? "",
        opening: l.opening ?? "",
        body: l.body ?? "",
        closing: l.closing ?? "",
      });
      setPhase("wizard");
      setStep(2);
    })();
  }, [isSignedIn, mounted, patch, searchParams, setPhase, setStep]);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#05060a] text-sm text-white/40">
        Loading…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#05060a] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.22),transparent)]" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(56,189,248,0.08),transparent_45%)]" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar showLogin={phase === "landing"} />
        {phase === "wizard" ? (
          <div className="px-4 sm:px-8">
            <div className="mx-auto w-full max-w-6xl">
              <BackButton
                label="Back"
                onClick={() => {
                  if (step === 1) {
                    setPhase("landing");
                    return;
                  }
                  if (step === 2) setStep(1);
                  else if (step === 3) setStep(2);
                  else if (step === 4) setStep(3);
                }}
              />
            </div>
          </div>
        ) : null}

        {phase === "landing" ? (
          <LandingScreen />
        ) : (
          <div className="flex flex-1 flex-col">
            <div className="mx-auto w-full max-w-6xl px-4 pb-2 pt-2 sm:px-8">
              <StepProgress current={step} />
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-1 flex-col"
              >
                {step === 1 ? (
                  <StepInputScreen />
                ) : step === 2 ? (
                  <StepGenerateScreen />
                ) : step === 3 ? (
                  <StepReviewScreen />
                ) : (
                  <StepFinalizeScreen />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
