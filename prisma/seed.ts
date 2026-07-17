import { PrismaClient } from "@prisma/client";
import { FLORAL_TEMPLATE_SCHEMA } from "../src/lib/template-field-schema";
import { DEFAULT_CARD_DATA } from "../src/lib/card-schema";

const prisma = new PrismaClient();
const schemaJson = JSON.parse(JSON.stringify(FLORAL_TEMPLATE_SCHEMA));

async function main() {
  await prisma.template.upsert({
    where: { id: "floral-elegant" },
    update: {
      name: "Floral Elegant",
      thumbnailUrl: "/templates/floral-elegant.svg",
      category: "floral",
      schema: schemaJson,
    },
    create: {
      id: "floral-elegant",
      name: "Floral Elegant",
      thumbnailUrl: "/templates/floral-elegant.svg",
      category: "floral",
      schema: schemaJson,
    },
  });

  await prisma.template.upsert({
    where: { id: "minimalist-mono" },
    update: {
      name: "Minimalist Mono",
      thumbnailUrl: "/templates/minimalist-mono.svg",
      category: "minimalist",
      schema: schemaJson,
    },
    create: {
      id: "minimalist-mono",
      name: "Minimalist Mono",
      thumbnailUrl: "/templates/minimalist-mono.svg",
      category: "minimalist",
      schema: schemaJson,
    },
  });

  await prisma.template.upsert({
    where: { id: "traditional-gold" },
    update: {
      name: "Traditional Gold",
      thumbnailUrl: "/templates/traditional-gold.svg",
      category: "traditional",
      schema: schemaJson,
    },
    create: {
      id: "traditional-gold",
      name: "Traditional Gold",
      thumbnailUrl: "/templates/traditional-gold.svg",
      category: "traditional",
      schema: schemaJson,
    },
  });

  console.log("Seeded templates. Default card data shape:", DEFAULT_CARD_DATA);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
