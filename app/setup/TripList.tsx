"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ShareTripModal from "./ShareTripModal";
import TripCard from "../components/trips/TripCard";
import ErrorAlert from "../components/ui/ErrorAlert";

type TripListItem = {
  id: string;
  name: string;
  dates: string;
  destinations: string | null;
};

type TripListProps = {
  trips: TripListItem[];
};

export default function TripList({ trips }: TripListProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);

  const selectTrip = async (id: string) => {
    setError(null);
    try {
      const response = await fetch("/api/trip/active", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(data?.error ?? "No se pudo seleccionar el viaje.");
        return;
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Error al seleccionar viaje:", err);
      setError("No se pudo conectar con el servidor.");
    }
  };

  const deleteTrip = async (id: string) => {
    const confirmed = window.confirm(
      "¿Eliminar este viaje? Se borrarán todos sus días y elementos."
    );
    if (!confirmed) return;

    setError(null);
    try {
      const response = await fetch(`/api/trip/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(data?.error ?? "No se pudo eliminar el viaje.");
        return;
      }

      router.refresh();
    } catch (err) {
      console.error("Error al eliminar viaje:", err);
      setError("No se pudo conectar con el servidor.");
    }
  };

  return (
    <div className="card-elevated p-6 sm:p-7">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="text-3xl">
            🗂️
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900">Tus viajes</h2>
            <p className="text-xs text-gray-600">
              Elige un viaje para abrir el calendario principal.
            </p>
          </div>
        </div>
        {trips.length > 0 ? (
          <span className="rounded-full border border-gray-300 bg-gray-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-600">
            {trips.length} activo(s)
          </span>
        ) : null}
      </div>

      <ErrorAlert error={error} className="mt-4" />

      <div className="mt-5 flex flex-col gap-3">
        {trips.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
            <div className="text-5xl mb-3">📁</div>
            <p className="text-sm text-gray-600">Todavía no hay viajes creados.</p>
          </div>
        ) : (
          trips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              onSelect={selectTrip}
              onEdit={(id) => router.push(`/setup?edit=${id}`)}
              onShare={(id) => {
                setSelectedTripId(id);
                setIsShareModalOpen(true);
              }}
              onDelete={deleteTrip}
            />
          ))
        )}
      </div>

      {selectedTripId && (
        <ShareTripModal
          tripId={selectedTripId}
          isOpen={isShareModalOpen}
          onClose={() => {
            setIsShareModalOpen(false);
            setSelectedTripId(null);
          }}
        />
      )}
    </div>
  );
}
