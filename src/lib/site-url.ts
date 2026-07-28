import { NextRequest } from "next/server";

/**
 * Canonical origin for building absolute redirect URLs. The app is reachable on
 * multiple public domains (wediingo.awnak.net, wediingo.sphereofthesun.com), so we
 * must preserve whichever one the visitor actually used rather than forcing one
 * fixed domain. nginx forwards the real Host header, so request.nextUrl.origin is
 * accurate in production; NEXT_PUBLIC_SITE_URL is only a fallback for cases where
 * the origin looks internal (e.g. localhost, direct port access bypassing nginx).
 */
export function getSiteOrigin(request: NextRequest): string {
  const origin = request.nextUrl.origin;
  const looksInternal = /localhost|127\.0\.0\.1|:3012/.test(origin);
  return looksInternal ? (process.env.NEXT_PUBLIC_SITE_URL ?? origin) : origin;
}
