"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/Card";
import { EmojiIcon } from "../ui/EmojiIcon";

type DaySummary = {
  id: string;
  date: Date;
  city: string | null;
  summary: string | null;
};

interface DailyItineraryCardProps {
  day: DaySummary | undefined;
  date: Date;
  dateKey: string;
}

const formatLongDate = (date: Date) =>
  date.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

export default function DailyItineraryCard({
  day,
  date,
  dateKey,
}: DailyItineraryCardProps) {
  return (
    <Card variant="default" padding="none" className="flex flex-col overflow-hidden">
      {/* Panel Header */}
      <CardHeader className="p-6 border-b border-[rgb(var(--color-border-light))]">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-[var(--radius-md)] bg-gradient-to-br from-[rgb(var(--color-accent))] to-[rgb(var(--color-accent-hover))] flex items-center justify-center shadow-[var(--shadow-sm)]">
            <EmojiIcon emoji="📋" label="Itinerario del día" className="text-lg" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle as="h3" className="text-base">
              Itinerario del día
            </CardTitle>
            <CardDescription className="capitalize text-xs mt-0.5">
              {formatLongDate(date)}
            </CardDescription>
          </div>
        </div>
        {day?.city && (
          <div className="badge badge-accent mt-3">
            <EmojiIcon emoji="📍" label="Ciudad" className="text-sm" />
            {day.city}
          </div>
        )}
      </CardHeader>

      {/* Day Content */}
      <CardContent className="flex-1 overflow-y-auto p-6">
        {day?.summary ? (
          <div className="space-y-4">
            <div className="p-4 rounded-[var(--radius-md)] bg-[rgb(var(--color-accent-light))] border border-[rgb(var(--color-accent))]/20">
              <p className="text-sm font-medium text-[rgb(var(--color-accent))]">{day.summary}</p>
            </div>

            {/* Empty state for activities */}
            <div className="text-center py-6">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-[rgb(var(--color-bg-tertiary))] flex items-center justify-center">
                <EmojiIcon emoji="➕" label="Agregar actividad" className="text-lg opacity-60" />
              </div>
              <p className="text-sm text-[rgb(var(--color-text-secondary))] mb-1">No hay actividades planificadas</p>
              <p className="text-xs text-[rgb(var(--color-text-tertiary))]">Hacé clic en el botón abajo para agregar</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[rgb(var(--color-bg-tertiary))] flex items-center justify-center">
              <EmojiIcon emoji="📄" label="Sin información" className="text-lg opacity-60" />
            </div>
            <p className="text-sm text-[rgb(var(--color-text-secondary))] mb-1">Este día aún no tiene información</p>
            <p className="text-xs text-[rgb(var(--color-text-tertiary))]">Empezá a planificar tu itinerario</p>
          </div>
        )}
      </CardContent>

      {/* Action Button */}
      <CardFooter className="p-6 border-t border-[rgb(var(--color-border-light))]">
        <Link href={`/day/${dateKey}`} className="w-full btn-primary justify-center">
          <EmojiIcon emoji="✏️" label="Editar día" className="text-base" />
          {day?.summary ? "Editar día" : "Planificar día"}
        </Link>
      </CardFooter>
    </Card>
  );
}
