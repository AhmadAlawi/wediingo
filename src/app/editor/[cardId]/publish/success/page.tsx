import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { PublishSuccess } from "@/components/publish/PublishSuccess";

export default async function PublishSuccessPage({ params }: { params: { cardId: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(`/editor/${params.cardId}/publish/success`)}`);

  const card = await prisma.card.findUnique({ where: { id: params.cardId } });
  if (!card || card.userId !== user.id) notFound();

  return (
    <main className="mx-auto max-w-md px-6 py-24">
      <PublishSuccess
        cardId={card.id}
        initial={{
          status: card.status,
          shortId: card.shortId,
          expiresAt: card.expiresAt?.toISOString() ?? null,
          downloadUnlocked: card.downloadUnlocked,
        }}
      />
    </main>
  );
}
