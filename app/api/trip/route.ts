import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const parseDate = (value: unknown) => {
  if (typeof value !== "string") return null;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.valueOf()) ? null : date;
};

const normalizeText = (value: unknown) => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

export async function GET() {
  const trip = await prisma.trip.findFirst();
  return NextResponse.json(trip);
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  const name = normalizeText(body?.name);
  const startDate = parseDate(body?.startDate);
  const endDate = parseDate(body?.endDate);
  const destinations = normalizeText(body?.destinations);
  const notes = normalizeText(body?.notes);

  if (!name || !startDate || !endDate) {
    return NextResponse.json(
      { error: "name, startDate y endDate son obligatorios." },
      { status: 400 }
    );
  }

  if (endDate < startDate) {
    return NextResponse.json(
      { error: "endDate no puede ser anterior a startDate." },
      { status: 400 }
    );
  }

  const existing = await prisma.trip.findFirst();

  const data = {
    name,
    startDate,
    endDate,
    destinations,
    notes,
  };

  const trip = existing
    ? await prisma.trip.update({ where: { id: existing.id }, data })
    : await prisma.trip.create({ data });

  return NextResponse.json(trip);
}
