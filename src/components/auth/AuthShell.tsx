import Link from "next/link";
import { FloatingHearts } from "@/components/wedding-card/FloatingHearts";

export function AuthShell({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#fffaf9] px-6 py-16">
      <FloatingHearts color="#b76e79" />

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center">
        <Link href="/" className="mb-8 text-sm text-neutral-400 transition hover:text-neutral-600">
          ← Back to home
        </Link>

        <div className="w-full rounded-2xl border border-[#f3e3e0] bg-white/90 p-8 shadow-xl shadow-[#b76e79]/5 backdrop-blur-sm">
          <div className="mb-6 text-center">
            <p className="mb-1 text-sm uppercase tracking-[0.2em] text-[#b76e79]">{eyebrow}</p>
            <h1 className="font-serif text-2xl text-neutral-900">{title}</h1>
          </div>
          {children}
        </div>
      </div>
    </main>
  );
}
