import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";
import { cardDataSchema, COLOR_THEMES } from "@/lib/card-schema";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const runtime = "nodejs";

export default async function OpengraphImage({ params }: { params: { shortId: string } }) {
  const card = await prisma.card.findUnique({ where: { shortId: params.shortId } });
  const data = card ? cardDataSchema.parse(card.data) : cardDataSchema.parse({});
  const theme = COLOR_THEMES[data.colorTheme];
  const partner1 = data.partner1Name || "Partner One";
  const partner2 = data.partner2Name || "Partner Two";
  const dateLabel = data.weddingDate
    ? new Date(data.weddingDate).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.bg,
        }}
      >
        <div
          style={{
            fontSize: 28,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: theme.accent,
            marginBottom: 24,
          }}
        >
          We&apos;re getting married
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 96,
            color: theme.primary,
            fontFamily: "Georgia, serif",
          }}
        >
          <span>{partner1}</span>
          <span style={{ margin: "0 32px", fontWeight: 300 }}>&amp;</span>
          <span>{partner2}</span>
        </div>
        {dateLabel && (
          <div style={{ fontSize: 34, color: theme.accent, marginTop: 32 }}>{dateLabel}</div>
        )}
      </div>
    ),
    { ...size },
  );
}
