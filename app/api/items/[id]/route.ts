import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const normalizeText = (value: unknown) => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const ITEM_TYPES = [
  "HOTEL",
  "FLIGHT",
  "ATTRACTION",
  "FOOD",
  "TRANSFER",
  "NOTE",
];

const DAY_BLOCKS = ["ALL_DAY", "MORNING", "AFTERNOON", "EVENING"];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const body = await request.json().catch(() => null);

  const block = typeof body?.block === "string" ? body.block : undefined;
  const type = typeof body?.type === "string" ? body.type : undefined;
  const title = normalizeText(body?.title) ?? undefined;
  const description = normalizeText(body?.description) ?? undefined;

  if (block && !DAY_BLOCKS.includes(block)) {
    return NextResponse.json(
      { error: "Bloque invalido." },
      { status: 400 }
    );
  }

  if (type && !ITEM_TYPES.includes(type)) {
    return NextResponse.json(
      { error: "Tipo invalido." },
      { status: 400 }
    );
  }

  if (title !== undefined && title.length === 0) {
    return NextResponse.json(
      { error: "El titulo no puede estar vacio." },
      { status: 400 }
    );
  }

  const item = await prisma.item.update({
    where: { id: resolvedParams.id },
    data: {
      block,
      type,
      title,
      description,
    },
  });

  return NextResponse.json(item);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const item = await prisma.item.delete({
    where: { id: resolvedParams.id },
  });

  return NextResponse.json(item);
}
