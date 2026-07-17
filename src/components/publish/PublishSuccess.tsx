"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Countdown } from "@/components/wedding-card/Countdown";

type CardStatus = { status: string; shortId: string; expiresAt: string | null; downloadUnlocked: boolean };

export function PublishSuccess({ cardId, initial }: { cardId: string; initial: CardStatus }) {
  const [card, setCard] = useState(initial);

  useEffect(() => {
    if (card.status === "active") return;
    const id = setInterval(async () => {
      const res = await fetch(`/api/cards/${cardId}/status`);
      if (res.ok) setCard(await res.json());
    }, 2000);
    return () => clearInterval(id);
  }, [card.status, cardId]);

  if (card.status !== "active") {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="text-neutral-600">Confirming your payment...</p>
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
      </div>
    );
  }

  const link = `${typeof window !== "undefined" ? window.location.origin : ""}/c/${card.shortId}`;

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <h1 className="text-2xl font-semibold text-neutral-900">Your invitation is live 🎉</h1>

      <div className="w-full rounded-lg border border-neutral-200 bg-neutral-50 p-4">
        <p className="mb-1 text-xs uppercase tracking-wide text-neutral-400">Shareable link</p>
        <Link href={`/c/${card.shortId}`} className="break-all text-sm font-medium text-neutral-900 underline">
          {link}
        </Link>
      </div>

      {card.expiresAt && (
        <div>
          <p className="mb-3 text-sm text-neutral-500">Time remaining</p>
          <Countdown target={card.expiresAt} accent="#171717" />
        </div>
      )}

      <div className="flex gap-3">
        <Link href="/dashboard" className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white">
          Go to dashboard
        </Link>
        {card.downloadUnlocked && (
          <a
            href={`/api/generate-download/${cardId}`}
            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium"
          >
            Download
          </a>
        )}
      </div>
    </div>
  );
}
