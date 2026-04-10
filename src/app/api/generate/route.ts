import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { buildPrompt, callGroq } from "@/lib/ai";
import type { LetterTemplateId } from "@/lib/templates";

/**
 * POST /api/generate — calls Groq on the server; `GROQ_API_KEY` never reaches the browser.
 */
export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Server is missing GROQ_API_KEY. Create frontend/.env.local with GROQ_API_KEY=your_key and restart `npm run dev`.",
      },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const d = body as Record<string, unknown>;
  const fullName = String(d.fullName ?? "").trim();
  const jobTitle = String(d.jobTitle ?? "").trim();
  const companyName = String(d.companyName ?? "").trim();
  const jobDescription = String(d.jobDescription ?? "").trim();
  const tone = String(d.tone ?? "Professional").trim() || "Professional";
  const templateId = String(d.templateId ?? "general").trim() as LetterTemplateId;

  if (!fullName || !jobTitle || !companyName || !jobDescription) {
    return NextResponse.json(
      { error: "Please provide full name, job title, company name, and job description." },
      { status: 400 }
    );
  }

  const userContent = buildPrompt({
    fullName,
    jobTitle,
    companyName,
    jobDescription,
    tone,
    templateId,
  });

  try {
    const coverLetter = await callGroq(userContent, apiKey);
    return NextResponse.json({ coverLetter });
  } catch (e) {
    Sentry.captureException(e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Unexpected server error." },
      { status: 500 }
    );
  }
}
