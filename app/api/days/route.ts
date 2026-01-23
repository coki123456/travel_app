import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { parseDate, normalizeToDay } from "@/lib/date-utils";
import { normalizeText } from "@/lib/validation";

// Helper para parseDate con fin de día (23:59:59)
const parseDateEndOfDay = (value: unknown) => {
  const date = parseDate(value);
  if (!date) return null;
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
};

/**
 * Verifica que el usuario tenga acceso al viaje
 */
async function verifyTripAccess(tripId: string, userId: string) {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: {
      sharedWith: true,
    },
  });

  if (!trip) {
    return { error: "Viaje no encontrado", status: 404 };
  }

  const isOwner = trip.ownerId === userId;
  const isSharedWith = trip.sharedWith.some(share => share.userId === userId);

  if (!isOwner && !isSharedWith) {
    return { error: "No tienes acceso a este viaje", status: 403 };
  }

  return { trip };
}

export async function GET(request: NextRequest) {
  // Verificar autenticación
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "No autenticado" },
      { status: 401 }
    );
  }

  const cookieStore = await cookies();
  const activeTripId = cookieStore.get("activeTripId")?.value;
  if (!activeTripId) {
    return NextResponse.json(
      { error: "Selecciona un viaje activo." },
      { status: 400 }
    );
  }

  // Verificar permisos
  const accessCheck = await verifyTripAccess(activeTripId, session.user.id);
  if ("error" in accessCheck) {
    return NextResponse.json(
      { error: accessCheck.error },
      { status: accessCheck.status }
    );
  }

  const { searchParams } = new URL(request.url);
  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");

  const fromDate = parseDate(fromParam);
  const toDate = parseDateEndOfDay(toParam);

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
  // Verificar autenticación
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "No autenticado" },
      { status: 401 }
    );
  }

  const cookieStore = await cookies();
  const activeTripId = cookieStore.get("activeTripId")?.value;
  if (!activeTripId) {
    return NextResponse.json(
      { error: "Selecciona un viaje activo." },
      { status: 400 }
    );
  }

  // Verificar permisos
  const accessCheck = await verifyTripAccess(activeTripId, session.user.id);
  if ("error" in accessCheck) {
    return NextResponse.json(
      { error: accessCheck.error },
      { status: accessCheck.status }
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
