import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { normalizeText } from "@/lib/validation";
import { BLOCKS, ITEM_TYPES } from "@/lib/constants";

// Extraer solo los valores de las constantes para validación
const VALID_BLOCKS = BLOCKS.map(b => b.value);
const VALID_ITEM_TYPES = ITEM_TYPES.map(t => t.value);

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

  if (block && !VALID_BLOCKS.includes(block)) {
    return NextResponse.json(
      { error: "Bloque invalido." },
      { status: 400 }
    );
  }

  if (type && !VALID_ITEM_TYPES.includes(type)) {
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
