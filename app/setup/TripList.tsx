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
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg shadow-black/30">
      <h2 className="text-lg font-semibold text-slate-100">Tus viajes</h2>
      <p className="mt-2 text-sm text-slate-300">
        Selecciona un viaje para abrir su calendario.
      </p>

      {error ? (
        <div className="mt-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      <div className="mt-4 flex flex-col gap-3">
        {trips.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-4 text-sm text-slate-400">
            Todavia no hay viajes creados.
          </div>
        ) : (
          trips.map((trip) => (
            <div
              key={trip.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-black/20"
            >
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-slate-100">
                  {trip.name}
                </p>
                <p className="text-xs text-slate-400">{trip.dates}</p>
                {trip.destinations ? (
                  <p className="text-xs text-slate-400">
                    Destinos: {trip.destinations}
                  </p>
                ) : null}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => selectTrip(trip.id)}
                  disabled={loadingId === trip.id}
                  className="inline-flex items-center justify-center rounded-2xl bg-cyan-400 px-4 py-2 text-xs font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loadingId === trip.id ? "Abriendo..." : "Usar este viaje"}
                </button>
                <button
                  type="button"
                  onClick={() => router.push(`/setup?edit=${trip.id}`)}
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-slate-500"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => deleteTrip(trip.id)}
                  disabled={loadingId === trip.id}
                  className="inline-flex items-center justify-center rounded-2xl border border-rose-500/40 px-4 py-2 text-xs font-semibold text-rose-200 transition hover:border-rose-400 disabled:cursor-not-allowed disabled:opacity-70"
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
