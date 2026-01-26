import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import SetupForm from "./SetupForm";
import TripList from "./TripList";
import { EmojiIcon } from "../components/ui/EmojiIcon";
import BottomNav from "../components/BottomNav";

export const dynamic = "force-dynamic";

export default async function SetupPage({
  searchParams,
}: {
  searchParams?: Promise<{ edit?: string; create?: string }>;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const trips = await prisma.trip.findMany({
    where: {
      OR: [
        { ownerId: session.user.id },
        { sharedWith: { some: { userId: session.user.id } } },
      ],
    },
    orderBy: { createdAt: "desc" },
  });

  const resolvedSearchParams = await searchParams;
  const editId = resolvedSearchParams?.edit;
  const isCreating = resolvedSearchParams?.create === "true";
  const editingTrip = editId ? trips.find((trip) => trip.id === editId) : null;

  const tripList = trips.map((trip) => ({
    id: trip.id,
    name: trip.name,
    destinations: trip.destinations,
    dates: `${trip.startDate.toLocaleDateString("es-AR")} - ${trip.endDate.toLocaleDateString("es-AR")}`,
  }));

  return (
    <div className="min-h-screen bg-[rgb(var(--color-bg-primary))] pb-20">
      {/* Header compacto */}
      <div className="sticky top-0 z-40 bg-[rgb(var(--color-bg-secondary))] border-b border-[rgb(var(--color-border-light))] shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[rgb(var(--color-accent))] to-[rgb(var(--color-accent-hover))] flex items-center justify-center shadow-sm">
              <EmojiIcon emoji="🗺️" label="Mis viajes" className="text-lg" />
            </div>
            <div className="flex-1">
              <h1 className="text-base sm:text-lg font-semibold text-[rgb(var(--color-text-primary))]">
                {isCreating ? "Crear Viaje" : editingTrip ? "Editar Viaje" : "Mis Viajes"}
              </h1>
              <p className="text-[11px] sm:text-xs text-[rgb(var(--color-text-secondary))]">
                {tripList.length} {tripList.length === 1 ? "viaje" : "viajes"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Mostrar formulario si está creando o editando */}
          {(isCreating || editingTrip) && (
            <div className="animate-fade-in">
              <SetupForm
                initialTrip={
                  editingTrip
                    ? {
                        id: editingTrip.id,
                        name: editingTrip.name,
                        startDate: editingTrip.startDate.toISOString().slice(0, 10),
                        endDate: editingTrip.endDate.toISOString().slice(0, 10),
                        destinations: editingTrip.destinations,
                      }
                    : null
                }
              />
            </div>
          )}

          {/* Lista de viajes */}
          {!isCreating && !editingTrip && (
            <div className="animate-fade-in">
              <TripList trips={tripList} />
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
