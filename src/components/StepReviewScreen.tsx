"use client";

import { motion, AnimatePresence } from "framer-motion";
import * as Sentry from "@sentry/nextjs";
import { useCallback, useState, type SyntheticEvent } from "react";
import { GlassCard } from "./ui/GlassCard";
import { GradientButton } from "./ui/GradientButton";
import { trackAction } from "@/lib/analytics/events";
import { joinSections } from "@/lib/letterSections";
import { useWizardStore } from "@/store/useWizardStore";

type Field = "opening" | "body" | "closing";

function sectionLabel(f: Field): string {
  if (f === "opening") return "Opening";
  if (f === "body") return "Body";
  return "Closing";
}

export function StepReviewScreen() {
  const patch = useWizardStore((s) => s.patch);
  const setStep = useWizardStore((s) => s.setStep);
  const opening = useWizardStore((s) => s.opening);
  const body = useWizardStore((s) => s.body);
  const closing = useWizardStore((s) => s.closing);

  const [selection, setSelection] = useState<{
    field: Field;
    start: number;
    end: number;
  } | null>(null);
  const [suggestBusy, setSuggestBusy] = useState(false);

  const syncLetter = useCallback(
    (next: { opening?: string; body?: string; closing?: string }) => {
      const o = next.opening ?? opening;
      const b = next.body ?? body;
      const c = next.closing ?? closing;
      patch({
        opening: o,
        body: b,
        closing: c,
        generatedLetter: joinSections(o, b, c),
      });
    },
    [body, closing, opening, patch]
  );

  const onSelectField = (field: Field) => (e: SyntheticEvent<HTMLTextAreaElement>) => {
    const el = e.currentTarget;
    if (el.selectionStart !== el.selectionEnd) {
      setSelection({ field, start: el.selectionStart, end: el.selectionEnd });
    } else {
      setSelection(null);
    }
  };

  const applySuggestion = async () => {
    if (!selection) return;
    const text =
      selection.field === "opening"
        ? opening
        : selection.field === "body"
          ? body
          : closing;
    const selText = text.slice(selection.start, selection.end);
    if (!selText.trim()) return;
    setSuggestBusy(true);
    try {
      const res = await fetch("/api/transform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "suggest", selected: selText }),
      });
      const data = (await res.json()) as { text?: string; error?: string };
      if (!res.ok || !data.text) throw new Error(data.error ?? "Suggestion failed.");
      const suggestion = data.text;
      const nextBlock =
        text.slice(0, selection.start) + suggestion + text.slice(selection.end);
      if (selection.field === "opening") syncLetter({ opening: nextBlock });
      else if (selection.field === "body") syncLetter({ body: nextBlock });
      else syncLetter({ closing: nextBlock });
      setSelection(null);
      trackAction("inline_ai_suggestion");
    } catch (e) {
      Sentry.captureException(e);
    } finally {
      setSuggestBusy(false);
    }
  };

  const fieldClass =
    "min-h-[100px] w-full resize-y rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-relaxed text-white/90 outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-white/25 focus:border-violet-400/50 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)]";

  return (
    <div className="relative mx-auto w-full max-w-3xl flex-1 px-4 py-6 sm:px-8">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-white">Review &amp; edit</h2>
          <p className="mt-1 text-sm text-white/45">Step 3 — Notion-style sections. Select text for an inline AI suggestion.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs text-white/35">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" aria-hidden />
            Auto-save
          </span>
          <GradientButton variant="ghost" className="!py-2 !text-xs" onClick={() => setStep(4)}>
            Continue to export
          </GradientButton>
        </div>
      </div>

      <GlassCard className="!p-0 overflow-hidden" hover={false}>
        <div className="divide-y divide-white/10">
          {(["opening", "body", "closing"] as const).map((field) => (
            <div key={field} className="p-5 sm:p-6">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-white/40">
                  {sectionLabel(field)}
                </span>
              </div>
              <textarea
                className={fieldClass}
                value={field === "opening" ? opening : field === "body" ? body : closing}
                onChange={(e) => {
                  const v = e.target.value;
                  if (field === "opening") syncLetter({ opening: v });
                  else if (field === "body") syncLetter({ body: v });
                  else syncLetter({ closing: v });
                }}
                onMouseUp={onSelectField(field)}
                onKeyUp={onSelectField(field)}
                spellCheck
              />
            </div>
          ))}
        </div>
      </GlassCard>

      <AnimatePresence>
        {selection ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 flex-wrap items-center justify-center gap-2 rounded-2xl border border-white/10 bg-zinc-950/90 px-4 py-3 shadow-2xl backdrop-blur-xl sm:bottom-10"
          >
            <span className="text-xs text-white/50">Selection in {sectionLabel(selection.field)}</span>
            <GradientButton
              variant="ghost"
              className="!py-2 !text-xs"
              disabled={suggestBusy}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => void applySuggestion()}
            >
              {suggestBusy ? "Working…" : "AI suggestion"}
            </GradientButton>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
