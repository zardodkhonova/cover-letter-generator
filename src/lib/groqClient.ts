import type { LetterTemplateId } from "./templates";

/**
 * Calls the Next.js API route, which forwards to Groq (API key stays server-side).
 */
export async function fetchCoverLetterFromGroq(payload: {
  fullName: string;
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  tone: string;
  templateId: LetterTemplateId;
}): Promise<string> {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = (await res.json()) as { coverLetter?: string; error?: string };

  if (!res.ok) {
    throw new Error(data.error ?? "Failed to generate cover letter.");
  }

  const letter = data.coverLetter?.trim() ?? "";
  if (!letter) {
    throw new Error(data.error ?? "Empty response from AI.");
  }

  return letter;
}
