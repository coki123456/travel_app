import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET: Listar usuarios con acceso al viaje
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id: tripId } = await params;

  try {
    // Verificar que el usuario es el propietario del viaje
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        owner: { select: { id: true, email: true, name: true } },
        sharedWith: {
          include: {
            user: { select: { id: true, email: true, name: true } },
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

    if (trip.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: "Solo el propietario puede ver quién tiene acceso" },
        { status: 403 }
      );
    }

    // Construir lista de usuarios con acceso
    const sharedUsers = [
      {
        id: trip.owner.id,
        email: trip.owner.email,
        name: trip.owner.name,
        role: "OWNER" as const,
      },
      ...trip.sharedWith.map((share) => ({
        id: share.user.id,
        email: share.user.email,
        name: share.user.name,
        role: share.role,
      })),
    ];

    return NextResponse.json({ sharedUsers });
  } catch (error) {
    console.error("Error al obtener usuarios compartidos:", error);
    return NextResponse.json(
      { error: "Error al obtener usuarios" },
      { status: 500 }
    );
  }
}

// POST: Compartir viaje con un usuario
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id: tripId } = await params;
  const { email, role } = await request.json();

  if (!email || !role) {
    return NextResponse.json(
      { error: "Email y rol son requeridos" },
      { status: 400 }
    );
  }

  if (role !== "EDITOR" && role !== "VIEWER") {
    return NextResponse.json({ error: "Rol inválido" }, { status: 400 });
  }

  try {
    // Verificar que el usuario es el propietario del viaje
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (!trip) {
      return NextResponse.json(
        { error: "Viaje no encontrado" },
        { status: 404 }
      );
    }

    if (trip.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: "Solo el propietario puede compartir el viaje" },
        { status: 403 }
      );
    }

    // Buscar el usuario a compartir
    const userToShare = await prisma.user.findUnique({
      where: { email },
    });

    if (!userToShare) {
      return NextResponse.json(
        { error: "Usuario no encontrado con ese email" },
        { status: 404 }
      );
    }

    if (userToShare.id === session.user.id) {
      return NextResponse.json(
        { error: "No puedes compartir un viaje contigo mismo" },
        { status: 400 }
      );
    }

    // Crear o actualizar el compartido
    const share = await prisma.tripShare.upsert({
      where: {
        tripId_userId: {
          tripId,
          userId: userToShare.id,
        },
      },
      update: {
        role,
      },
      create: {
        tripId,
        userId: userToShare.id,
        role,
      },
    });

    return NextResponse.json({
      message: "Viaje compartido exitosamente",
      share,
    });
  } catch (error) {
    console.error("Error al compartir viaje:", error);
    return NextResponse.json(
      { error: "Error al compartir viaje" },
      { status: 500 }
    );
  }
}

// DELETE: Remover acceso de un usuario
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id: tripId } = await params;
  const { userId } = await request.json();

  if (!userId) {
    return NextResponse.json(
      { error: "userId es requerido" },
      { status: 400 }
    );
  }

  try {
    // Verificar que el usuario es el propietario del viaje
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (!trip) {
      return NextResponse.json(
        { error: "Viaje no encontrado" },
        { status: 404 }
      );
    }

    if (trip.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: "Solo el propietario puede remover acceso" },
        { status: 403 }
      );
    }

    // Eliminar el compartido
    await prisma.tripShare.delete({
      where: {
        tripId_userId: {
          tripId,
          userId,
        },
      },
    });

    return NextResponse.json({ message: "Acceso removido exitosamente" });
  } catch (error) {
    console.error("Error al remover acceso:", error);
    return NextResponse.json(
      { error: "Error al remover acceso" },
      { status: 500 }
    );
  }
}
