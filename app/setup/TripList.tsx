"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoadingId(null);
    }
  };

  const deleteTrip = async (id: string) => {
    const confirmed = window.confirm(
      "Eliminar este viaje? Se borraran todos sus dias y elementos."
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
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-zinc-900">Tus viajes</h2>
      <p className="mt-2 text-sm text-zinc-600">
        Selecciona un viaje para abrir su calendario.
      </p>

      {error ? (
        <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="mt-4 flex flex-col gap-3">
        {trips.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-500">
            Todavia no hay viajes creados.
          </div>
        ) : (
          trips.map((trip) => (
            <div
              key={trip.id}
              className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-zinc-900">
                  {trip.name}
                </p>
                <p className="text-xs text-zinc-500">{trip.dates}</p>
                {trip.destinations ? (
                  <p className="text-xs text-zinc-500">
                    Destinos: {trip.destinations}
                  </p>
                ) : null}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => selectTrip(trip.id)}
                  disabled={loadingId === trip.id}
                  className="inline-flex items-center justify-center rounded-2xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loadingId === trip.id ? "Abriendo..." : "Usar este viaje"}
                </button>
                <button
                  type="button"
                  onClick={() => router.push(`/setup?edit=${trip.id}`)}
                  className="inline-flex items-center justify-center rounded-2xl border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-600 transition hover:border-zinc-300"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => deleteTrip(trip.id)}
                  disabled={loadingId === trip.id}
                  className="inline-flex items-center justify-center rounded-2xl border border-rose-200 px-4 py-2 text-xs font-semibold text-rose-600 transition hover:border-rose-300 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
