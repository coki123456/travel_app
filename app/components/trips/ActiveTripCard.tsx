"use client";

import Link from "next/link";
import { Card } from "../ui/Card";
import { Icon } from "../ui/Icon";

interface ActiveTripCardProps {
  activeTripName: string;
}

export default function ActiveTripCard({ activeTripName }: ActiveTripCardProps) {
  return (
    <Card variant="flat" padding="md" className="border border-[rgb(var(--color-border-light))]">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-[var(--radius-md)] bg-gradient-to-br from-[rgb(var(--color-accent))] to-[rgb(var(--color-accent-hover))] flex items-center justify-center shadow-[var(--shadow-sm)]">
          <Icon name="map-pin" label="Viaje activo" className="w-5 h-5 text-white" strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-[rgb(var(--color-text-tertiary))] uppercase tracking-wider mb-1">
            Viaje Activo
          </div>
          <div className="text-sm font-semibold text-[rgb(var(--color-text-primary))] truncate">
            {activeTripName}
          </div>
        </div>
      </div>

      <Link
        href="/setup"
        className="btn-ghost w-full justify-center text-xs"
      >
        <Icon name="refresh" label="Cambiar viaje" className="w-4 h-4" strokeWidth={2} />
        Cambiar viaje
      </Link>
    </Card>
  );
}
