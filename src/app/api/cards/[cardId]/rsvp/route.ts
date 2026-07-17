import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { cardDataSchema } from "@/lib/card-schema";

const rsvpInputSchema = z.object({
  guestName: z.string().trim().min(1).max(120),
  attending: z.boolean(),
  guestCount: z.number().int().min(1).max(20).default(1),
  message: z.string().trim().max(500).optional().nullable(),
});

export async function POST(request: NextRequest, { params }: { params: { cardId: string } }) {
  const card = await prisma.card.findUnique({ where: { id: params.cardId } });
  if (!card || card.status !== "active") {
    return NextResponse.json({ error: "This invitation is not accepting RSVPs" }, { status: 404 });
  }

  const data = cardDataSchema.parse(card.data);
  if (!data.rsvpEnabled) {
    return NextResponse.json({ error: "RSVP is disabled for this invitation" }, { status: 400 });
  }

  const parsed = rsvpInputSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid RSVP" }, { status: 400 });
  }

  const rsvp = await prisma.rSVP.create({
    data: {
      cardId: card.id,
      guestName: parsed.data.guestName,
      attending: parsed.data.attending,
      guestCount: parsed.data.guestCount,
      message: parsed.data.message ?? null,
    },
  });

  return NextResponse.json({ id: rsvp.id });
}
