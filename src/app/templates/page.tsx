import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;

const CATEGORY_LABEL: Record<string, string> = {
  floral: "Floral",
  minimalist: "Minimalist",
  traditional: "Traditional",
};

export default async function TemplatesPage() {
  const templates = await prisma.template.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-neutral-900">Choose a template</h1>
        <p className="mt-2 text-neutral-500">
          Pick a design to start building your invitation. You can change fields, photos, and
          colors after.
        </p>
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
