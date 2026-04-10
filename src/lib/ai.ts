import { LETTER_TEMPLATES, type LetterTemplateId } from "./templates";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.1-8b-instant";

function toneInstruction(tone: string): string {
  switch (tone.toLowerCase()) {
    case "friendly":
      return "Use a warm, approachable tone that still sounds professional.";
    case "bold":
      return "Use a confident, direct tone—show strong fit and impact without sounding arrogant.";
    default:
      return "Use a polished, professional tone suitable for formal applications.";
  }
}

export function buildPrompt(params: {
  fullName: string;
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  tone: string;
  templateId: LetterTemplateId;
}) {
  const template = LETTER_TEMPLATES[params.templateId] ?? LETTER_TEMPLATES.general;
  return [
    "Write a concise cover letter (about 3–5 short paragraphs) for the role below.",
    "Include a clear opening, a body that connects the candidate to the role and company, and a strong closing.",
    "Output only the cover letter text. No markdown fences or commentary.",
    "",
    `Candidate name: ${params.fullName}`,
    `Job title: ${params.jobTitle}`,
    `Company: ${params.companyName}`,
    `Requested tone: ${params.tone}`,
    `Template profile: ${template.label}`,
    `Template guidance: ${template.promptHint}`,
    toneInstruction(params.tone),
    "",
    "Job description / posting:",
    params.jobDescription,
  ].join("\n");
}

export async function callGroq(prompt: string, apiKey: string): Promise<string> {
  const res = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        {
          role: "system",
          content: "You are an expert career assistant writing personalized cover letters.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });
  const raw = await res.text();
  if (!res.ok) throw new Error(`Groq API error (${res.status}): ${raw.slice(0, 400)}`);
  const parsed = JSON.parse(raw) as {
    choices?: Array<{ message?: { content?: string | null } }>;
  };
  const content = parsed.choices?.[0]?.message?.content?.trim() ?? "";
  if (!content) throw new Error("Groq returned empty content.");
  return content;
}
