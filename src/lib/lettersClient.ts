import type { LetterTemplateId } from "./templates";

export type LetterPayload = {
  fullName: string;
  email: string;
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  tone: string;
  templateId: LetterTemplateId;
  generatedLetter: string;
  opening: string;
  body: string;
  closing: string;
};

async function readErrorMessage(res: Response): Promise<string> {
  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    try {
      const data = (await res.json()) as { error?: string };
      return data.error ?? `Request failed (${res.status}).`;
    } catch {
      return `Request failed (${res.status}).`;
    }
  }
  const text = await res.text();
  if (text.trim()) return text.slice(0, 240);
  if (res.status === 401) return "Please sign in first.";
  return `Request failed (${res.status}).`;
}

export async function saveDraft(payload: LetterPayload) {
  const res = await fetch("/api/letters/draft", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await readErrorMessage(res));
}

export async function saveFinalLetter(payload: LetterPayload) {
  const res = await fetch("/api/letters", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, status: "saved" }),
  });
  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }
}
