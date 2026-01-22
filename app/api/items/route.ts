import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { parseDate } from "@/lib/date-utils";
import { normalizeText } from "@/lib/validation";
import { BLOCKS, ITEM_TYPES } from "@/lib/constants";

// Extraer solo los valores de las constantes para validación
const VALID_BLOCKS = BLOCKS.map(b => b.value);
const VALID_ITEM_TYPES = ITEM_TYPES.map(t => t.value);

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const activeTripId = cookieStore.get("activeTripId")?.value;
  if (!activeTripId) {
    return NextResponse.json(
      { error: "Selecciona un viaje activo." },
      { status: 400 }
    );
  }

  const body = await request.json().catch(() => null);

  const date = parseDate(body?.date);
  const block = typeof body?.block === "string" ? body.block : null;
  const type = typeof body?.type === "string" ? body.type : null;
  const title = normalizeText(body?.title);
  const description = normalizeText(body?.description);

  if (!date || !block || !type || !title) {
    return NextResponse.json(
      { error: "Fecha, bloque, tipo y titulo son obligatorios." },
      { status: 400 }
    );
  }

  if (!VALID_ITEM_TYPES.includes(type) || !VALID_BLOCKS.includes(block)) {
    return NextResponse.json(
      { error: "Bloque o tipo invalido." },
      { status: 400 }
    );
  }

  const trip = await prisma.trip.findUnique({
    where: { id: activeTripId },
  });
  if (!trip) {
    return NextResponse.json(
      { error: "No existe un viaje activo." },
      { status: 400 }
    );
  }

  const day = await prisma.day.upsert({
    where: { tripId_date: { tripId: trip.id, date } },
    update: {},
    create: {
      date,
      tripId: trip.id,
    },
  });

  const lastItem = await prisma.item.findFirst({
    where: { dayId: day.id, block },
    orderBy: { orderIndex: "desc" },
  });

  const nextIndex = lastItem ? lastItem.orderIndex + 1 : 0;

  const item = await prisma.item.create({
    data: {
      dayId: day.id,
      block,
      type,
      title,
      description,
      orderIndex: nextIndex,
    },
  });

  return NextResponse.json(item);
}
