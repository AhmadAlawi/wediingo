"use client";

import { useState } from "react";
import { DOWNLOAD_ADDON_PRICE, DURATION_OPTIONS, computeTotal, formatDuration, getDurationPrice } from "@/lib/pricing";

export function PublishForm({ cardId }: { cardId: string }) {
  const [durationIndex, setDurationIndex] = useState(DURATION_OPTIONS.length - 1);
  const [downloadAddon, setDownloadAddon] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const durationDays = DURATION_OPTIONS[durationIndex];
  const total = computeTotal(durationDays, downloadAddon);

  async function handleCheckout() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cardId, durationDays, downloadAddon }),
    });
    const body = await res.json();
    if (!res.ok) {
      setError(body.error ?? "Something went wrong");
      setLoading(false);
      return;
    }
    window.location.href = body.url;
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <label className="mb-3 flex items-center justify-between text-sm font-medium text-neutral-700">
          <span>Hosting duration</span>
          <span>{formatDuration(durationDays)} — ${getDurationPrice(durationDays)}</span>
        </label>
        <input
          type="range"
          min={0}
          max={DURATION_OPTIONS.length - 1}
          step={1}
          value={durationIndex}
          onChange={(e) => setDurationIndex(Number(e.target.value))}
          className="w-full accent-neutral-900"
        />
        <div className="mt-1 flex justify-between text-xs text-neutral-400">
          {DURATION_OPTIONS.map((d) => (
            <span key={d}>{formatDuration(d)}</span>
          ))}
        </div>
      </div>

      <label className="flex items-center justify-between rounded-lg border border-neutral-200 p-4 text-sm">
        <div>
          <p className="font-medium text-neutral-800">Download add-on</p>
          <p className="text-neutral-500">
            Unlocks a permanent standalone download of your card (+${DOWNLOAD_ADDON_PRICE}).
          </p>
        </div>
        <input
          type="checkbox"
          checked={downloadAddon}
          onChange={(e) => setDownloadAddon(e.target.checked)}
          className="h-5 w-5 accent-neutral-900"
        />
      </label>

      <div className="flex items-center justify-between border-t border-neutral-200 pt-4">
        <span className="text-lg font-semibold">Total: ${total}</span>
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="rounded-lg bg-neutral-900 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50"
        >
          {loading ? "Redirecting..." : "Continue to payment"}
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
