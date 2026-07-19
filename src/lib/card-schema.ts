import { z } from "zod";

export const scheduleItemSchema = z.object({
  time: z.string(),
  title: z.string(),
  description: z.string().optional().default(""),
});

export const cardDataSchema = z.object({
  partner1Name: z.string().default(""),
  partner2Name: z.string().default(""),
  weddingDate: z.string().default(""), // ISO date
  venueName: z.string().default(""),
  venueAddress: z.string().default(""),
  schedule: z.array(scheduleItemSchema).default([]),
  story: z.string().default(""),
  photos: z.array(z.string()).default([]),
  colorTheme: z
    .enum([
      "blush",
      "sage",
      "ivory",
      "burgundy",
      "lavender",
      "terracotta",
      "navy",
      "forest",
      "dustyrose",
      "champagne",
    ])
    .default("blush"),
  rsvpEnabled: z.boolean().default(true),
  countdownEnabled: z.boolean().default(true),
});

export type ScheduleItem = z.infer<typeof scheduleItemSchema>;
export type CardData = z.infer<typeof cardDataSchema>;

export const DEFAULT_CARD_DATA: CardData = cardDataSchema.parse({});

/**
 * Colors and body fonts derived from real Stitch-generated design systems (one per
 * theme, flagship generation 2026-07-19). Headline font (Playfair Display) is shared
 * site-wide below since every one of the 10 generations independently chose it.
 */
export const COLOR_THEMES: Record<
  CardData["colorTheme"],
  { primary: string; secondary: string; accent: string; bg: string; font: string }
> = {
  blush: { primary: "#745853", secondary: "#fff0f4", accent: "#725665", bg: "#fff8f8", font: "var(--font-source-serif-4), serif" },
  sage: { primary: "#56642b", secondary: "#f8f6c9", accent: "#635f40", bg: "#fefccf", font: "var(--font-dm-sans), sans-serif" },
  ivory: { primary: "#725b2b", secondary: "#f6f3f2", accent: "#5e5f54", bg: "#fbf9f8", font: "var(--font-source-serif-4), serif" },
  burgundy: { primary: "#570013", secondary: "#fbf2ed", accent: "#6a5b56", bg: "#fff8f5", font: "var(--font-dm-sans), sans-serif" },
  lavender: { primary: "#341547", secondary: "#f4f3f1", accent: "#6c538b", bg: "#faf9f6", font: "var(--font-work-sans), sans-serif" },
  terracotta: { primary: "#964325", secondary: "#f6f3ed", accent: "#974635", bg: "#fcf9f3", font: "var(--font-source-serif-4), serif" },
  navy: { primary: "#051125", secondary: "#faf4df", accent: "#47607e", bg: "#fff9e8", font: "var(--font-source-serif-4), serif" },
  forest: { primary: "#061b0e", secondary: "#f5f3ee", accent: "#516349", bg: "#fbf9f4", font: "var(--font-montserrat), sans-serif" },
  dustyrose: { primary: "#7b5455", secondary: "#fbf2f1", accent: "#685c50", bg: "#fff8f7", font: "var(--font-plus-jakarta-sans), sans-serif" },
  champagne: { primary: "#735c00", secondary: "#f6f3f2", accent: "#685d4a", bg: "#fbf9f8", font: "var(--font-dm-sans), sans-serif" },
};

export const HEADLINE_FONT = "var(--font-playfair-display), Georgia, serif";
