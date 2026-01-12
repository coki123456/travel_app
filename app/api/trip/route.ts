import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
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
  const cookieStore = await cookies();
  const activeTripId = cookieStore.get("activeTripId")?.value;
  const trip = activeTripId
    ? await prisma.trip.findUnique({ where: { id: activeTripId } })
    : await prisma.trip.findFirst();
  return NextResponse.json(trip);
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  const id = typeof body?.id === "string" ? body.id : null;
  const name = normalizeText(body?.name);
  const startDate = parseDate(body?.startDate);
  const endDate = parseDate(body?.endDate);
  const destinations = normalizeText(body?.destinations);
  const notes = normalizeText(body?.notes);

  if (!name || !startDate || !endDate) {
    return NextResponse.json(
      { error: "Nombre, fecha de inicio y fecha de fin son obligatorios." },
      { status: 400 }
    );
  }

  if (endDate < startDate) {
    return NextResponse.json(
      { error: "La fecha de fin no puede ser anterior a la fecha de inicio." },
      { status: 400 }
    );
  }

  const data = {
    name,
    startDate,
    endDate,
    destinations,
    notes,
  };

  const trip = id
    ? await prisma.trip.update({ where: { id }, data })
    : await prisma.trip.create({ data });

  const response = NextResponse.json(trip);
  response.cookies.set("activeTripId", trip.id, { path: "/" });
  return response;
}
