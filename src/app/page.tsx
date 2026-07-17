import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 text-center">
      <p className="text-sm uppercase tracking-[0.2em] text-neutral-400">Wedding Invitations</p>
      <h1 className="max-w-2xl font-serif text-4xl text-neutral-900 sm:text-5xl">
        Beautiful digital invitations, live in minutes
      </h1>
      <p className="max-w-xl text-neutral-500">
        Pick a template, personalize it with your story and photos, and share a link your guests
        will love. RSVPs, countdowns, and a permanent download — all included.
      </p>
      <div className="flex gap-4">
        <Link
          href="/templates"
          className="rounded-lg bg-neutral-900 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-700"
        >
          Browse templates
        </Link>
        <Link
          href="/dashboard"
          className="rounded-lg border border-neutral-300 px-6 py-3 text-sm font-medium hover:bg-neutral-50"
        >
          My invitations
        </Link>
      </div>
    </main>
  );
}
