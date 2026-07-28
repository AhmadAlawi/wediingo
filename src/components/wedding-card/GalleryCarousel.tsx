"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export function GalleryCarousel({ photos, accent }: { photos: string[]; accent: string }) {
  const [index, setIndex] = useState(0);
  if (photos.length === 0) return null;

  function go(delta: number) {
    setIndex((i) => (i + delta + photos.length) % photos.length);
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-black/5">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Image src={photos[index]} alt="" fill className="object-cover" />
          </motion.div>
        </AnimatePresence>

        {photos.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-lg shadow transition hover:bg-white"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next photo"
              className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-lg shadow transition hover:bg-white"
            >
              ›
            </button>
          </>
        )}
      </div>

      {photos.length > 1 && (
        <div className="flex gap-2">
          {photos.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to photo ${i + 1}`}
              onClick={() => setIndex(i)}
              className="h-2 w-2 rounded-full transition"
              style={{ backgroundColor: i === index ? accent : "#d4d4d4" }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
