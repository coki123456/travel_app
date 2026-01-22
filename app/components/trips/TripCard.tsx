"use client";

import { useState } from "react";
import { Card } from "../ui/Card";
import LoadingButton from "../ui/LoadingButton";
import { Icon } from "../ui/Icon";

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
    <Card variant="hover" padding="md" className="animate-fade-in">
      <div className="mb-4 flex items-start gap-3">
        <div className="w-12 h-12 rounded-[var(--radius-md)] bg-gradient-to-br from-[rgb(var(--color-accent))] to-[rgb(var(--color-accent-hover))] flex items-center justify-center shadow-[var(--shadow-sm)]">
          <Icon name="plane" label="Viaje" className="w-6 h-6 text-white" strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-[rgb(var(--color-text-primary))] mb-2">
            {trip.name}
          </h3>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-[rgb(var(--color-text-secondary))]">
              <Icon name="calendar" label="Fechas" className="w-4 h-4" strokeWidth={2} />
              <span>{trip.dates}</span>
            </div>
            {trip.destinations && (
              <div className="flex items-center gap-2 text-xs text-[rgb(var(--color-text-secondary))]">
                <Icon name="map-pin" label="Destinos" className="w-4 h-4" strokeWidth={2} />
                <span>{trip.destinations}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <LoadingButton
          onClick={handleSelect}
          isLoading={isLoading}
          loadingText="Abriendo..."
          variant="primary"
          className="text-xs flex-1"
        >
          Usar viaje
        </LoadingButton>

        <button
          type="button"
          onClick={() => onEdit(trip.id)}
          className="btn-secondary text-xs"
        >
          <Icon name="edit" label="Editar" className="w-4 h-4" strokeWidth={2} />
        </button>

        <button
          type="button"
          onClick={() => onShare(trip.id)}
          className="btn-secondary text-xs text-[rgb(var(--color-success))] hover:bg-[rgb(var(--color-success))]/5"
        >
          <Icon name="share" label="Compartir" className="w-4 h-4" strokeWidth={2} />
        </button>

        <button
          type="button"
          onClick={handleDelete}
          disabled={isLoading}
          className="btn-secondary text-xs text-[rgb(var(--color-error))] hover:bg-[rgb(var(--color-error))]/5 disabled:opacity-50"
        >
          <Icon name="trash" label="Eliminar" className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>
    </Card>
  );
}
