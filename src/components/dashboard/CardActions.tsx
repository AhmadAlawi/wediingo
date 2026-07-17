"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DuplicateButton({ cardId }: { cardId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    const res = await fetch(`/api/cards/${cardId}/duplicate`, { method: "POST" });
    setLoading(false);
    if (res.ok) {
      const { id } = await res.json();
      router.push(`/editor/${id}`);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-medium hover:bg-neutral-50 disabled:opacity-50"
    >
      {loading ? "Duplicating..." : "Duplicate"}
    </button>
  );
}

export function DeleteButton({ cardId }: { cardId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (!confirm("Delete this draft? This cannot be undone.")) return;
    setLoading(true);
    const res = await fetch(`/api/cards/${cardId}`, { method: "DELETE" });
    setLoading(false);
    if (res.ok) router.refresh();
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}

export function DownloadButton({ cardId }: { cardId: string }) {
  return (
    <a
      href={`/api/generate-download/${cardId}`}
      className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-medium hover:bg-neutral-50"
    >
      Download
    </a>
  );
}
