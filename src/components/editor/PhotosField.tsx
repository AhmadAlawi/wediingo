"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const BUCKET = "card-photos";

export function PhotosField({
  cardId,
  photos,
  onChange,
}: {
  cardId: string;
  photos: string[];
  onChange: (photos: string[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    const supabase = createSupabaseBrowserClient();

    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const path = `${cardId}/${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
          cacheControl: "3600",
          upsert: false,
        });
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
        uploaded.push(data.publicUrl);
      }
      onChange([...photos, ...uploaded]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function remove(url: string) {
    onChange(photos.filter((p) => p !== url));
  }

  return (
    <div className="flex flex-col gap-3 text-sm">
      <span className="font-medium text-neutral-700">Photos</span>
      <div className="grid grid-cols-3 gap-2">
        {photos.map((url) => (
          <div key={url} className="group relative aspect-square overflow-hidden rounded-lg">
            <Image src={url} alt="" fill className="object-cover" />
            <button
              type="button"
              onClick={() => remove(url)}
              className="absolute right-1 top-1 rounded-full bg-black/60 px-1.5 text-xs text-white opacity-0 transition group-hover:opacity-100"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        disabled={uploading}
        className="text-xs"
      />
      {uploading && <p className="text-neutral-400">Uploading...</p>}
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}
