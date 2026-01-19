import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json(
      { error: "No autorizado. Debes iniciar sesión." },
      { status: 401 }
    );
  }

  const resolvedParams = await params;

  // Verificar que el viaje existe y que el usuario es el propietario
  const trip = await prisma.trip.findUnique({
    where: { id: resolvedParams.id },
    select: { ownerId: true },
  });

  if (!trip) {
    return NextResponse.json(
      { error: "Viaje no encontrado." },
      { status: 404 }
    );
  }

  if (trip.ownerId !== session.user.id) {
    return NextResponse.json(
      { error: "No tienes permiso para eliminar este viaje." },
      { status: 403 }
    );
  }

  const cookieStore = await cookies();
  const activeTripId = cookieStore.get("activeTripId")?.value;

  await prisma.trip.delete({
    where: { id: resolvedParams.id },
  });

  const response = NextResponse.json({ ok: true });
  if (activeTripId === resolvedParams.id) {
    response.cookies.set("activeTripId", "", { path: "/", maxAge: 0 });
  }

  return response;
}
