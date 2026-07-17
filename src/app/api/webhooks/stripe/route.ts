import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  const body = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature ?? "", process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: `Webhook signature verification failed: ${message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    await activateCard(session);
  }

  return NextResponse.json({ received: true });
}

async function activateCard(session: Stripe.Checkout.Session) {
  const payment = await prisma.payment.findUnique({ where: { stripeSessionId: session.id } });
  if (!payment || payment.status === "paid") return;

  const now = new Date();
  const expiresAt = new Date(now.getTime() + payment.durationDays * 86_400_000);

  await prisma.$transaction([
    prisma.payment.update({ where: { id: payment.id }, data: { status: "paid" } }),
    prisma.card.update({
      where: { id: payment.cardId },
      data: {
        status: "active",
        publishedAt: now,
        expiresAt,
        durationDays: payment.durationDays,
        downloadUnlocked: payment.downloadAddon ? true : undefined,
      },
    }),
  ]);
}
