import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(_request: NextRequest, { params }: { params: { cardId: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const card = await prisma.card.findUnique({ where: { id: params.cardId } });
  if (!card || card.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const copy = await prisma.card.create({
    data: {
      userId: user.id,
      templateId: card.templateId,
      data: card.data as object,
      status: "draft",
    },
  });

  return NextResponse.json({ id: copy.id });
}
