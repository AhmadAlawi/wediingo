import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const MAX_SIZE = 8 * 1024 * 1024; // 8MB
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const UPLOADS_ROOT = path.join(process.cwd(), "public", "uploads");

async function requireOwnedCard(cardId: string) {
  const user = await getCurrentUser();
  if (!user) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };

  const card = await prisma.card.findUnique({ where: { id: cardId } });
  if (!card || card.userId !== user.id) {
    return { error: NextResponse.json({ error: "Not found" }, { status: 404 }) };
  }
  return { card };
}

export async function POST(request: NextRequest, { params }: { params: { cardId: string } }) {
  const result = await requireOwnedCard(params.cardId);
  if (result.error) return result.error;

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const extension = ALLOWED_TYPES[file.type];
  if (!extension) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File too large (max 8MB)" }, { status: 400 });
  }

  const cardDir = path.join(UPLOADS_ROOT, params.cardId);
  await mkdir(cardDir, { recursive: true });

  const filename = `${randomUUID()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(cardDir, filename), buffer);

  return NextResponse.json({ url: `/uploads/${params.cardId}/${filename}` });
}

export async function DELETE(request: NextRequest, { params }: { params: { cardId: string } }) {
  const result = await requireOwnedCard(params.cardId);
  if (result.error) return result.error;

  const { url } = await request.json();
  const expectedPrefix = `/uploads/${params.cardId}/`;
  if (typeof url !== "string" || !url.startsWith(expectedPrefix)) {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  const filename = url.slice(expectedPrefix.length);
  if (filename.includes("/") || filename.includes("..")) {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  try {
    await unlink(path.join(UPLOADS_ROOT, params.cardId, filename));
  } catch {
    // already gone, ignore
  }

  return NextResponse.json({ ok: true });
}
