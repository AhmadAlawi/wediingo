import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://wediingo.awnak.net";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const activeCards = await prisma.card.findMany({
    where: { status: "active" },
    select: { shortId: true, updatedAt: true },
    take: 5000,
  });

  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/templates`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/login`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/signup`, changeFrequency: "monthly", priority: 0.3 },
    ...activeCards.map((card) => ({
      url: `${SITE_URL}/c/${card.shortId}`,
      lastModified: card.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
  ];
}
