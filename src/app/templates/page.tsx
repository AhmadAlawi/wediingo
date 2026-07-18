import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;

const CATEGORY_LABEL: Record<string, string> = {
  floral: "Floral",
  minimalist: "Minimalist",
  traditional: "Traditional",
  modern: "Modern",
  rustic: "Rustic",
  boho: "Boho",
  vintage: "Vintage",
  garden: "Garden",
  beach: "Beach",
  classic: "Classic",
};

export default async function TemplatesPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const [templates, categoryCounts] = await Promise.all([
    prisma.template.findMany({
      where: searchParams.category ? { category: searchParams.category } : undefined,
      orderBy: { createdAt: "asc" },
    }),
    prisma.template.groupBy({ by: ["category"], _count: true }),
  ]);

  const categories = categoryCounts
    .map((c) => c.category)
    .sort((a, b) => (CATEGORY_LABEL[a] ?? a).localeCompare(CATEGORY_LABEL[b] ?? b));
  const total = categoryCounts.reduce((sum, c) => sum + c._count, 0);

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-neutral-900">Choose a template</h1>
        <p className="mt-2 text-neutral-500">
          Pick a design to start building your invitation. You can change fields, photos, and
          colors after.
        </p>
      </div>

      <div className="mb-10 flex flex-wrap gap-2">
        <Link
          href="/templates"
          className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
            !searchParams.category
              ? "bg-neutral-900 text-white"
              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
          }`}
        >
          All ({total})
        </Link>
        {categories.map((category) => {
          const count = categoryCounts.find((c) => c.category === category)?._count ?? 0;
          return (
            <Link
              key={category}
              href={`/templates?category=${category}`}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                searchParams.category === category
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {CATEGORY_LABEL[category] ?? category} ({count})
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <div
            key={template.id}
            className="group overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-md"
          >
            <div className="relative aspect-[4/3] w-full bg-neutral-50">
              <Image
                src={template.thumbnailUrl}
                alt={template.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex items-center justify-between p-4">
              <div>
                <h2 className="font-medium text-neutral-900">{template.name}</h2>
                <p className="text-sm text-neutral-500">
                  {CATEGORY_LABEL[template.category] ?? template.category}
                </p>
              </div>
              <form action={`/templates/${template.id}/use`} method="post">
                <button
                  type="submit"
                  className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700"
                >
                  Use template
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>

      {templates.length === 0 && (
        <p className="text-neutral-500">
          No templates yet. Run <code className="rounded bg-neutral-100 px-1">npm run db:seed</code>.
        </p>
      )}

      <p className="mt-10 text-sm text-neutral-400">
        Don&apos;t have an account yet?{" "}
        <Link href="/login" className="underline">
          Sign in
        </Link>{" "}
        to save your work — you can still preview any template without one.
      </p>
    </main>
  );
}
