"use client";

import Link from "next/link";
import { Card } from "../ui/Card";

interface ActiveTripCardProps {
  activeTripName: string;
}

export default function ActiveTripCard({ activeTripName }: ActiveTripCardProps) {
  return (
    <Card variant="flat" padding="md" className="border border-[rgb(var(--color-border-light))]">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-[var(--radius-md)] bg-gradient-to-br from-[rgb(var(--color-accent))] to-[rgb(var(--color-accent-hover))] flex items-center justify-center shadow-[var(--shadow-sm)]">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
          </svg>
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
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
        Cambiar viaje
      </Link>
    </Card>
  );
}
