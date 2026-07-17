import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(_request: NextRequest, { params }: { params: { cardId: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const card = await prisma.card.findUnique({ where: { id: params.cardId } });
  if (!card || card.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    status: card.status,
    shortId: card.shortId,
    expiresAt: card.expiresAt,
    downloadUnlocked: card.downloadUnlocked,
  });
}
