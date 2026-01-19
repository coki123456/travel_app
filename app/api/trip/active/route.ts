import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const id = typeof body?.id === "string" ? body.id : null;

  if (!id) {
    return NextResponse.json(
      { error: "El id del viaje es obligatorio." },
      { status: 400 }
    );
  }

  const trip = await prisma.trip.findUnique({ where: { id } });
  if (!trip) {
    return NextResponse.json(
      { error: "No existe el viaje seleccionado." },
      { status: 404 }
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("activeTripId", id, { path: "/" });
  return response;
}
