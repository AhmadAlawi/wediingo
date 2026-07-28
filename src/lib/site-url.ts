import { NextRequest } from "next/server";

/**
 * Canonical origin for building absolute redirect URLs. The app is reachable on
 * multiple public domains (wediingo.awnak.net, wediingo.sphereofthesun.com), so we
 * must preserve whichever one the visitor actually used rather than forcing one
 * fixed domain.
 *
 * request.nextUrl.origin does NOT reflect the incoming Host header under `next
 * start` behind this nginx setup — it always resolves to the app's own bind
 * address (localhost:3012), regardless of what the client/proxy sent. So we read
 * the raw Host / X-Forwarded-* headers directly instead (nginx sets these
 * correctly via proxy_set_header), falling back to NEXT_PUBLIC_SITE_URL only if
 * those headers are missing or look internal.
 */
export function getSiteOrigin(request: NextRequest): string {
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") ?? "https";
  const looksInternal = !host || /localhost|127\.0\.0\.1|:3012/.test(host);
  return looksInternal ? (process.env.NEXT_PUBLIC_SITE_URL ?? request.nextUrl.origin) : `${proto}://${host}`;
}
