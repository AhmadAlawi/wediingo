import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { cardDataSchema } from "@/lib/card-schema";
import { generateStaticCardHtml } from "@/lib/generate-static-card";

export async function GET(_request: NextRequest, { params }: { params: { cardId: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const card = await prisma.card.findUnique({ where: { id: params.cardId } });
  if (!card || card.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (!card.downloadUnlocked) {
    return NextResponse.json({ error: "Download add-on not purchased for this card" }, { status: 403 });
  }

  const data = cardDataSchema.parse(card.data);
  const html = await generateStaticCardHtml(data);
  const filename = `${(data.partner1Name || "invitation").replace(/[^a-z0-9]+/gi, "-")}-wedding.html`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
