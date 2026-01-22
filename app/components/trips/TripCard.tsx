"use client";

import { useState } from "react";
import { Card } from "../ui/Card";
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
    <Card variant="hover" padding="md" className="animate-fade-in">
      <div className="mb-4 flex items-start gap-3">
        <div className="w-12 h-12 rounded-[var(--radius-md)] bg-gradient-to-br from-[rgb(var(--color-accent))] to-[rgb(var(--color-accent-hover))] flex items-center justify-center shadow-[var(--shadow-sm)]">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-[rgb(var(--color-text-primary))] mb-2">
            {trip.name}
          </h3>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-[rgb(var(--color-text-secondary))]">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{trip.dates}</span>
            </div>
            {trip.destinations && (
              <div className="flex items-center gap-2 text-xs text-[rgb(var(--color-text-secondary))]">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
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
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>

        <button
          type="button"
          onClick={() => onShare(trip.id)}
          className="btn-secondary text-xs text-[rgb(var(--color-success))] hover:bg-[rgb(var(--color-success))]/5"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </button>

        <button
          type="button"
          onClick={handleDelete}
          disabled={isLoading}
          className="btn-secondary text-xs text-[rgb(var(--color-error))] hover:bg-[rgb(var(--color-error))]/5 disabled:opacity-50"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </Card>
  );
}
