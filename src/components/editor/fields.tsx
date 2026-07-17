"use client";

import { CardData, ScheduleItem } from "@/lib/card-schema";
import { COLOR_THEMES } from "@/lib/card-schema";

type SetField = <K extends keyof CardData>(key: K, value: CardData[K]) => void;

export function TextField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium text-neutral-700">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-neutral-300 px-3 py-2 text-sm"
      />
    </label>
  );
}

export function TextareaField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium text-neutral-700">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        className="rounded-lg border border-neutral-300 px-3 py-2 text-sm"
      />
    </label>
  );
}

export function DateField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium text-neutral-700">{label}</span>
      <input
        type="datetime-local"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-neutral-300 px-3 py-2 text-sm"
      />
    </label>
  );
}

export function ToggleField({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-2 text-sm">
      <span className="font-medium text-neutral-700">{label}</span>
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        className="h-5 w-5 accent-neutral-900"
      />
    </label>
  );
}

export function ColorThemeField({ value, onChange }: { value: CardData["colorTheme"]; onChange: (v: CardData["colorTheme"]) => void }) {
  return (
    <div className="flex flex-col gap-2 text-sm">
      <span className="font-medium text-neutral-700">Color theme</span>
      <div className="flex gap-3">
        {Object.entries(COLOR_THEMES).map(([key, theme]) => (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key as CardData["colorTheme"])}
            className="h-9 w-9 rounded-full border-2 transition"
            style={{
              backgroundColor: theme.primary,
              borderColor: value === key ? theme.accent : "transparent",
            }}
            aria-label={key}
          />
        ))}
      </div>
    </div>
  );
}

export function ScheduleField({ items, onChange }: { items: ScheduleItem[]; onChange: (v: ScheduleItem[]) => void }) {
  function update(i: number, patch: Partial<ScheduleItem>) {
    onChange(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  }
  function remove(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }
  function add() {
    onChange([...items, { time: "", title: "", description: "" }]);
  }

  return (
    <div className="flex flex-col gap-3 text-sm">
      <span className="font-medium text-neutral-700">Event schedule</span>
      {items.map((item, i) => (
        <div key={i} className="flex flex-col gap-2 rounded-lg border border-neutral-200 p-3">
          <div className="flex gap-2">
            <input
              placeholder="Time (e.g. 4:00 PM)"
              value={item.time}
              onChange={(e) => update(i, { time: e.target.value })}
              className="w-32 rounded-md border border-neutral-300 px-2 py-1"
            />
            <input
              placeholder="Title (e.g. Ceremony)"
              value={item.title}
              onChange={(e) => update(i, { title: e.target.value })}
              className="flex-1 rounded-md border border-neutral-300 px-2 py-1"
            />
            <button type="button" onClick={() => remove(i)} className="text-neutral-400 hover:text-red-600">
              ✕
            </button>
          </div>
          <input
            placeholder="Description (optional)"
            value={item.description}
            onChange={(e) => update(i, { description: e.target.value })}
            className="rounded-md border border-neutral-300 px-2 py-1"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="self-start rounded-lg border border-dashed border-neutral-300 px-3 py-1.5 text-neutral-600 hover:bg-neutral-50"
      >
        + Add item
      </button>
    </div>
  );
}

export type { SetField };
