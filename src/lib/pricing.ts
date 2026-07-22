/** Hosting duration (days) -> price in whole USD. Edit to adjust pricing. */
export const PRICING_TABLE: Record<string, number> = {
  "7": 5,
  "14": 6,
  "21": 8,
  "30": 10,
};

export const DURATION_OPTIONS = Object.keys(PRICING_TABLE)
  .map(Number)
  .sort((a, b) => a - b);

/** Flat add-on price in whole USD that permanently unlocks standalone HTML/PDF download. */
export const DOWNLOAD_ADDON_PRICE = 4;

export function getDurationPrice(durationDays: number): number {
  const price = PRICING_TABLE[String(durationDays)];
  if (price === undefined) {
    throw new Error(`Invalid duration: ${durationDays}`);
  }
  return price;
}

export function formatDuration(days: number): string {
  if (days === 7) return "1 week";
  if (days === 14) return "2 weeks";
  if (days === 21) return "3 weeks";
  if (days === 30) return "1 month";
  return `${days} days`;
}

export function computeTotal(durationDays: number, downloadAddon: boolean): number {
  return getDurationPrice(durationDays) + (downloadAddon ? DOWNLOAD_ADDON_PRICE : 0);
}
