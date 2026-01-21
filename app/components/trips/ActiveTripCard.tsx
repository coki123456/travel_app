"use client";

import Link from "next/link";
import { Card } from "../ui/Card";

interface ActiveTripCardProps {
  activeTripName: string;
}

export default function ActiveTripCard({ activeTripName }: ActiveTripCardProps) {
  return (
    <Card variant="elevated" padding="md" className="mt-6">
      <button className="w-full flex items-center justify-between text-left">
        <div className="flex-1 min-w-0">
          <div className="text-xs text-gray-400 mb-1">Viaje Activo</div>
          <div className="text-sm font-semibold text-white truncate">
            {activeTripName}
          </div>
        </div>
        <svg
          className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div className="mt-3 pt-3 border-t border-white/10">
        <Link
          href="/setup"
          className="text-xs text-gray-400 hover:text-white transition-colors"
        >
          Cambiar / Administrar
        </Link>
      </div>
    </Card>
  );
}
