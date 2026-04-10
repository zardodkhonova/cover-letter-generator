export type LetterTemplateId = "general" | "software" | "marketing" | "finance" | "design";

export const LETTER_TEMPLATES: Record<
  LetterTemplateId,
  { label: string; promptHint: string }
> = {
  general: {
    label: "General Professional",
    promptHint: "Keep language broadly professional and adaptable to most industries.",
  },
  software: {
    label: "Software Engineering",
    promptHint: "Emphasize delivery, collaboration, architecture, and measurable technical impact.",
  },
  marketing: {
    label: "Marketing/Growth",
    promptHint: "Emphasize positioning, campaign outcomes, funnel metrics, and audience insight.",
  },
  finance: {
    label: "Finance/Operations",
    promptHint: "Emphasize rigor, analysis, risk awareness, and operational discipline.",
  },
  design: {
    label: "Product/UX Design",
    promptHint: "Emphasize user-centered thinking, collaboration, and iterative design impact.",
  },
};
