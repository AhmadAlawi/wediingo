"use client";

import { useEffect, useState } from "react";

function getParts(target: number) {
  const diff = Math.max(0, target - Date.now());
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function Countdown({ target, accent }: { target: string; accent: string }) {
  const targetMs = new Date(target).getTime();
  const [parts, setParts] = useState(() => getParts(targetMs));

  useEffect(() => {
    const id = setInterval(() => setParts(getParts(targetMs)), 1000);
    return () => clearInterval(id);
  }, [targetMs]);

  if (!target || Number.isNaN(targetMs)) return null;

  const units: Array<[string, number]> = [
    ["Days", parts.days],
    ["Hours", parts.hours],
    ["Minutes", parts.minutes],
    ["Seconds", parts.seconds],
  ];

  return (
    <div className="flex justify-center gap-4 sm:gap-8">
      {units.map(([label, value]) => (
        <div key={label} className="flex flex-col items-center">
          <span className="text-3xl font-semibold tabular-nums sm:text-4xl" style={{ color: accent }}>
            {String(value).padStart(2, "0")}
          </span>
          <span className="mt-1 text-xs uppercase tracking-wide text-neutral-500">{label}</span>
        </div>
      ))}
    </div>
  );
}
