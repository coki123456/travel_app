import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { parseDate } from "@/lib/date-utils";
import { normalizeText } from "@/lib/validation";

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
    : await prisma.trip.create({
        data: { ...data, ownerId: session.user.id },
      });

  const response = NextResponse.json(trip);
  response.cookies.set("activeTripId", trip.id, { path: "/" });
  return response;
}
