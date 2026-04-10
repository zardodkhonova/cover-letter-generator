"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function DraftActions({ id, text }: { id: string; text: string }) {
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      <button
        type="button"
        className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/85 hover:bg-white/10"
        onClick={async () => {
          await navigator.clipboard.writeText(text);
        }}
      >
        Copy
      </button>
      <Link
        href={`/?draftId=${id}`}
        className="rounded-lg border border-violet-400/30 bg-violet-500/10 px-3 py-1.5 text-xs text-violet-200 hover:bg-violet-500/20"
      >
        Open in editor
      </Link>
      <button
        type="button"
        disabled={busy}
        className="rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-1.5 text-xs text-red-200 hover:bg-red-500/20 disabled:opacity-50"
        onClick={async () => {
          setBusy(true);
          try {
            await fetch(`/api/letters/${id}`, { method: "DELETE" });
            router.refresh();
          } finally {
            setBusy(false);
          }
        }}
      >
        {busy ? "Deleting..." : "Delete draft"}
      </button>
    </div>
  );
}
