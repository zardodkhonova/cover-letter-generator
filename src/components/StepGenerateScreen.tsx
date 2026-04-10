"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import * as Sentry from "@sentry/nextjs";
import { DocumentPreview } from "./DocumentPreview";
import { GlassCard } from "./ui/GlassCard";
import { GlowTextarea } from "./ui/GlowTextarea";
import { GradientButton } from "./ui/GradientButton";
import { AiTypingAnimation } from "./AiTypingAnimation";
import { FloatingToolbar } from "./FloatingToolbar";
import { fetchCoverLetterFromGroq } from "@/lib/groqClient";
import { trackAction } from "@/lib/analytics/events";
import { LETTER_TEMPLATES, type LetterTemplateId } from "@/lib/templates";
import { splitLetterIntoSections } from "@/lib/letterSections";
import { useWizardStore, type Tone } from "@/store/useWizardStore";

const tones: Tone[] = ["Professional", "Friendly", "Bold"];

function applyWrap(
  el: HTMLTextAreaElement,
  open: string,
  close: string,
  setValue: (v: string) => void,
  current: string
) {
  const start = el.selectionStart;
  const end = el.selectionEnd;
  const sel = current.slice(start, end);
  const next = current.slice(0, start) + open + sel + close + current.slice(end);
  setValue(next);
  requestAnimationFrame(() => {
    el.focus();
    const pos = start + open.length + sel.length;
    el.setSelectionRange(start + open.length, pos);
  });
}

