import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const parseDate = (value: unknown, endOfDay = false) => {
  if (typeof value !== "string") return null;
  const suffix = endOfDay ? "T23:59:59" : "T00:00:00";
  const date = new Date(`${value}${suffix}`);
  return Number.isNaN(date.valueOf()) ? null : date;
};

const normalizeText = (value: unknown) => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");

  const fromDate = parseDate(fromParam);
  const toDate = parseDate(toParam, true);

  if (!fromDate || !toDate) {
    return NextResponse.json(
      { error: "from y to son obligatorios con formato YYYY-MM-DD." },
      { status: 400 }
    );
  }

  const days = await prisma.day.findMany({
    where: {
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
  const body = await request.json().catch(() => null);

  const date = parseDate(body?.date);
  const city = normalizeText(body?.city);
  const summary = normalizeText(body?.summary);
  const journal = normalizeText(body?.journal);

  if (!date) {
    return NextResponse.json(
      { error: "date es obligatorio con formato YYYY-MM-DD." },
      { status: 400 }
    );
  }

  const trip = await prisma.trip.findFirst();
  if (!trip) {
    return NextResponse.json(
      { error: "No existe un Trip. Crealo primero." },
      { status: 400 }
    );
  }

  const day = await prisma.day.upsert({
    where: { date },
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
