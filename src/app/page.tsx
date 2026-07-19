"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FloatingHearts } from "@/components/wedding-card/FloatingHearts";
import { HEADLINE_FONT } from "@/lib/card-schema";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: "easeOut" as const },
});

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center gap-8 overflow-hidden bg-[#fffaf9] px-6 text-center">
      <FloatingHearts color="#b76e79" />

      <motion.p {...fadeUp(0)} className="text-sm uppercase tracking-[0.2em] text-[#b76e79]">
        Wedding Invitations
      </motion.p>
      <motion.h1
        {...fadeUp(0.15)}
        className="max-w-2xl text-4xl text-neutral-900 sm:text-5xl"
        style={{ fontFamily: HEADLINE_FONT }}
      >
        Beautiful digital invitations,{" "}
        <span className="italic text-[#b76e79]">live in minutes</span>
      </motion.h1>
      <motion.p {...fadeUp(0.3)} className="max-w-xl text-neutral-500">
        Pick a template, personalize it with your story and photos, and share a link your guests
        will love. RSVPs, countdowns, and a permanent download — all included.
      </motion.p>
      <motion.div {...fadeUp(0.45)} className="flex gap-4">
        <Link
          href="/templates"
          className="rounded-lg bg-[#b76e79] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#8a5a5f]"
        >
          Browse templates
        </Link>
        <Link
          href="/dashboard"
          className="rounded-lg border border-neutral-300 bg-white/70 px-6 py-3 text-sm font-medium text-neutral-800 transition hover:bg-white"
        >
          My invitations
        </Link>
      </motion.div>
    </main>
  );
}
