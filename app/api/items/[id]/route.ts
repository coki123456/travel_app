import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { normalizeText } from "@/lib/validation";
import { BLOCKS, ITEM_TYPES } from "@/lib/constants";

// Extraer solo los valores de las constantes para validación
const VALID_BLOCKS = BLOCKS.map(b => b.value);
const VALID_ITEM_TYPES = ITEM_TYPES.map(t => t.value);

/**
 * Verifica que el item pertenezca a un viaje del usuario autenticado
 */
async function verifyItemOwnership(itemId: string, userId: string) {
  const item = await prisma.item.findUnique({
    where: { id: itemId },
    include: {
      day: {
        include: {
          trip: {
            include: {
              sharedWith: true,
            },
          },
        },
      },
    },
  });

  if (!item) {
    return { error: "Item no encontrado", status: 404 };
  }

  const trip = item.day.trip;
  const isOwner = trip.ownerId === userId;
  const isSharedWith = trip.sharedWith.some(share => share.userId === userId);

  if (!isOwner && !isSharedWith) {
    return { error: "No tienes permisos para modificar este item", status: 403 };
  }

  return { item };
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Verificar autenticación
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "No autenticado" },
      { status: 401 }
    );
  }

  const resolvedParams = await params;

  // Verificar permisos
  const ownershipCheck = await verifyItemOwnership(resolvedParams.id, session.user.id);
  if ("error" in ownershipCheck) {
    return NextResponse.json(
      { error: ownershipCheck.error },
      { status: ownershipCheck.status }
    );
  }

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
  // Verificar autenticación
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "No autenticado" },
      { status: 401 }
    );
  }

  const resolvedParams = await params;

  // Verificar permisos
  const ownershipCheck = await verifyItemOwnership(resolvedParams.id, session.user.id);
  if ("error" in ownershipCheck) {
    return NextResponse.json(
      { error: ownershipCheck.error },
      { status: ownershipCheck.status }
    );
  }

  const item = await prisma.item.delete({
    where: { id: resolvedParams.id },
  });

  return NextResponse.json(item);
}
