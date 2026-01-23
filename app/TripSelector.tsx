"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { EmojiIcon } from "./components/ui/EmojiIcon";
import { useToast, ToastContainer } from "./components/ui/Toast";

type Trip = {
  id: string;
  name: string;
};

type Props = {
  trips: Trip[];
  currentTripId?: string;
};

export default function TripSelector({ trips, currentTripId }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { toasts, success, error: showError, removeToast } = useToast();

  const handleChange = async (tripId: string) => {
    if (isLoading || tripId === currentTripId) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/trip/active", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: tripId }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        showError(data?.error ?? "Error al cambiar de viaje");
        return;
      }

      success("Viaje cambiado correctamente");
      router.refresh();
    } catch (error) {
      console.error("Error al cambiar viaje:", error);
      showError("Error de conexión. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (trips.length <= 1) {
    return null;
  }

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <div className="flex items-center gap-2 rounded-lg border border-[rgb(var(--color-border-medium))] bg-[rgb(var(--color-bg-secondary))] px-3 py-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-[rgb(var(--color-text-secondary))]">
          {isLoading ? (
            <span className="animate-spin">⏳</span>
          ) : (
            <EmojiIcon emoji="🔄" label="Cambiar viaje" className="text-sm" />
          )}
        </div>
        <select
          value={currentTripId ?? ""}
          onChange={(e) => handleChange(e.target.value)}
          disabled={isLoading}
          className="input text-sm py-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {trips.map((trip) => (
            <option key={trip.id} value={trip.id}>
              {trip.name}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
