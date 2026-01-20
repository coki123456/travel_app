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
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
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
