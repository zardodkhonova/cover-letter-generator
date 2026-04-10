"use client";

import { useState } from "react";
import { DocumentPreview } from "./DocumentPreview";
import { GradientButton } from "./ui/GradientButton";
import { saveFinalLetter } from "@/lib/lettersClient";
import { trackAction } from "@/lib/analytics/events";
import { joinSections } from "@/lib/letterSections";
import { useWizardStore } from "@/store/useWizardStore";

export function StepFinalizeScreen() {
  const opening = useWizardStore((s) => s.opening);
  const body = useWizardStore((s) => s.body);
  const closing = useWizardStore((s) => s.closing);
  const generatedLetter = useWizardStore((s) => s.generatedLetter);
  const fullName = useWizardStore((s) => s.fullName);
  const email = useWizardStore((s) => s.email);
  const jobTitle = useWizardStore((s) => s.jobTitle);
  const companyName = useWizardStore((s) => s.companyName);
  const jobDescription = useWizardStore((s) => s.jobDescription);
  const tone = useWizardStore((s) => s.tone);
  const templateId = useWizardStore((s) => s.templateId);
  const startNewLetter = useWizardStore((s) => s.startNewLetter);
  const setStep = useWizardStore((s) => s.setStep);

  const fullText = generatedLetter.trim() || joinSections(opening, body, closing);
  const [copied, setCopied] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [saveBusy, setSaveBusy] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
      trackAction("copy_cover_letter");
    } catch {
      /* ignore */
    }
  };

  const exportPdf = async () => {
    setPdfBusy(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "mm", format: "a4" });
      const lines = doc.splitTextToSize(fullText.replace(/\*\*/g, ""), 180);
      doc.setFontSize(11);
      doc.text(lines, 14, 24);
      doc.save("cover-letter.pdf");
      trackAction("export_pdf");
    } finally {
      setPdfBusy(false);
    }
  };

  const save = async () => {
    setSaveError(null);
    setSaveBusy(true);
    try {
      await saveFinalLetter({
        fullName,
        email,
        jobTitle,
        companyName,
        jobDescription,
        tone,
        templateId,
        generatedLetter: fullText,
        opening,
        body,
        closing,
      });
      trackAction("save_cover_letter");
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Failed to save letter.");
    } finally {
      setSaveBusy(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-6 sm:px-8">
      <div className="mb-8 text-center">
        <h2 className="text-xl font-semibold text-white">Finalize</h2>
        <p className="mt-1 text-sm text-white/45">Step 4 — export or start a fresh letter.</p>
      </div>

      <DocumentPreview className="mb-8">
        <pre className="whitespace-pre-wrap font-sans text-[13px] leading-[1.75] text-white/85">
          {fullText || "Nothing to preview yet."}
        </pre>
      </DocumentPreview>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <GradientButton variant="ghost" disabled={saveBusy || !fullText.trim()} onClick={() => void save()}>
          {saveBusy ? "Saving..." : "Save to account"}
        </GradientButton>
        <GradientButton disabled={pdfBusy || !fullText.trim()} onClick={() => void exportPdf()}>
          {pdfBusy ? "Preparing PDF…" : "Export as PDF"}
        </GradientButton>
        <GradientButton variant="ghost" disabled={!fullText.trim()} onClick={() => void copy()}>
          {copied ? "Copied!" : "Copy to clipboard"}
        </GradientButton>
      </div>
      {saveError ? <p className="mt-3 text-center text-sm text-red-400">{saveError}</p> : null}

      <div className="mt-10 flex justify-center border-t border-white/10 pt-8">
        <GradientButton
          variant="ghost"
          className="border border-white/10 !bg-transparent"
          onClick={() => startNewLetter()}
        >
          Generate another
        </GradientButton>
      </div>
    </div>
  );
}
