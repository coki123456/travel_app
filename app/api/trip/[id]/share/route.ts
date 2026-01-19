import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id: tripId } = await params;
  const body = await request.json().catch(() => null);

  const { email, role } = body;

  if (!email) {
    return NextResponse.json(
      { error: "Email es requerido" },
      { status: 400 }
    );
  }

  // Verificar que el usuario actual es el dueño del viaje
  const trip = await prisma.trip.findFirst({
    where: {
      id: tripId,
      ownerId: session.user.id,
    },
  });

  if (!trip) {
    return NextResponse.json(
      { error: "Viaje no encontrado o sin permisos" },
      { status: 404 }
    );
  }

  // Buscar el usuario con el que compartir
  const userToShare = await prisma.user.findUnique({
    where: { email },
  });

  if (!userToShare) {
    return NextResponse.json(
      { error: "Usuario no encontrado con ese email" },
      { status: 404 }
    );
  }

  // No permitir compartir consigo mismo
  if (userToShare.id === session.user.id) {
    return NextResponse.json(
      { error: "No puedes compartir un viaje contigo mismo" },
      { status: 400 }
    );
  }

  // Verificar si ya está compartido
  const existingShare = await prisma.tripShare.findUnique({
    where: {
      tripId_userId: {
        tripId,
        userId: userToShare.id,
      },
    },
  });

  if (existingShare) {
    // Actualizar el rol si ya existe
    const updated = await prisma.tripShare.update({
      where: { id: existingShare.id },
      data: { role: role || "VIEWER" },
      include: {
        user: {
          select: { id: true, email: true, name: true },
        },
      },
    });

    return NextResponse.json(updated);
  }

  // Crear el compartido
  const share = await prisma.tripShare.create({
    data: {
      tripId,
      userId: userToShare.id,
      role: role || "VIEWER",
    },
    include: {
      user: {
        select: { id: true, email: true, name: true },
      },
    },
  });

  return NextResponse.json(share, { status: 201 });
}

// Obtener lista de personas con las que está compartido
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id: tripId } = await params;

  // Verificar acceso al viaje
  const trip = await prisma.trip.findFirst({
    where: {
      id: tripId,
      OR: [
        { ownerId: session.user.id },
        { sharedWith: { some: { userId: session.user.id } } },
      ],
    },
    include: {
      owner: {
        select: { id: true, email: true, name: true },
      },
      sharedWith: {
        include: {
          user: {
            select: { id: true, email: true, name: true },
          },
        },
      },
    },
  });

  if (!trip) {
    return NextResponse.json(
      { error: "Viaje no encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    owner: trip.owner,
    sharedWith: trip.sharedWith,
  });
}

// Eliminar compartido
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id: tripId } = await params;
  const body = await request.json().catch(() => null);
  const { userId } = body;

  if (!userId) {
    return NextResponse.json(
      { error: "userId es requerido" },
      { status: 400 }
    );
  }

  // Verificar que el usuario actual es el dueño
  const trip = await prisma.trip.findFirst({
    where: {
      id: tripId,
      ownerId: session.user.id,
    },
  });

  if (!trip) {
    return NextResponse.json(
      { error: "Solo el dueño puede eliminar compartidos" },
      { status: 403 }
    );
  }

  await prisma.tripShare.deleteMany({
    where: {
      tripId,
      userId,
    },
  });

  return NextResponse.json({ success: true });
}
