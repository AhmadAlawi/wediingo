"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CardData, cardDataSchema } from "@/lib/card-schema";
import { FieldDef } from "@/lib/template-field-schema";
import { WeddingCardView } from "@/components/wedding-card/WeddingCardView";
import {
  ColorThemeField,
  DateField,
  ScheduleField,
  TextField,
  TextareaField,
  ToggleField,
} from "@/components/editor/fields";
import { PhotosField } from "@/components/editor/PhotosField";

const SECTIONS: Array<{ key: FieldDef["section"]; label: string }> = [
  { key: "couple", label: "Couple" },
  { key: "event", label: "Event" },
  { key: "story", label: "Story" },
  { key: "media", label: "Photos" },
  { key: "design", label: "Design" },
  { key: "options", label: "Options" },
];

export function CardEditor({
  cardId,
  initialData,
  fields,
  status,
}: {
  cardId: string;
  initialData: CardData;
  fields: FieldDef[];
  status: string;
}) {
  const [data, setData] = useState<CardData>(initialData);
  const [activeSection, setActiveSection] = useState<FieldDef["section"]>("couple");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const save = useCallback(async (next: CardData) => {
    setSaveState("saving");
    try {
      const res = await fetch(`/api/cards/${cardId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: next }),
      });
      setSaveState(res.ok ? "saved" : "error");
    } catch {
      setSaveState("error");
    }
  }, [cardId]);

  function update<K extends keyof CardData>(key: K, value: CardData[K]) {
    setData((prev) => {
      const next = cardDataSchema.parse({ ...prev, [key]: value });
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
      saveTimeout.current = setTimeout(() => save(next), 800);
      return next;
    });
  }

  useEffect(() => {
    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, []);

  const visibleFields = fields.filter((f) => f.section === activeSection);

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center justify-between border-b border-neutral-200 px-6 py-3">
        <Link href="/dashboard" className="text-sm text-neutral-500 hover:underline">
          ← Dashboard
        </Link>
        <div className="text-sm text-neutral-400">
          {saveState === "saving" && "Saving..."}
          {saveState === "saved" && "Saved"}
          {saveState === "error" && <span className="text-red-600">Save failed</span>}
          {saveState === "idle" && `Status: ${status}`}
        </div>
        <Link
          href={`/editor/${cardId}/publish`}
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
        >
          Publish
        </Link>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-80 shrink-0 overflow-y-auto border-r border-neutral-200 p-6">
          <nav className="mb-6 flex flex-wrap gap-2">
            {SECTIONS.map((s) => (
              <button
                key={s.key}
                onClick={() => setActiveSection(s.key)}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  activeSection === s.key
                    ? "bg-neutral-900 text-white"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                {s.label}
              </button>
            ))}
          </nav>

          <div className="flex flex-col gap-5">
            {visibleFields.map((field) => {
              switch (field.type) {
                case "text":
                  return (
                    <TextField
                      key={field.key}
                      label={field.label}
                      value={String(data[field.key as keyof CardData] ?? "")}
                      onChange={(v) => update(field.key as keyof CardData, v as never)}
                    />
                  );
                case "address":
                  return (
                    <TextField
                      key={field.key}
                      label={field.label}
                      value={String(data[field.key as keyof CardData] ?? "")}
                      onChange={(v) => update(field.key as keyof CardData, v as never)}
                    />
                  );
                case "textarea":
                  return (
                    <TextareaField
                      key={field.key}
                      label={field.label}
                      value={String(data[field.key as keyof CardData] ?? "")}
                      onChange={(v) => update(field.key as keyof CardData, v as never)}
                    />
                  );
                case "date":
                  return (
                    <DateField
                      key={field.key}
                      label={field.label}
                      value={String(data[field.key as keyof CardData] ?? "")}
                      onChange={(v) => update(field.key as keyof CardData, v as never)}
                    />
                  );
                case "toggle":
                  return (
                    <ToggleField
                      key={field.key}
                      label={field.label}
                      value={Boolean(data[field.key as keyof CardData])}
                      onChange={(v) => update(field.key as keyof CardData, v as never)}
                    />
                  );
                case "color-theme":
                  return (
                    <ColorThemeField
                      key={field.key}
                      value={data.colorTheme}
                      onChange={(v) => update("colorTheme", v)}
                    />
                  );
                case "schedule":
                  return (
                    <ScheduleField
                      key={field.key}
                      items={data.schedule}
                      onChange={(v) => update("schedule", v)}
                    />
                  );
                case "photos":
                  return (
                    <PhotosField
                      key={field.key}
                      cardId={cardId}
                      photos={data.photos}
                      onChange={(v) => update("photos", v)}
                    />
                  );
                default:
                  return null;
              }
            })}
          </div>
        </aside>

        <section className="flex-1 overflow-y-auto bg-neutral-50">
          <div className="mx-auto max-w-2xl scale-[0.95] origin-top">
            <WeddingCardView data={data} watermark interactiveRsvp={false} />
          </div>
        </section>
      </div>
    </div>
  );
}
