import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { PrismaClient } from "@prisma/client";
import { COLOR_THEMES } from "../src/lib/card-schema";
import { FLORAL_TEMPLATE_SCHEMA } from "../src/lib/template-field-schema";

const prisma = new PrismaClient();
const OUT_DIR = join(__dirname, "..", "public", "templates", "gen");
mkdirSync(OUT_DIR, { recursive: true });

const THEME_KEYS = Object.keys(COLOR_THEMES) as Array<keyof typeof COLOR_THEMES>;

const CATEGORIES = [
  "floral",
  "minimalist",
  "traditional",
  "modern",
  "rustic",
  "boho",
  "vintage",
  "garden",
  "beach",
  "classic",
] as const;

const ADJECTIVES = [
  "Elegant",
  "Whimsical",
  "Timeless",
  "Radiant",
  "Serene",
  "Golden",
  "Graceful",
  "Dreamy",
  "Charming",
  "Enchanted",
];

type Theme = { primary: string; secondary: string; accent: string; bg: string };

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function svgWrap(bg: string, body: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
  <rect width="400" height="300" fill="${bg}"/>
  ${body}
</svg>
`;
}

const STYLES: Record<(typeof CATEGORIES)[number], (t: Theme, title: string, subtitle: string) => string> = {
  floral: (t, title, subtitle) =>
    svgWrap(
      t.bg,
      `<circle cx="60" cy="50" r="30" fill="${t.secondary}"/>
  <circle cx="340" cy="250" r="40" fill="${t.secondary}"/>
  <circle cx="350" cy="40" r="16" fill="${t.secondary}"/>
  <text x="200" y="140" font-family="Georgia, serif" font-size="22" fill="${t.accent}" text-anchor="middle">${esc(title)}</text>
  <text x="200" y="170" font-family="Georgia, serif" font-size="14" fill="${t.primary}" text-anchor="middle">${esc(subtitle)}</text>`,
    ),
  minimalist: (t, title, subtitle) =>
    svgWrap(
      t.bg,
      `<rect x="40" y="40" width="320" height="220" fill="none" stroke="${t.primary}" stroke-width="1"/>
  <text x="200" y="150" font-family="Helvetica, Arial, sans-serif" font-size="18" letter-spacing="2" fill="${t.accent}" text-anchor="middle">${esc(title.toUpperCase())}</text>
  <text x="200" y="175" font-family="Helvetica, Arial, sans-serif" font-size="11" letter-spacing="4" fill="${t.primary}" text-anchor="middle">${esc(subtitle.toUpperCase())}</text>`,
    ),
  traditional: (t, title, subtitle) =>
    svgWrap(
      t.bg,
      `<rect x="20" y="20" width="360" height="260" fill="none" stroke="${t.primary}" stroke-width="4"/>
  <rect x="32" y="32" width="336" height="236" fill="none" stroke="${t.primary}" stroke-width="1"/>
  <text x="200" y="150" font-family="Georgia, serif" font-size="20" fill="${t.accent}" text-anchor="middle">${esc(title)}</text>
  <text x="200" y="178" font-family="Georgia, serif" font-size="14" fill="${t.primary}" text-anchor="middle">${esc(subtitle)}</text>`,
    ),
  modern: (t, title, subtitle) =>
    svgWrap(
      t.bg,
      `<path d="M0,300 L160,0 L200,0 L40,300 Z" fill="${t.secondary}"/>
  <text x="230" y="150" font-family="Helvetica, Arial, sans-serif" font-size="22" font-weight="700" fill="${t.accent}" text-anchor="middle">${esc(title)}</text>
  <text x="230" y="176" font-family="Helvetica, Arial, sans-serif" font-size="12" fill="${t.primary}" text-anchor="middle">${esc(subtitle)}</text>`,
    ),
  rustic: (t, title, subtitle) =>
    svgWrap(
      t.bg,
      `<rect x="24" y="24" width="352" height="252" fill="none" stroke="${t.primary}" stroke-width="2" stroke-dasharray="10 6"/>
  <text x="200" y="148" font-family="Georgia, serif" font-size="20" fill="${t.accent}" text-anchor="middle">${esc(title)}</text>
  <text x="200" y="174" font-family="Georgia, serif" font-size="13" fill="${t.primary}" text-anchor="middle">${esc(subtitle)}</text>`,
    ),
  boho: (t, title, subtitle) =>
    svgWrap(
      t.bg,
      `<path d="M60,90 Q200,20 340,90" fill="none" stroke="${t.primary}" stroke-width="2" stroke-dasharray="3 7"/>
  <text x="200" y="160" font-family="Georgia, serif" font-size="21" fill="${t.accent}" text-anchor="middle">${esc(title)}</text>
  <text x="200" y="186" font-family="Georgia, serif" font-size="13" fill="${t.primary}" text-anchor="middle">${esc(subtitle)}</text>`,
    ),
  vintage: (t, title, subtitle) =>
    svgWrap(
      t.bg,
      `<path d="M30,30 L30,60 M30,30 L60,30" stroke="${t.primary}" stroke-width="2" fill="none"/>
  <path d="M370,30 L370,60 M370,30 L340,30" stroke="${t.primary}" stroke-width="2" fill="none"/>
  <path d="M30,270 L30,240 M30,270 L60,270" stroke="${t.primary}" stroke-width="2" fill="none"/>
  <path d="M370,270 L370,240 M370,270 L340,270" stroke="${t.primary}" stroke-width="2" fill="none"/>
  <text x="200" y="150" font-family="Georgia, serif" font-style="italic" font-size="22" fill="${t.accent}" text-anchor="middle">${esc(title)}</text>
  <text x="200" y="176" font-family="Georgia, serif" font-size="13" fill="${t.primary}" text-anchor="middle">${esc(subtitle)}</text>`,
    ),
  garden: (t, title, subtitle) =>
    svgWrap(
      t.bg,
      `<ellipse cx="70" cy="230" rx="26" ry="14" fill="${t.secondary}" transform="rotate(-20 70 230)"/>
  <ellipse cx="330" cy="70" rx="26" ry="14" fill="${t.secondary}" transform="rotate(20 330 70)"/>
  <ellipse cx="330" cy="230" rx="20" ry="12" fill="${t.secondary}" transform="rotate(-10 330 230)"/>
  <text x="200" y="150" font-family="Georgia, serif" font-size="22" fill="${t.accent}" text-anchor="middle">${esc(title)}</text>
  <text x="200" y="176" font-family="Georgia, serif" font-size="13" fill="${t.primary}" text-anchor="middle">${esc(subtitle)}</text>`,
    ),
  beach: (t, title, subtitle) =>
    svgWrap(
      t.bg,
      `<path d="M0,250 Q100,220 200,250 T400,250 V300 H0 Z" fill="${t.secondary}"/>
  <text x="200" y="140" font-family="Georgia, serif" font-size="22" fill="${t.accent}" text-anchor="middle">${esc(title)}</text>
  <text x="200" y="168" font-family="Georgia, serif" font-size="13" fill="${t.primary}" text-anchor="middle">${esc(subtitle)}</text>`,
    ),
  classic: (t, title, subtitle) =>
    svgWrap(
      t.bg,
      `<line x1="120" y1="130" x2="170" y2="130" stroke="${t.primary}" stroke-width="1"/>
  <line x1="230" y1="130" x2="280" y2="130" stroke="${t.primary}" stroke-width="1"/>
  <text x="200" y="150" font-family="Georgia, serif" font-size="22" fill="${t.accent}" text-anchor="middle">${esc(title)}</text>
  <text x="200" y="176" font-family="Georgia, serif" font-size="13" fill="${t.primary}" text-anchor="middle">${esc(subtitle)}</text>`,
    ),
};

const RESERVED_IDS = new Set(["floral-elegant", "minimalist-mono", "traditional-gold"]);

async function main() {
  const schemaJson = JSON.parse(JSON.stringify(FLORAL_TEMPLATE_SCHEMA));
  const TARGET = 100;
  let created = 0;
  let counter = 1;

  for (let i = 0; RESERVED_IDS.size + created < TARGET; i++) {
    const category = CATEGORIES[i % CATEGORIES.length];
    const theme = THEME_KEYS[Math.floor(i / CATEGORIES.length) % THEME_KEYS.length];
    const adjective = ADJECTIVES[Math.floor(i / (CATEGORIES.length * THEME_KEYS.length)) % ADJECTIVES.length];
    const id = `gen-${String(counter).padStart(3, "0")}`;
    const name = `${adjective} ${category.charAt(0).toUpperCase()}${category.slice(1)}`;
    const t = COLOR_THEMES[theme];

    const svg = STYLES[category](t, name, "Anna & James");
    const fileName = `${id}.svg`;
    writeFileSync(join(OUT_DIR, fileName), svg, "utf-8");

    await prisma.template.upsert({
      where: { id },
      update: {
        name,
        thumbnailUrl: `/templates/gen/${fileName}`,
        category,
        schema: schemaJson,
        defaultColorTheme: theme,
      },
      create: {
        id,
        name,
        thumbnailUrl: `/templates/gen/${fileName}`,
        category,
        schema: schemaJson,
        defaultColorTheme: theme,
      },
    });

    created++;
    counter++;
  }

  console.log(`Generated and seeded ${created} templates (plus 3 original) = ${created + RESERVED_IDS.size} total.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
