import { create } from "zustand";
import type { LetterTemplateId } from "@/lib/templates";

export type WizardStep = 1 | 2 | 3 | 4;
export type Tone = "Professional" | "Friendly" | "Bold";

const STORAGE_KEY = "cover-letter-wizard-v1";

export type WizardState = {
  phase: "landing" | "wizard";
  step: WizardStep;
  fullName: string;
  email: string;
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  tone: Tone;
  templateId: LetterTemplateId;
  generatedLetter: string;
  opening: string;
  body: string;
  closing: string;
  /** Ephemeral UI — not persisted */
  isGenerating: boolean;
  /** Brief highlight after typing completes (step 2) */
  letterFresh: boolean;
  setPhase: (phase: "landing" | "wizard") => void;
  setStep: (step: WizardStep) => void;
  patch: (
    partial: Partial<
      Pick<
        WizardState,
        | "fullName"
        | "email"
        | "jobTitle"
        | "companyName"
        | "jobDescription"
        | "tone"
        | "templateId"
        | "generatedLetter"
        | "opening"
        | "body"
        | "closing"
      >
    >
  ) => void;
  setGenerated: (text: string) => void;
  setSections: (o: Partial<Pick<WizardState, "opening" | "body" | "closing">>) => void;
  setGenerating: (v: boolean) => void;
  setLetterFresh: (v: boolean) => void;
  hydrate: () => void;
  persist: () => void;
  reset: () => void;
  /** Reset all data and return to landing */
  startNewLetter: () => void;
};

const initial = {
  phase: "landing" as const,
  step: 1 as WizardStep,
  fullName: "",
  email: "",
  jobTitle: "",
  companyName: "",
  jobDescription: "",
  tone: "Professional" as Tone,
  templateId: "general" as LetterTemplateId,
  generatedLetter: "",
  opening: "",
  body: "",
  closing: "",
  isGenerating: false,
  letterFresh: false,
};

/** Serializable slice for localStorage + change detection (excludes ephemeral UI). */
export function wizardPersistSlice(state: WizardState) {
  return {
    phase: state.phase,
    step: state.step,
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
  };
}

export const useWizardStore = create<WizardState>((set, get) => ({
  ...initial,
  setPhase: (phase) => set({ phase }),
  setStep: (step) => set({ step }),
  patch: (partial) => set(partial),
  setGenerated: (generatedLetter) => set({ generatedLetter }),
  setSections: (partial) => set(partial),
  setGenerating: (isGenerating) => set({ isGenerating }),
  setLetterFresh: (letterFresh) => set({ letterFresh }),
  hydrate: () => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw) as Partial<WizardState>;
      set({
        ...initial,
        phase: (data.phase as WizardState["phase"]) ?? initial.phase,
        step: (data.step as WizardStep) ?? initial.step,
        fullName: typeof data.fullName === "string" ? data.fullName : initial.fullName,
        email: typeof data.email === "string" ? data.email : initial.email,
        jobTitle: typeof data.jobTitle === "string" ? data.jobTitle : initial.jobTitle,
        companyName: typeof data.companyName === "string" ? data.companyName : initial.companyName,
        jobDescription: typeof data.jobDescription === "string" ? data.jobDescription : initial.jobDescription,
        tone: (data.tone as Tone) ?? initial.tone,
        templateId:
          typeof data.templateId === "string"
            ? (data.templateId as LetterTemplateId)
            : initial.templateId,
        generatedLetter: typeof data.generatedLetter === "string" ? data.generatedLetter : initial.generatedLetter,
        opening: typeof data.opening === "string" ? data.opening : initial.opening,
        body: typeof data.body === "string" ? data.body : initial.body,
        closing: typeof data.closing === "string" ? data.closing : initial.closing,
        isGenerating: false,
        letterFresh: false,
      });
    } catch {
      /* ignore */
    }
  },
  persist: () => {
    if (typeof window === "undefined") return;
    try {
      const state = get();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wizardPersistSlice(state)));
    } catch {
      /* ignore */
    }
  },
  reset: () => set({ ...initial }),
  startNewLetter: () => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* ignore */
      }
    }
    set({ ...initial, phase: "landing" });
  },
}));
