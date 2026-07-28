"use client";

import { parseVideoUrl } from "@/lib/video-embed";

export function VideoUrlField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const embed = parseVideoUrl(value);

  return (
    <div className="flex flex-col gap-1 text-sm">
      <span className="font-medium text-neutral-700">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://youtube.com/watch?v=... or a direct .mp4 link"
        className="rounded-lg border border-neutral-300 px-3 py-2 text-sm"
      />
      {value && !embed && (
        <p className="text-xs text-red-600">
          Doesn&apos;t look like a YouTube, Vimeo, or direct video link yet.
        </p>
      )}
      {embed && (
        <div className="mt-1 aspect-video w-full overflow-hidden rounded-lg bg-black">
          {embed.type === "file" ? (
            <video src={embed.src} controls className="h-full w-full" />
          ) : (
            <iframe src={embed.src} className="h-full w-full" allowFullScreen />
          )}
        </div>
      )}
    </div>
  );
}
