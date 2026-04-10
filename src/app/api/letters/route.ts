import { auth } from "@clerk/nextjs/server";
import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("cover_letters")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(100);
  if (error) {
    Sentry.captureException(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ letters: data ?? [] });
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json()) as Record<string, unknown>;
  const supabase = getSupabaseAdmin();
  const payload = {
    user_id: userId,
    full_name: String(body.fullName ?? ""),
    email: String(body.email ?? ""),
    job_title: String(body.jobTitle ?? ""),
    company_name: String(body.companyName ?? ""),
    tone: String(body.tone ?? "Professional"),
    template_id: String(body.templateId ?? "general"),
    job_description: String(body.jobDescription ?? ""),
    letter_text: String(body.generatedLetter ?? ""),
    opening: String(body.opening ?? ""),
    body: String(body.body ?? ""),
    closing: String(body.closing ?? ""),
    status: String(body.status ?? "draft"),
  };
  const { data, error } = await supabase.from("cover_letters").insert(payload).select("*").single();
  if (error) {
    Sentry.captureException(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ letter: data });
}
