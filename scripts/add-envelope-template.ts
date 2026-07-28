import { PrismaClient } from "@prisma/client";
import { ENVELOPE_TEMPLATE_SCHEMA } from "../src/lib/template-field-schema";

const prisma = new PrismaClient();

async function main() {
  const schemaJson = JSON.parse(JSON.stringify(ENVELOPE_TEMPLATE_SCHEMA));

  await prisma.template.upsert({
    where: { id: "envelope-classic" },
    update: {
      name: "Sealed With Love",
      thumbnailUrl: "/templates/envelope-classic.svg",
      category: "envelope",
      schema: schemaJson,
      defaultColorTheme: "blush",
      layout: "envelope",
    },
    create: {
      id: "envelope-classic",
      name: "Sealed With Love",
      thumbnailUrl: "/templates/envelope-classic.svg",
      category: "envelope",
      schema: schemaJson,
      defaultColorTheme: "blush",
      layout: "envelope",
    },
  });

  console.log("Envelope template ready.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
