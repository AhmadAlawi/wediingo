import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { cardDataSchema } from "@/lib/card-schema";

async function requireOwnedCard(cardId: string) {
  const user = await getCurrentUser();
  if (!user) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };

  const card = await prisma.card.findUnique({ where: { id: cardId } });
  if (!card || card.userId !== user.id) {
    return { error: NextResponse.json({ error: "Not found" }, { status: 404 }) };
  }
  return { card, user };
}

export async function PATCH(request: NextRequest, { params }: { params: { cardId: string } }) {
  const result = await requireOwnedCard(params.cardId);
  if (result.error) return result.error;

  const body = await request.json();
  const parsed = cardDataSchema.safeParse(body.data);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid card data" }, { status: 400 });
  }

  const updated = await prisma.card.update({
    where: { id: params.cardId },
    data: { data: parsed.data },
  });

  return NextResponse.json({ ok: true, updatedAt: updated.updatedAt });
}

export async function DELETE(_request: NextRequest, { params }: { params: { cardId: string } }) {
  const result = await requireOwnedCard(params.cardId);
  if (result.error) return result.error;
  if (result.card!.status !== "draft") {
    return NextResponse.json({ error: "Only drafts can be deleted" }, { status: 400 });
  }

  await prisma.card.delete({ where: { id: params.cardId } });
  return NextResponse.json({ ok: true });
}
