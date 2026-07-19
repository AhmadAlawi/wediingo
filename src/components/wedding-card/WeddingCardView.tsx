"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { CardData, COLOR_THEMES, HEADLINE_FONT } from "@/lib/card-schema";
import { Countdown } from "./Countdown";
import { RsvpForm } from "./RsvpForm";
import { FloatingHearts } from "./FloatingHearts";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

export function WeddingCardView({
  data,
  cardId,
  watermark = false,
  interactiveRsvp = false,
}: {
  data: CardData;
  cardId?: string;
  watermark?: boolean;
  interactiveRsvp?: boolean;
}) {
  const theme = COLOR_THEMES[data.colorTheme];
  const dateLabel = data.weddingDate
    ? new Date(data.weddingDate).toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <div className="relative overflow-hidden" style={{ backgroundColor: theme.bg, fontFamily: theme.font }}>
      {watermark && (
        <div className="pointer-events-none absolute inset-0 z-50 flex flex-wrap content-start items-center justify-center gap-24 overflow-hidden py-24">
          {Array.from({ length: 24 }).map((_, i) => (
            <span
              key={i}
              className="rotate-[-30deg] select-none whitespace-nowrap text-4xl font-bold uppercase tracking-widest text-black/10"
            >
              Preview
            </span>
          ))}
        </div>
      )}

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative flex min-h-[70vh] flex-col items-center justify-center px-6 py-24 text-center"
        style={{ color: theme.accent }}
      >
        <FloatingHearts color={theme.primary} />
        <p className="mb-4 text-sm uppercase tracking-[0.2em]">We&apos;re getting married</p>
        <h1 className="flex flex-wrap items-center justify-center text-4xl sm:text-6xl" style={{ color: theme.primary, fontFamily: HEADLINE_FONT }}>
          {data.partner1Name || "Partner One"}
          <span className="heart-pulse mx-4 inline-block" style={{ color: theme.primary }}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="0.6em" height="0.6em">
              <path d="M12 21s-7.5-4.6-10-9.1C0.3 8.4 2 5 5.5 5 8 5 10 6.6 12 9c2-2.4 4-4 6.5-4C22 5 23.7 8.4 22 11.9 19.5 16.4 12 21 12 21z" />
            </svg>
          </span>
          {data.partner2Name || "Partner Two"}
        </h1>
        {dateLabel && <p className="mt-6 text-lg">{dateLabel}</p>}
        {data.venueName && <p className="mt-1 text-sm text-neutral-500">{data.venueName}</p>}

        {data.countdownEnabled && data.weddingDate && (
          <div className="mt-12">
            <Countdown target={data.weddingDate} accent={theme.primary} />
          </div>
        )}
      </motion.section>

      {data.story && (
        <motion.section {...fadeUp} className="mx-auto max-w-2xl px-6 py-16 text-center">
          <h2 className="mb-4 text-2xl" style={{ color: theme.primary, fontFamily: HEADLINE_FONT }}>
            Our story
          </h2>
          <p className="whitespace-pre-line leading-relaxed text-neutral-600">{data.story}</p>
        </motion.section>
      )}

      {data.photos.length > 0 && (
        <motion.section {...fadeUp} className="mx-auto max-w-4xl px-6 py-16">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {data.photos.map((url, i) => (
              <div key={i} className="relative aspect-square overflow-hidden rounded-lg">
                <Image src={url} alt="" fill className="object-cover transition hover:scale-105" />
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {data.schedule.length > 0 && (
        <motion.section {...fadeUp} className="mx-auto max-w-xl px-6 py-16">
          <h2 className="mb-8 text-center text-2xl" style={{ color: theme.primary, fontFamily: HEADLINE_FONT }}>
            Schedule
          </h2>
          <div className="flex flex-col gap-6">
            {data.schedule.map((item, i) => (
              <div key={i} className="flex gap-4 border-l-2 pl-4" style={{ borderColor: theme.secondary }}>
                <div className="w-20 shrink-0 text-sm font-medium" style={{ color: theme.primary }}>
                  {item.time}
                </div>
                <div>
                  <p className="font-medium text-neutral-800">{item.title}</p>
                  {item.description && (
                    <p className="text-sm text-neutral-500">{item.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {data.rsvpEnabled && (
        <motion.section
          {...fadeUp}
          className="px-6 py-16"
          style={{ backgroundColor: theme.secondary }}
        >
          <h2 className="mb-8 text-center text-2xl" style={{ color: theme.primary, fontFamily: HEADLINE_FONT }}>
            RSVP
          </h2>
          <RsvpForm cardId={cardId} accent={theme.primary} interactive={interactiveRsvp} />
        </motion.section>
      )}

      <footer className="py-8 text-center text-xs text-neutral-400">
        Made with love for {data.partner1Name || "Partner One"} &amp; {data.partner2Name || "Partner Two"}
      </footer>
    </div>
  );
}
