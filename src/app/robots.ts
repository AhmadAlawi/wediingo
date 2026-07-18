import { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://wediingo.awnak.net";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/templates", "/login", "/signup", "/c/"],
      disallow: ["/dashboard", "/editor", "/api", "/auth"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
