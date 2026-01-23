import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * Verifica que el usuario sea el dueño del viaje
 */
async function verifyTripOwnership(tripId: string, userId: string) {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
  });

  if (!trip) {
    return { error: "Viaje no encontrado", status: 404 };
  }

  if (trip.ownerId !== userId) {
    return { error: "No tienes permisos para eliminar este viaje", status: 403 };
  }

  return { trip };
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Verificar autenticación
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "No autenticado" },
      { status: 401 }
    );
  }

  const resolvedParams = await params;

  // Verificar permisos - solo el dueño puede eliminar
  const ownershipCheck = await verifyTripOwnership(resolvedParams.id, session.user.id);
  if ("error" in ownershipCheck) {
    return NextResponse.json(
      { error: ownershipCheck.error },
      { status: ownershipCheck.status }
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
