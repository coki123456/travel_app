"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type TripOption = {
  id: string;
  name: string;
};

type TripSelectorProps = {
  trips: TripOption[];
  activeTripId: string | null;
};

export default function TripSelector({
  trips,
  activeTripId,
}: TripSelectorProps) {
  const router = useRouter();
  const [selected, setSelected] = useState(activeTripId ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onChange = async (value: string) => {
    setSelected(value);
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/trip/active", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: value }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(data?.error ?? "No se pudo cambiar el viaje.");
        return;
      }

      router.refresh();
    } catch (err) {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        Viaje activo
      </label>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <select
          value={selected}
          onChange={(event) => onChange(event.target.value)}
          disabled={isSubmitting}
          className="h-10 rounded-2xl border border-slate-700 bg-slate-900/70 px-4 text-sm text-slate-100 outline-none transition focus:border-cyan-400/70 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {trips.map((trip) => (
            <option key={trip.id} value={trip.id}>
              {trip.name}
            </option>
          ))}
        </select>
        {isSubmitting ? (
          <span className="text-xs text-slate-400">Cambiando...</span>
        ) : null}
      </div>
      {error ? <span className="text-xs text-rose-200">{error}</span> : null}
    </div>
  );
}
