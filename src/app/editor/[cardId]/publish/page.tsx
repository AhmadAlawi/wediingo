import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { PublishForm } from "@/components/publish/PublishForm";

export default async function PublishPage({ params }: { params: { cardId: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(`/editor/${params.cardId}/publish`)}`);

  const card = await prisma.card.findUnique({ where: { id: params.cardId } });
  if (!card || card.userId !== user.id) notFound();

  return (
    <main className="mx-auto max-w-lg px-6 py-16">
      <h1 className="mb-2 text-2xl font-semibold text-neutral-900">
        {card.status === "active" ? "Renew invitation" : "Publish invitation"}
      </h1>
      <p className="mb-8 text-neutral-500">
        Choose how long your invitation stays live. You can renew anytime after it expires.
      </p>
      <PublishForm cardId={card.id} />
    </main>
  );
}
