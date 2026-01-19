import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const MIME_EXTENSIONS: Record<string, string> = {
  "application/pdf": ".pdf",
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

const parseDate = (value: unknown) => {
  if (typeof value !== "string") return null;
  const base = value.split("T")[0];
  const match = base.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (!year || !month || !day) return null;
  const date = new Date(year, month - 1, day, 0, 0, 0);
  if (
    Number.isNaN(date.valueOf()) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
};

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const activeTripId = cookieStore.get("activeTripId")?.value;
  if (!activeTripId) {
    return NextResponse.json(
      { error: "Selecciona un viaje activo." },
      { status: 400 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const dateValue = formData.get("date");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "El archivo es obligatorio." },
      { status: 400 }
    );
  }

  const date = parseDate(dateValue);
  if (!date) {
    return NextResponse.json(
      { error: "La fecha es obligatoria con formato YYYY-MM-DD." },
      { status: 400 }
    );
  }

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Tipo de archivo no permitido." },
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
    update: {},
    create: {
      date,
      tripId: trip.id,
    },
  });

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const extension =
    MIME_EXTENSIONS[file.type] || path.extname(file.name) || "";
  const fileName = `${randomUUID()}${extension}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  const filePath = path.join(uploadDir, fileName);

  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(filePath, buffer);

  const attachment = await prisma.attachment.create({
    data: {
      dayId: day.id,
      fileName: file.name,
      mimeType: file.type,
      sizeBytes: buffer.length,
      path: `/uploads/${fileName}`,
    },
  });

  return NextResponse.json(attachment);
}
