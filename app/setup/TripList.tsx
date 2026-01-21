"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ShareTripModal from "./ShareTripModal";

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
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);

  const selectTrip = async (id: string) => {
    setError(null);
    setLoadingId(id);
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
    } finally {
      setLoadingId(null);
    }
  };

  const deleteTrip = async (id: string) => {
    const confirmed = window.confirm(
      "¿Eliminar este viaje? Se borrarán todos sus días y elementos."
    );
    if (!confirmed) return;

    setError(null);
    setLoadingId(id);
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
    } finally {
      setLoadingId(null);
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

      {error ? (
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 animate-in">
          <span className="text-lg">⚠️</span>
          <p className="text-sm text-rose-200">{error}</p>
        </div>
      ) : null}

      <div className="mt-5 flex flex-col gap-3">
        {trips.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
            <div className="text-5xl mb-3">📁</div>
            <p className="text-sm text-gray-600">Todavía no hay viajes creados.</p>
          </div>
        ) : (
          trips.map((trip) => (
            <div
              key={trip.id}
              className="card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300"
            >
              <div className="mb-4 flex items-start gap-3">
                <div className="text-2xl">
                  🌍
                </div>
                <div className="flex-1">
                  <p className="text-base font-bold text-gray-900">
                    {trip.name}
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-gray-600">
                    <span>📅</span>
                    <span>{trip.dates}</span>
                  </div>
                  {trip.destinations ? (
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-600">
                      <span>📍</span>
                      <span>{trip.destinations}</span>
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => selectTrip(trip.id)}
                  disabled={loadingId === trip.id}
                  className="btn-primary text-xs px-4 py-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loadingId === trip.id ? "Abriendo..." : "Usar este viaje"}
                </button>
                <button
                  type="button"
                  onClick={() => router.push(`/setup?edit=${trip.id}`)}
                  className="btn-secondary text-xs px-4 py-2"
                >
                  <span>✏️</span>
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTripId(trip.id);
                    setIsShareModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-200 transition duration-200 hover:border-emerald-500/50 hover:bg-emerald-500/20"
                >
                  <span>🔗</span>
                  Compartir
                </button>
                <button
                  type="button"
                  onClick={() => deleteTrip(trip.id)}
                  disabled={loadingId === trip.id}
                  className="inline-flex items-center gap-1.5 rounded-md border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-200 transition duration-200 hover:border-rose-500/50 hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span>🗑️</span>
                  Eliminar
                </button>
              </div>
            </div>
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
