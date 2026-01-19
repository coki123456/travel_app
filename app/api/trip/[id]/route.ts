import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
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
