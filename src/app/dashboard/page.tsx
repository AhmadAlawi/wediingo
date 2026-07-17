import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { cardDataSchema } from "@/lib/card-schema";
import { DeleteButton, DownloadButton, DuplicateButton } from "@/components/dashboard/CardActions";

export const revalidate = 0;

const STATUS_STYLE: Record<string, string> = {
  draft: "bg-neutral-100 text-neutral-600",
  active: "bg-green-100 text-green-700",
  expired: "bg-red-100 text-red-700",
};

function daysRemaining(expiresAt: Date | null): number | null {
  if (!expiresAt) return null;
  const ms = expiresAt.getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / 86_400_000));
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/dashboard");

  const cards = await prisma.card.findMany({
    where: { userId: user.id },
    include: { template: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-neutral-900">Your invitations</h1>
          <p className="mt-1 text-neutral-500">{user.email}</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/templates"
            className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
          >
            New invitation
          </Link>
          <form action="/api/auth/signout" method="post">
            <button className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-50">
              Sign out
            </button>
          </form>
        </div>
      </div>

      {cards.length === 0 && (
        <p className="text-neutral-500">
          No invitations yet.{" "}
          <Link href="/templates" className="underline">
            Browse templates
          </Link>{" "}
          to get started.
        </p>
      )}

      <div className="flex flex-col gap-4">
        {cards.map((card) => {
          const data = cardDataSchema.parse(card.data);
          const remaining = daysRemaining(card.expiresAt);

          return (
            <div
              key={card.id}
              className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm"
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-neutral-50">
                <Image src={card.template.thumbnailUrl} alt="" fill className="object-cover" />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-neutral-900">
                    {data.partner1Name || "Untitled"} {data.partner2Name && `& ${data.partner2Name}`}
                  </p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[card.status]}`}
                  >
                    {card.status}
                  </span>
                </div>
                <p className="text-sm text-neutral-500">{card.template.name}</p>
                {card.status === "active" && (
                  <p className="text-sm text-neutral-500">
                    {remaining} day{remaining === 1 ? "" : "s"} remaining ·{" "}
                    <Link href={`/c/${card.shortId}`} className="underline">
                      /c/{card.shortId}
                    </Link>
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {card.status === "draft" && (
                  <>
                    <Link
                      href={`/editor/${card.id}`}
                      className="rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-700"
                    >
                      Edit
                    </Link>
                    <DuplicateButton cardId={card.id} />
                    <DeleteButton cardId={card.id} />
                  </>
                )}
                {card.status === "active" && (
                  <>
                    <Link
                      href={`/editor/${card.id}`}
                      className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-medium hover:bg-neutral-50"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/editor/${card.id}/publish`}
                      className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-medium hover:bg-neutral-50"
                    >
                      Renew
                    </Link>
                    {card.downloadUnlocked && <DownloadButton cardId={card.id} />}
                  </>
                )}
                {card.status === "expired" && (
                  <>
                    <Link
                      href={`/editor/${card.id}/publish`}
                      className="rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-700"
                    >
                      Renew
                    </Link>
                    {card.downloadUnlocked && <DownloadButton cardId={card.id} />}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
