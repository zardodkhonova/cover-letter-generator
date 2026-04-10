import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";
import { callGroq } from "@/lib/ai";

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "Missing GROQ_API_KEY" }, { status: 500 });

  const body = (await request.json()) as {
    mode?: "improve" | "shorten" | "expand" | "suggest";
    selected?: string;
  };
  const selected = (body.selected ?? "").trim();
  const mode = body.mode ?? "improve";
  if (!selected) return NextResponse.json({ error: "Missing selected text." }, { status: 400 });

  const instruction =
    mode === "shorten"
      ? "Shorten this text while preserving meaning."
      : mode === "expand"
        ? "Expand this text with stronger detail while remaining concise and professional."
        : mode === "suggest"
          ? "Provide one improved inline suggestion for this selection."
          : "Improve this text for clarity, confidence, and professional tone.";

  try {
    const result = await callGroq(`${instruction}\n\nText:\n${selected}`, apiKey);
    return NextResponse.json({ text: result });
  } catch (e) {
    Sentry.captureException(e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Transform failed." },
      { status: 500 }
    );
  }
}
