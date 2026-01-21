"use client";

import { useRouter } from "next/navigation";

type Trip = {
  id: string;
  name: string;
};

type Props = {
  trips: Trip[];
  activeTripId: string | null;
};

export default function TripSelector({ trips, activeTripId }: Props) {
  const router = useRouter();

  const handleChange = async (tripId: string) => {
    try {
      const response = await fetch("/api/trip/active", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: tripId }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        console.error("Error al cambiar viaje:", data?.error ?? "Error desconocido");
        return;
      }

      router.refresh();
    } catch (error) {
      console.error("Error al cambiar viaje:", error);
    }
  };

  if (trips.length <= 1) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 rounded-md border border-slate-600 bg-slate-800/70 px-3 py-2">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
        <span>🔄</span>
        <span>Cambiar</span>
      </div>
      <select
        value={activeTripId ?? ""}
        onChange={(e) => handleChange(e.target.value)}
        className="select text-sm bg-slate-900/70"
      >
        {trips.map((trip) => (
          <option key={trip.id} value={trip.id}>
            {trip.name}
          </option>
        ))}
      </select>
    </div>
  );
}
