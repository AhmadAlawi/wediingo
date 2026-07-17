"use client";

const HEARTS = [
  { left: "8%", delay: "0s", duration: "14s", size: 14 },
  { left: "22%", delay: "3s", duration: "18s", size: 10 },
  { left: "38%", delay: "1.5s", duration: "16s", size: 16 },
  { left: "55%", delay: "4.5s", duration: "20s", size: 12 },
  { left: "70%", delay: "2s", duration: "17s", size: 18 },
  { left: "85%", delay: "5.5s", duration: "15s", size: 11 },
];

export function FloatingHearts({ color = "#b76e79" }: { color?: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {HEARTS.map((h, i) => (
        <span
          key={i}
          className="floating-heart absolute bottom-0"
          style={{
            left: h.left,
            width: h.size,
            height: h.size,
            animationDelay: h.delay,
            animationDuration: h.duration,
          }}
        >
          <svg viewBox="0 0 24 24" fill={color} width="100%" height="100%">
            <path d="M12 21s-7.5-4.6-10-9.1C0.3 8.4 2 5 5.5 5 8 5 10 6.6 12 9c2-2.4 4-4 6.5-4C22 5 23.7 8.4 22 11.9 19.5 16.4 12 21 12 21z" />
          </svg>
        </span>
      ))}
    </div>
  );
}
