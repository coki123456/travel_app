import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function HomePage() {
  const trip = await prisma.trip.findFirst();

  if (!trip) {
    redirect("/setup");
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-12 text-zinc-900">
      <div className="mx-auto w-full max-w-4xl rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Calendario (en construcción)
        </h1>
        <p className="mt-3 text-sm text-zinc-600">
          Acá vamos a renderizar el calendario y el resumen por día.
        </p>
      </div>
    </div>
  );
}
