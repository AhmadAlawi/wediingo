import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { cardDataSchema, COLOR_THEMES, DEFAULT_CARD_DATA } from "@/lib/card-schema";
import { getSiteOrigin } from "@/lib/site-url";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const origin = getSiteOrigin(request);
  const user = await getCurrentUser();
  if (!user) {
    const next = encodeURIComponent(`/templates/${params.id}/use`);
    return NextResponse.redirect(new URL(`/login?next=${next}`, origin), 303);
  }

  const template = await prisma.template.findUnique({ where: { id: params.id } });
  if (!template) {
    return NextResponse.redirect(new URL("/templates", origin), 303);
  }

  const colorTheme = template.defaultColorTheme in COLOR_THEMES
    ? (template.defaultColorTheme as keyof typeof COLOR_THEMES)
    : DEFAULT_CARD_DATA.colorTheme;

  const initialData = cardDataSchema.parse({ ...DEFAULT_CARD_DATA, colorTheme });

  const card = await prisma.card.create({
    data: {
      userId: user.id,
      templateId: template.id,
      data: initialData,
      status: "draft",
    },
  });

  return NextResponse.redirect(new URL(`/editor/${card.id}`, origin), 303);
}
