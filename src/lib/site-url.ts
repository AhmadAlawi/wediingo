import { NextRequest } from "next/server";

/** Canonical origin for building absolute redirect URLs. Behind the nginx proxy, request.url/origin can resolve to the app's internal bind address instead of the public domain, so NEXT_PUBLIC_SITE_URL takes priority. */
export function getSiteOrigin(request: NextRequest): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? request.nextUrl.origin;
}