export function StepGenerateScreen() {
  const patch = useWizardStore((s) => s.patch);
  const setStep = useWizardStore((s) => s.setStep);
  const setGenerating = useWizardStore((s) => s.setGenerating);
  const setLetterFresh = useWizardStore((s) => s.setLetterFresh);
  const fullName = useWizardStore((s) => s.fullName);
  const jobTitle = useWizardStore((s) => s.jobTitle);
  const companyName = useWizardStore((s) => s.companyName);
  const jobDescription = useWizardStore((s) => s.jobDescription);
  const tone = useWizardStore((s) => s.tone);
  const templateId = useWizardStore((s) => s.templateId);
  const generatedLetter = useWizardStore((s) => s.generatedLetter);
  const isGenerating = useWizardStore((s) => s.isGenerating);
  const letterFresh = useWizardStore((s) => s.letterFresh);

  const taRef = useRef<HTMLTextAreaElement>(null);
  const [typing, setTyping] = useState(false);
  const [streamText, setStreamText] = useState("");
  const [animKey, setAnimKey] = useState(0);
  const [toolbarBusy, setToolbarBusy] = useState(false);
  const [transformError, setTransformError] = useState<string | null>(null);
  const [genError, setGenError] = useState<string | null>(null);
  const [selectionRange, setSelectionRange] = useState<{ start: number; end: number } | null>(null);

  const setLetter = useCallback(
    (v: string) => {
      patch({ generatedLetter: v });
    },
    [patch]
  );

  const runGenerate = useCallback(async () => {
    setGenError(null);
    setGenerating(true);
    setLetterFresh(false);
    try {
      const text = await fetchCoverLetterFromGroq({
        fullName,
        companyName,
        jobTitle,
        jobDescription,
        tone,
        templateId,
      });
      if (!text?.trim()) {
        setGenError("No content returned. Check your details and try again.");
        return;
      }
      setStreamText(text);
      setAnimKey((k) => k + 1);
      setTyping(true);
      trackAction("generate_cover_letter", { tone, templateId });
    } catch (e) {
      Sentry.captureException(e);
      setGenError(e instanceof Error ? e.message : "Generation failed. Please try again.");
    } finally {
      setGenerating(false);
    }
  }, [companyName, fullName, jobDescription, jobTitle, setGenerating, setLetterFresh, templateId, tone]);
  async function transformSelected(mode: "improve" | "shorten" | "expand") {
    const el = taRef.current;
    if (!el) return;
    const start = selectionRange?.start ?? el.selectionStart;
    const end = selectionRange?.end ?? el.selectionEnd;
    if (start === end) {
      setTransformError("Select some text in the editor first.");
      return;
    }
    const sel = generatedLetter.slice(start, end);
    setToolbarBusy(true);
    setTransformError(null);
    try {
      const res = await fetch("/api/transform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, selected: sel }),
      });
      const text = await res.text();
      let data: { text?: string; error?: string } = {};
      try {
        data = JSON.parse(text) as { text?: string; error?: string };
      } catch {
        data = { error: text || `Transform failed (${res.status}).` };
      }
      if (!res.ok || !data.text) throw new Error(data.error ?? "Transform failed.");
      const transformed = data.text;
      const next = generatedLetter.slice(0, start) + transformed + generatedLetter.slice(end);
      setLetter(next);
      setSelectionRange({ start, end: start + transformed.length });
      requestAnimationFrame(() => {
        if (!taRef.current) return;
        taRef.current.focus();
        taRef.current.setSelectionRange(start, start + transformed.length);
      });
      trackAction("transform_text", { mode });
    } catch (e) {
      Sentry.captureException(e);
      setTransformError(e instanceof Error ? e.message : "Transform failed.");
    } finally {
      setToolbarBusy(false);
    }
  }


  /** Uses `fullText` from the typing component so the store always gets the real letter (no stale state). */
  const onTypingDone = useCallback(
    (fullText: string) => {
      if (!fullText.trim()) {
        setTyping(false);
        return;
      }
      const parts = splitLetterIntoSections(fullText);
      patch({
        generatedLetter: fullText,
        opening: parts.opening,
        body: parts.body,
        closing: parts.closing,
      });
      setTyping(false);
      setLetterFresh(true);
    },
    [patch, setLetterFresh]
  );

  useEffect(() => {
    if (!letterFresh) return;
    const t = window.setTimeout(() => setLetterFresh(false), 2200);
    return () => window.clearTimeout(t);
  }, [letterFresh, setLetterFresh]);

  const hasLetter = generatedLetter.trim().length > 0;
  const showEditor = hasLetter && !typing;

  return (
    <div className="mx-auto grid w-full max-w-6xl flex-1 gap-8 px-4 py-6 lg:grid-cols-2 lg:gap-10 lg:px-8">
      <GlassCard className="order-2 flex flex-col lg:order-1">
        <h2 className="text-lg font-semibold text-white">AI controls</h2>
        <p className="mt-1 text-sm text-white/45">Step 2 — refine the brief, then generate.</p>

        <div className="mt-6 flex flex-col gap-4">
          <GlowTextarea
            label="Job description"
            name="jobDescription"
            value={jobDescription}
            onChange={(e) => patch({ jobDescription: e.target.value })}
            rows={6}
            className="min-h-[140px]"
          />
          <div className="flex flex-col gap-2">
            <label htmlFor="tone-step2" className="text-xs font-medium text-white/55">
              Tone
            </label>
            <select
              id="tone-step2"
              value={tone}
              onChange={(e) => patch({ tone: e.target.value as Tone })}
              className="h-11 w-full rounded-xl border border-white/10 bg-black/30 px-4 text-sm text-white/90 outline-none focus:border-violet-400/50 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)]"
            >
              {tones.map((t) => (
                <option key={t} value={t} className="bg-zinc-900">
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="template-step2" className="text-xs font-medium text-white/55">
              Industry template
            </label>
            <select
              id="template-step2"
              value={templateId}
              onChange={(e) => patch({ templateId: e.target.value as LetterTemplateId })}
              className="h-11 w-full rounded-xl border border-white/10 bg-black/30 px-4 text-sm text-white/90 outline-none focus:border-violet-400/50 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)]"
            >
              {Object.entries(LETTER_TEMPLATES).map(([id, t]) => (
                <option key={id} value={id} className="bg-zinc-900">
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap gap-3">
            <GradientButton
              disabled={isGenerating || typing}
              onClick={() => {
                void runGenerate();
              }}
            >
              Generate ✨
            </GradientButton>
            <GradientButton
              variant="ghost"
              disabled={isGenerating || typing || !hasLetter}
              onClick={() => {
                void runGenerate();
              }}
            >
              Regenerate 🔄
            </GradientButton>
          </div>

          {isGenerating ? (
            <p className="text-sm font-medium text-violet-300/90">AI is generating…</p>
          ) : null}
          {genError ? (
            <p className="text-sm font-medium text-red-400/90" role="alert">
              {genError}
            </p>
          ) : null}
          {transformError ? (
            <p className="text-sm font-medium text-red-400/90" role="alert">
              {transformError}
            </p>
          ) : null}

          {showEditor ? (
            <GradientButton
              variant="ghost"
              className="mt-2 w-full border-violet-500/20 !bg-violet-500/10 !text-violet-200"
              onClick={() => setStep(3)}
            >
              Continue to review
            </GradientButton>
          ) : null}
        </div>
      </GlassCard>

      <div className="order-1 flex min-h-[320px] flex-col lg:order-2">
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-white/35">Editor</p>
        <div
          className={[
            "relative flex flex-1 flex-col rounded-2xl transition-[box-shadow] duration-500",
            letterFresh && showEditor ? "shadow-[0_0_0_2px_rgba(139,92,246,0.35),0_12px_48px_rgba(99,102,241,0.12)]" : "",
          ].join(" ")}
        >
          {!hasLetter && !typing ? (
            <DocumentPreview className="flex-1">
              <div className="flex min-h-[260px] flex-col items-center justify-center text-center">
                <p className="max-w-[260px] text-sm text-white/35">
                  Your cover letter will appear here…
                </p>
              </div>
            </DocumentPreview>
          ) : null}

          {typing ? (
            <AiTypingAnimation text={streamText} animKey={animKey} onComplete={onTypingDone} className="flex-1" />
          ) : null}

          {showEditor ? (
            <>
              <textarea
                ref={taRef}
                value={generatedLetter}
                onSelect={(e) => {
                  const el = e.currentTarget;
                  setSelectionRange({ start: el.selectionStart, end: el.selectionEnd });
                }}
                onChange={(e) => {
                  const v = e.target.value;
                  setLetter(v);
                  const parts = splitLetterIntoSections(v);
                  patch({ opening: parts.opening, body: parts.body, closing: parts.closing });
                }}
                onMouseUp={(e) => {
                  const el = e.currentTarget;
                  setSelectionRange({ start: el.selectionStart, end: el.selectionEnd });
                }}
                onKeyUp={(e) => {
                  const el = e.currentTarget;
                  setSelectionRange({ start: el.selectionStart, end: el.selectionEnd });
                }}
                className="min-h-[320px] flex-1 resize-y rounded-2xl border border-white/10 bg-black/30 p-4 text-sm leading-relaxed text-white/90 outline-none transition-[border-color,box-shadow] duration-300 focus:border-violet-400/50 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)]"
                spellCheck
              />
              <div className="pointer-events-none absolute bottom-4 right-4 flex justify-end">
                <div className="pointer-events-auto">
                  <FloatingToolbar
                    busy={toolbarBusy}
                    disabled={false}
                    onBold={() => {
                      const el = taRef.current;
                      if (!el) return;
                      applyWrap(el, "**", "**", setLetter, generatedLetter);
                    }}
                    onItalic={() => {
                      const el = taRef.current;
                      if (!el) return;
                      applyWrap(el, "*", "*", setLetter, generatedLetter);
                    }}
                    onImprove={() => {
                      void transformSelected("improve");
                    }}
                    onShorten={() => {
                      void transformSelected("shorten");
                    }}
                    onExpand={() => {
                      void transformSelected("expand");
                    }}
                  />
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
