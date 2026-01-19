import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json(
      { error: "No autorizado. Debes iniciar sesión." },
      { status: 401 }
    );
  }

  const body = await request.json().catch(() => null);
  const id = typeof body?.id === "string" ? body.id : null;

  if (!id) {
    return NextResponse.json(
      { error: "El id del viaje es obligatorio." },
      { status: 400 }
    );
  }

  // Verificar que el usuario tenga acceso al viaje (propietario o compartido)
  const trip = await prisma.trip.findFirst({
    where: {
      id,
      OR: [
        { ownerId: session.user.id },
        { sharedWith: { some: { userId: session.user.id } } },
      ],
    },
  });

  if (!trip) {
    return NextResponse.json(
      { error: "No tienes acceso a este viaje." },
      { status: 403 }
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("activeTripId", id, { path: "/" });
  return response;
}
