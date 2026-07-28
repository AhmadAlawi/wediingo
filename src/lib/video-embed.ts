export type VideoEmbed = { type: "youtube" | "vimeo" | "file"; src: string } | null;

export function parseVideoUrl(url: string): VideoEmbed {
  const trimmed = url.trim();
  if (!trimmed) return null;

  const youtubeMatch = trimmed.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{6,})/,
  );
  if (youtubeMatch) {
    return { type: "youtube", src: `https://www.youtube.com/embed/${youtubeMatch[1]}` };
  }

  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) {
    return { type: "vimeo", src: `https://player.vimeo.com/video/${vimeoMatch[1]}` };
  }

  if (/^https?:\/\/.+\.(mp4|webm|ogg)(\?.*)?$/i.test(trimmed)) {
    return { type: "file", src: trimmed };
  }

  return null;
}
