"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export function RsvpForm({
  cardId,
  accent,
  interactive,
}: {
  cardId?: string;
  accent: string;
  interactive: boolean;
}) {
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [attending, setAttending] = useState(true);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!interactive || !cardId) return;

    const form = new FormData(e.currentTarget);
    setStatus("saving");
    const res = await fetch(`/api/cards/${cardId}/rsvp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        guestName: form.get("guestName"),
        attending,
        guestCount: Number(form.get("guestCount") ?? 1),
        message: form.get("message"),
      }),
    });
    setStatus(res.ok ? "done" : "error");
  }

  if (status === "done") {
    return (
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-neutral-600"
      >
        Thank you — your response has been recorded.
      </motion.p>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mx-auto flex max-w-md flex-col gap-3"
    >
      <input
        name="guestName"
        required
        placeholder="Your name"
        className="rounded-lg border border-neutral-300 px-3 py-2 text-sm"
      />
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setAttending(true)}
          className="flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition"
          style={
            attending
              ? { backgroundColor: accent, color: "white", borderColor: accent }
              : { borderColor: "#d4d4d4" }
          }
        >
          Joyfully accepts
        </button>
        <button
          type="button"
          onClick={() => setAttending(false)}
          className="flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition"
          style={
            !attending
              ? { backgroundColor: accent, color: "white", borderColor: accent }
              : { borderColor: "#d4d4d4" }
          }
        >
          Regretfully declines
        </button>
      </div>
      <input
        name="guestCount"
        type="number"
        min={1}
        defaultValue={1}
        placeholder="Number of guests"
        className="rounded-lg border border-neutral-300 px-3 py-2 text-sm"
      />
      <textarea
        name="message"
        placeholder="Message (optional)"
        rows={3}
        className="rounded-lg border border-neutral-300 px-3 py-2 text-sm"
      />
      <button
        type="submit"
        disabled={status === "saving" || !interactive}
        className="rounded-lg px-4 py-2 text-sm font-medium text-white transition disabled:opacity-50"
        style={{ backgroundColor: accent }}
      >
        {interactive ? (status === "saving" ? "Sending..." : "Send RSVP") : "RSVP (preview only)"}
      </button>
      {status === "error" && (
        <p className="text-sm text-red-600">Something went wrong, please try again.</p>
      )}
    </motion.form>
  );
}
