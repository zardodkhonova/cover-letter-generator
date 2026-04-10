import { auth } from "@clerk/nextjs/server";
import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("cover_letters")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single();
  if (error) {
    Sentry.captureException(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ letter: data });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = (await request.json()) as Record<string, unknown>;
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("cover_letters")
    .update({
      letter_text: String(body.generatedLetter ?? ""),
      opening: String(body.opening ?? ""),
      body: String(body.body ?? ""),
      closing: String(body.closing ?? ""),
      status: String(body.status ?? "saved"),
    })
    .eq("id", id)
    .eq("user_id", userId)
    .select("*")
    .single();
  if (error) {
    Sentry.captureException(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ letter: data });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("cover_letters")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);
  if (error) {
    Sentry.captureException(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
