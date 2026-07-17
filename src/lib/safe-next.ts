/** Only allow same-site relative paths for post-auth redirects; anything else falls back. Blocks open redirects like ?next=https://evil.com or ?next=//evil.com. */
export function safeNext(next: string | null, fallback = "/dashboard"): string {
  if (!next) return fallback;
  if (!next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return fallback;
  return next;
}
