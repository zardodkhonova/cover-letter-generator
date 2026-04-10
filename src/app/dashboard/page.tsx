import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { DraftActions } from "@/components/dashboard/DraftActions";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("cover_letters")
    .select("id,job_title,company_name,status,updated_at,letter_text,opening,body,closing")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(50);

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-6 py-10 text-white">
      <Link
        href="/"
        className="fixed left-3 top-20 z-40 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/55 px-3 py-2 text-xs font-medium text-white/80 backdrop-blur-md transition-colors hover:bg-white/10 hover:text-white sm:left-5 sm:top-24"
      >
        <span aria-hidden>←</span>
        <span>Back</span>
      </Link>
      <h1 className="text-2xl font-semibold">Saved Letters</h1>
      <p className="mt-1 text-sm text-white/60">Your cloud drafts and finalized cover letters.</p>
      <div className="mt-6 grid gap-4">
        {(data ?? []).map((row) => {
          const fullText =
            row.letter_text?.trim() ||
            [row.opening, row.body, row.closing].filter(Boolean).join("\n\n") ||
            "No letter text saved yet.";
          return (
            <details
              key={row.id}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">
                    {row.job_title || "Untitled role"} · {row.company_name || "Unknown company"}
                  </p>
                  <p className="mt-1 text-xs text-white/50">
                    {row.status} ·{" "}
                    {row.updated_at ? new Date(row.updated_at).toLocaleString() : "No date"}
                  </p>
                </div>
                <span className="text-xs text-white/50 transition-transform group-open:rotate-90">
                  ▶
                </span>
              </summary>
              <div className="border-t border-white/10 px-4 py-4">
                <pre className="max-h-96 overflow-auto whitespace-pre-wrap text-sm leading-relaxed text-white/85">
                  {fullText}
                </pre>
                <DraftActions id={row.id} text={fullText} />
              </div>
            </details>
          );
        })}
        {(data ?? []).length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-8 text-center text-sm text-white/60">
            No drafts yet. Generate and save a letter to see it here.
          </div>
        ) : null}
      </div>
    </main>
  );
}
