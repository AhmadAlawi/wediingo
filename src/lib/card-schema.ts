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

export const COLOR_THEMES: Record<CardData["colorTheme"], { primary: string; secondary: string; accent: string; bg: string }> = {
  blush: { primary: "#b76e79", secondary: "#f7e7e9", accent: "#8a5a5f", bg: "#fffaf9" },
  sage: { primary: "#7a8c6e", secondary: "#eef2e9", accent: "#54634a", bg: "#fafcf8" },
  ivory: { primary: "#a68a5b", secondary: "#f6f1e7", accent: "#7c6740", bg: "#fffdf8" },
  burgundy: { primary: "#7d2e3b", secondary: "#f2e3e6", accent: "#5a1f29", bg: "#fdf8f8" },
  lavender: { primary: "#8b7cae", secondary: "#eee9f5", accent: "#5f5280", bg: "#fbfaff" },
  terracotta: { primary: "#c1694f", secondary: "#f6e6df", accent: "#8f4831", bg: "#fffaf7" },
  navy: { primary: "#3d5170", secondary: "#e6ebf2", accent: "#26344a", bg: "#f9fafc" },
  forest: { primary: "#3f5b45", secondary: "#e6ede7", accent: "#293e2e", bg: "#f8fbf8" },
  dustyrose: { primary: "#c48a94", secondary: "#f8ecee", accent: "#93606b", bg: "#fffbfb" },
  champagne: { primary: "#b9975b", secondary: "#f7f0e2", accent: "#8a6f3d", bg: "#fffdf6" },
};
