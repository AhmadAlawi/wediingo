import { CardData, COLOR_THEMES } from "@/lib/card-schema";

// Real Google Fonts family names for the standalone download (no Next.js CSS
// variables available here), matching the choices baked into COLOR_THEMES.
const BODY_FONT_NAME: Record<CardData["colorTheme"], string> = {
  blush: "Source Serif 4",
  sage: "DM Sans",
  ivory: "Source Serif 4",
  burgundy: "DM Sans",
  lavender: "Work Sans",
  terracotta: "Source Serif 4",
  navy: "Source Serif 4",
  forest: "Montserrat",
  dustyrose: "Plus Jakarta Sans",
  champagne: "DM Sans",
};

async function toDataUri(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type") ?? "image/jpeg";
    const buffer = Buffer.from(await res.arrayBuffer());
    return `data:${contentType};base64,${buffer.toString("base64")}`;
  } catch {
    return null;
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function generateStaticCardHtml(data: CardData): Promise<string> {
  const theme = COLOR_THEMES[data.colorTheme];
  const bodyFontName = BODY_FONT_NAME[data.colorTheme];
  const fontsHref = `https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=${encodeURIComponent(bodyFontName)}&display=swap`;
  const partner1 = escapeHtml(data.partner1Name || "Partner One");
  const partner2 = escapeHtml(data.partner2Name || "Partner Two");
  const dateLabel = data.weddingDate
    ? new Date(data.weddingDate).toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const photoUris = (await Promise.all(data.photos.map(toDataUri))).filter(
    (uri): uri is string => Boolean(uri),
  );

  const photosHtml = photoUris.length
    ? `<section class="fade"><div class="photo-grid">${photoUris
        .map((uri) => `<div class="photo"><img src="${uri}" alt="" /></div>`)
        .join("")}</div></section>`
    : "";

  const storyHtml = data.story
    ? `<section class="fade"><h2>Our story</h2><p class="story">${escapeHtml(data.story).replace(/\n/g, "<br/>")}</p></section>`
    : "";

  const scheduleHtml = data.schedule.length
    ? `<section class="fade"><h2>Schedule</h2><div class="schedule">${data.schedule
        .map(
          (item) =>
            `<div class="schedule-item"><span class="time">${escapeHtml(item.time)}</span><div><p class="title">${escapeHtml(item.title)}</p>${
              item.description ? `<p class="desc">${escapeHtml(item.description)}</p>` : ""
            }</div></div>`,
        )
        .join("")}</div></section>`
    : "";

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${partner1} &amp; ${partner2}</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="${fontsHref}" rel="stylesheet" />
<style>
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: ${theme.bg};
    color: #262626;
    font-family: '${bodyFontName}', Georgia, serif;
  }
  .hero {
    min-height: 70vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 6rem 1.5rem;
    color: ${theme.accent};
  }
  .hero .eyebrow { font-size: 0.85rem; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 1rem; }
  .hero h1 { font-family: 'Playfair Display', Georgia, serif; font-size: 3rem; color: ${theme.primary}; margin: 0; font-weight: 600; }
  .hero .amp { margin: 0 0.75rem; font-weight: 300; }
  .hero .date { margin-top: 1.5rem; font-size: 1.1rem; }
  .hero .venue { margin-top: 0.25rem; font-size: 0.9rem; color: #737373; }
  section { max-width: 640px; margin: 0 auto; padding: 3rem 1.5rem; text-align: center; }
  section h2 { font-family: 'Playfair Display', Georgia, serif; color: ${theme.primary}; font-size: 1.5rem; margin-bottom: 1rem; font-weight: 600; }
  .story { line-height: 1.7; color: #525252; }
  .photo-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; max-width: 900px; margin: 0 auto; }
  .photo { aspect-ratio: 1; overflow: hidden; border-radius: 0.5rem; }
  .photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .schedule { display: flex; flex-direction: column; gap: 1.5rem; text-align: left; }
  .schedule-item { display: flex; gap: 1rem; border-left: 2px solid ${theme.secondary}; padding-left: 1rem; }
  .schedule-item .time { width: 5rem; flex-shrink: 0; font-weight: 600; color: ${theme.primary}; }
  .schedule-item .title { margin: 0; font-weight: 600; color: #262626; }
  .schedule-item .desc { margin: 0.15rem 0 0; font-size: 0.9rem; color: #737373; }
  footer { text-align: center; padding: 2rem; font-size: 0.75rem; color: #a3a3a3; }
  .fade { animation: fadeIn 0.8s ease-out both; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  @media (max-width: 640px) { .hero h1 { font-size: 2.2rem; } .photo-grid { grid-template-columns: repeat(2, 1fr); } }
</style>
</head>
<body>
  <section class="hero fade">
    <p class="eyebrow">We&rsquo;re getting married</p>
    <h1>${partner1}<span class="amp">&amp;</span>${partner2}</h1>
    ${dateLabel ? `<p class="date">${dateLabel}</p>` : ""}
    ${data.venueName ? `<p class="venue">${escapeHtml(data.venueName)}</p>` : ""}
  </section>
  ${storyHtml}
  ${photosHtml}
  ${scheduleHtml}
  <footer>Made with love for ${partner1} &amp; ${partner2}</footer>
</body>
</html>`;
}
