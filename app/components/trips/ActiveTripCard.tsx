"use client";

import Link from "next/link";
import { Card } from "../ui/Card";
import { EmojiIcon } from "../ui/EmojiIcon";

interface ActiveTripCardProps {
  activeTripName: string;
}

export default function ActiveTripCard({ activeTripName }: ActiveTripCardProps) {
  return (
    <div className="p-2.5 rounded-lg bg-[rgb(var(--color-bg-tertiary))] border border-[rgb(var(--color-border-light))]">
      <div className="flex items-center gap-2 mb-2">
        <EmojiIcon emoji="📍" label="Viaje activo" className="text-sm" />
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-medium text-[rgb(var(--color-text-tertiary))] uppercase tracking-wide">
            Viaje Activo
          </div>
          <div className="text-xs font-semibold text-[rgb(var(--color-text-primary))] truncate">
            {activeTripName}
          </div>
        </div>
      </div>

      <Link
        href="/setup"
        className="flex items-center justify-center gap-1.5 w-full px-2 py-1.5 rounded-md text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-bg-secondary))] transition-colors text-xs"
      >
        <EmojiIcon emoji="🔄" label="Cambiar viaje" className="text-xs" />
        <span>Cambiar</span>
      </Link>
    </div>
  );
}
