"use client";

import { useState } from "react";
import LoadingButton from "../ui/LoadingButton";

export interface TripCardProps {
  trip: {
    id: string;
    name: string;
    dates: string;
    destinations: string | null;
  };
  onSelect: (id: string) => Promise<void>;
  onEdit: (id: string) => void;
  onShare: (id: string) => void;
  onDelete: (id: string) => Promise<void>;
}

/**
 * Componente reutilizable para mostrar una tarjeta de viaje
 */
export default function TripCard({
  trip,
  onSelect,
  onEdit,
  onShare,
  onDelete,
}: TripCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSelect = async () => {
    setIsLoading(true);
    try {
      await onSelect(trip.id);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "¿Eliminar este viaje? Se borrarán todos sus días y elementos."
    );
    if (!confirmed) return;

    setIsLoading(true);
    try {
      await onDelete(trip.id);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300">
      <div className="mb-4 flex items-start gap-3">
        <div className="text-2xl">🌍</div>
        <div className="flex-1">
          <p className="text-base font-bold text-gray-900">{trip.name}</p>
          <div className="mt-1 flex items-center gap-2 text-xs text-gray-600">
            <span>📅</span>
            <span>{trip.dates}</span>
          </div>
          {trip.destinations && (
            <div className="mt-1 flex items-center gap-2 text-xs text-gray-600">
              <span>📍</span>
              <span>{trip.destinations}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <LoadingButton
          onClick={handleSelect}
          isLoading={isLoading}
          loadingText="Abriendo..."
          variant="primary"
          className="text-xs px-4 py-2"
        >
          Usar este viaje
        </LoadingButton>

        <button
          type="button"
          onClick={() => onEdit(trip.id)}
          className="btn-secondary text-xs px-4 py-2"
        >
          <span>✏️</span>
          Editar
        </button>

        <button
          type="button"
          onClick={() => onShare(trip.id)}
          className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-200 transition duration-200 hover:border-emerald-500/50 hover:bg-emerald-500/20"
        >
          <span>🔗</span>
          Compartir
        </button>

        <button
          type="button"
          onClick={handleDelete}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 rounded-md border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-200 transition duration-200 hover:border-rose-500/50 hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span>🗑️</span>
          Eliminar
        </button>
      </div>
    </div>
  );
}
