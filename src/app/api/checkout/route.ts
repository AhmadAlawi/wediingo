import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { DOWNLOAD_ADDON_PRICE, DURATION_OPTIONS, getDurationPrice } from "@/lib/pricing";

const checkoutInputSchema = z.object({
  cardId: z.string().min(1),
  durationDays: z.number().int().refine((d) => DURATION_OPTIONS.includes(d), "Invalid duration"),
  downloadAddon: z.boolean(),
});

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = checkoutInputSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { cardId, durationDays, downloadAddon } = parsed.data;

  const card = await prisma.card.findUnique({ where: { id: cardId } });
  if (!card || card.userId !== user.id) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? request.nextUrl.origin;
  const durationPriceCents = getDurationPrice(durationDays) * 100;
  const addonCents = downloadAddon ? DOWNLOAD_ADDON_PRICE * 100 : 0;

  const lineItems: Array<{ price_data: object; quantity: number }> = [
    {
      price_data: {
        currency: "usd",
        product_data: { name: `Wedding invitation hosting — ${durationDays} days` },
        unit_amount: durationPriceCents,
      },
      quantity: 1,
    },
  ];

  if (downloadAddon) {
    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: { name: "Permanent download add-on" },
        unit_amount: addonCents,
      },
      quantity: 1,
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: lineItems as never,
    success_url: `${siteUrl}/editor/${cardId}/publish/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/editor/${cardId}/publish`,
    metadata: { cardId, durationDays: String(durationDays), downloadAddon: String(downloadAddon) },
  });

  await prisma.payment.create({
    data: {
      cardId,
      stripeSessionId: session.id,
      durationDays,
      downloadAddon,
      amount: durationPriceCents + addonCents,
      status: "pending",
    },
  });

  return NextResponse.json({ url: session.url });
}
