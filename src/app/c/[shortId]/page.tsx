import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { cardDataSchema } from "@/lib/card-schema";
import { WeddingCardView } from "@/components/wedding-card/WeddingCardView";

export const revalidate = 0;

export default async function PublicCardPage({ params }: { params: { shortId: string } }) {
  const card = await prisma.card.findUnique({ where: { shortId: params.shortId } });
  if (!card || card.status === "draft") notFound();

  const user = await getCurrentUser();
  const isOwner = user?.id === card.userId;

  if (card.status === "expired" || (card.expiresAt && card.expiresAt < new Date())) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-2xl font-semibold text-neutral-900">This invitation has expired</h1>
        <p className="text-neutral-500">The hosting period for this invitation has ended.</p>
        {isOwner && (
          <Link
            href={`/editor/${card.id}/publish`}
            className="mt-2 rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-700"
          >
            Renew this invitation
          </Link>
        )}
      </main>
    );
  }

  const data = cardDataSchema.parse(card.data);

  return (
    <>
      {isOwner && card.downloadUnlocked && (
        <a
          href={`/api/generate-download/${card.id}`}
          className="fixed right-4 top-4 z-50 rounded-lg bg-neutral-900/90 px-4 py-2 text-sm font-medium text-white shadow-lg hover:bg-neutral-700"
        >
          Download
        </a>
      )}
      <WeddingCardView data={data} cardId={card.id} interactiveRsvp />
    </>
  );
}
