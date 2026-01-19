import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const parseDate = (value: unknown) => {
  if (typeof value !== "string") return null;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.valueOf()) ? null : date;
};

const normalizeText = (value: unknown, maxLength: number = 500) => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (trimmed.length === 0 || trimmed.length > maxLength) return null;
  return trimmed;
};

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const cookieStore = await cookies();
  const activeTripId = cookieStore.get("activeTripId")?.value;
  const trip = activeTripId
    ? await prisma.trip.findFirst({
        where: {
          id: activeTripId,
          OR: [
            { ownerId: session.user.id },
            { sharedWith: { some: { userId: session.user.id } } },
          ],
        },
      })
    : await prisma.trip.findFirst({
        where: {
          OR: [
            { ownerId: session.user.id },
            { sharedWith: { some: { userId: session.user.id } } },
          ],
        },
      });
  return NextResponse.json(trip);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);

  const id = typeof body?.id === "string" ? body.id : null;
  const name = normalizeText(body?.name, 100);
  const startDate = parseDate(body?.startDate);
  const endDate = parseDate(body?.endDate);
  const destinations = normalizeText(body?.destinations, 500);
  const notes = normalizeText(body?.notes, 1000);

  if (!name) {
    return NextResponse.json(
      { error: "El nombre es obligatorio y no puede exceder 100 caracteres." },
      { status: 400 }
    );
  }

  if (!startDate || !endDate) {
    return NextResponse.json(
      { error: "Las fechas de inicio y fin son obligatorias y deben ser válidas." },
      { status: 400 }
    );
  }

  if (endDate < startDate) {
    return NextResponse.json(
      { error: "La fecha de fin no puede ser anterior a la fecha de inicio." },
      { status: 400 }
    );
  }

  if (destinations && destinations.length > 500) {
    return NextResponse.json(
      { error: "Los destinos no pueden exceder 500 caracteres." },
      { status: 400 }
    );
  }

  if (notes && notes.length > 1000) {
    return NextResponse.json(
      { error: "Las notas no pueden exceder 1000 caracteres." },
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
    : await prisma.trip.create({
        data: { ...data, ownerId: session.user.id },
      });

  const response = NextResponse.json(trip);
  response.cookies.set("activeTripId", trip.id, { path: "/" });
  return response;
}
