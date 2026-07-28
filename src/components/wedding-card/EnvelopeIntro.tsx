"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Phase = "closed" | "opening" | "initials" | "done";

export function EnvelopeIntro({
  partner1,
  partner2,
  dateLabel,
  theme,
}: {
  partner1: string;
  partner2: string;
  dateLabel: string;
  theme: { primary: string; secondary: string; accent: string; bg: string; font: string };
}) {
  const [phase, setPhase] = useState<Phase>("closed");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("opening"), 1100);
    const t2 = setTimeout(() => setPhase("initials"), 2100);
    const t3 = setTimeout(() => setPhase("done"), 3600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const initial1 = (partner1.trim()[0] || "?").toUpperCase();
  const initial2 = (partner2.trim()[0] || "?").toUpperCase();

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[100] overflow-hidden"
          style={{ backgroundColor: theme.bg, perspective: 1600 }}
        >
          {/* Initials + date revealed behind the doors */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span
              className="text-6xl sm:text-8xl"
              style={{ color: theme.primary, fontFamily: "var(--font-playfair-display), serif" }}
            >
              {initial1}
              <span className="mx-3 font-light">&amp;</span>
              {initial2}
            </span>
            {dateLabel && (
              <span className="mt-4 text-sm uppercase tracking-[0.3em]" style={{ color: theme.accent }}>
                {dateLabel}
              </span>
            )}
          </div>

          {/* Left door */}
          <motion.div
            className="absolute inset-y-0 left-0 w-1/2"
            style={{ backgroundColor: theme.primary, transformOrigin: "left center" }}
            animate={{ rotateY: phase === "closed" ? 0 : -100 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            <div
              className="absolute inset-y-0 right-0 w-px opacity-30"
              style={{ backgroundColor: theme.bg }}
            />
          </motion.div>

          {/* Right door */}
          <motion.div
            className="absolute inset-y-0 right-0 w-1/2"
            style={{ backgroundColor: theme.primary, transformOrigin: "right center" }}
            animate={{ rotateY: phase === "closed" ? 0 : 100 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            {/* Postage stamp, top-right corner of the closed card */}
            <div
              className="absolute right-8 top-8 flex h-16 w-14 items-center justify-center rounded-sm sm:right-12 sm:top-12"
              style={{
                backgroundColor: theme.secondary,
                border: `2px dashed ${theme.bg}`,
                boxShadow: `0 2px 8px rgba(0,0,0,0.15)`,
              }}
            >
              <svg viewBox="0 0 24 24" fill={theme.accent} width="26" height="26">
                <path d="M12 21s-7.5-4.6-10-9.1C0.3 8.4 2 5 5.5 5 8 5 10 6.6 12 9c2-2.4 4-4 6.5-4C22 5 23.7 8.4 22 11.9 19.5 16.4 12 21 12 21z" />
              </svg>
            </div>
          </motion.div>

          {/* Wax seal, visible only while fully closed */}
          <AnimatePresence>
            {phase === "closed" && (
              <motion.div
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
                style={{ backgroundColor: theme.accent, boxShadow: "0 2px 10px rgba(0,0,0,0.3)" }}
              >
                <svg viewBox="0 0 24 24" fill={theme.bg} width="22" height="22">
                  <path d="M12 21s-7.5-4.6-10-9.1C0.3 8.4 2 5 5.5 5 8 5 10 6.6 12 9c2-2.4 4-4 6.5-4C22 5 23.7 8.4 22 11.9 19.5 16.4 12 21 12 21z" />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
