import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const parseDate = (value: unknown, endOfDay = false) => {
  if (typeof value !== "string") return null;
  const base = value.split("T")[0];
  const match = base.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (!year || !month || !day) return null;
  const hours = endOfDay ? 23 : 0;
  const minutes = endOfDay ? 59 : 0;
  const seconds = endOfDay ? 59 : 0;
  const date = new Date(year, month - 1, day, hours, minutes, seconds);
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

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const activeTripId = cookieStore.get("activeTripId")?.value;
  if (!activeTripId) {
    return NextResponse.json(
      { error: "Selecciona un viaje activo." },
      { status: 400 }
    );
  }

  const { searchParams } = new URL(request.url);
  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");

  const fromDate = parseDate(fromParam);
  const toDate = parseDate(toParam, true);

  if (!fromDate || !toDate) {
    return NextResponse.json(
      { error: "Los parametros from y to son obligatorios (YYYY-MM-DD)." },
      { status: 400 }
    );
  }

  const days = await prisma.day.findMany({
    where: {
      tripId: activeTripId,
      date: {
        gte: fromDate,
        lte: toDate,
      },
    },
    orderBy: {
      date: "asc",
    },
  });

  return NextResponse.json(days);
}

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
  const city = normalizeText(body?.city);
  const summary = normalizeText(body?.summary);
  const journal = normalizeText(body?.journal);

  if (!date) {
    return NextResponse.json(
      { error: "La fecha es obligatoria con formato YYYY-MM-DD." },
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
    update: { city, summary, journal },
    create: {
      date,
      tripId: trip.id,
      city,
      summary,
      journal,
    },
  });

  return NextResponse.json(day);
}
