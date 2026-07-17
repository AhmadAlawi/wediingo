/** Field descriptors stored as Template.schema JSON; drives the generic editor form. */
export type FieldType =
  | "text"
  | "textarea"
  | "date"
  | "address"
  | "color-theme"
  | "toggle"
  | "photos"
  | "schedule";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  section: "couple" | "event" | "story" | "media" | "design" | "options";
}

export const FLORAL_TEMPLATE_SCHEMA: FieldDef[] = [
  { key: "partner1Name", label: "Partner 1 name", type: "text", section: "couple" },
  { key: "partner2Name", label: "Partner 2 name", type: "text", section: "couple" },
  { key: "weddingDate", label: "Wedding date", type: "date", section: "event" },
  { key: "venueName", label: "Venue name", type: "text", section: "event" },
  { key: "venueAddress", label: "Venue address", type: "address", section: "event" },
  { key: "schedule", label: "Event schedule", type: "schedule", section: "event" },
  { key: "story", label: "Our story", type: "textarea", section: "story" },
  { key: "photos", label: "Photos", type: "photos", section: "media" },
  { key: "colorTheme", label: "Color theme", type: "color-theme", section: "design" },
  { key: "rsvpEnabled", label: "Enable RSVP", type: "toggle", section: "options" },
  { key: "countdownEnabled", label: "Enable countdown", type: "toggle", section: "options" },
];
