import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { DEFAULT_CARD_DATA } from "@/lib/card-schema";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) {
    const next = encodeURIComponent(`/templates/${params.id}/use`);
    return NextResponse.redirect(new URL(`/login?next=${next}`, request.url), 303);
  }

  const template = await prisma.template.findUnique({ where: { id: params.id } });
  if (!template) {
    return NextResponse.redirect(new URL("/templates", request.url), 303);
  }

  const card = await prisma.card.create({
    data: {
      userId: user.id,
      templateId: template.id,
      data: DEFAULT_CARD_DATA,
      status: "draft",
    },
  });

  return NextResponse.redirect(new URL(`/editor/${card.id}`, request.url), 303);
}
