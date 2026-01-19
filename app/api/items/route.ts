import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const parseDate = (value: unknown) => {
  if (typeof value !== "string") return null;
  const base = value.split("T")[0];
  const match = base.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (!year || !month || !day) return null;
  const date = new Date(year, month - 1, day, 0, 0, 0);
  if (
    Number.isNaN(date.valueOf()) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
};

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

  if (!ITEM_TYPES.includes(type) || !DAY_BLOCKS.includes(block)) {
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
