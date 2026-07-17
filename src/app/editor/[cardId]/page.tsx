import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { cardDataSchema } from "@/lib/card-schema";
import { FieldDef } from "@/lib/template-field-schema";
import { CardEditor } from "@/components/editor/CardEditor";

export default async function EditorPage({ params }: { params: { cardId: string } }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/login?next=${encodeURIComponent(`/editor/${params.cardId}`)}`);
  }

  const card = await prisma.card.findUnique({
    where: { id: params.cardId },
    include: { template: true },
  });

  if (!card || card.userId !== user.id) {
    notFound();
  }

  const data = cardDataSchema.parse(card.data);
  const fields = card.template.schema as unknown as FieldDef[];

  return (
    <CardEditor cardId={card.id} initialData={data} fields={fields} status={card.status} />
  );
}
