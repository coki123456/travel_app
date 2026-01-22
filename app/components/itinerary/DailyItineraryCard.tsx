"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/Card";

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
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle as="h3" className="text-base">
              Itinerario del Día
            </CardTitle>
            <CardDescription className="capitalize text-xs mt-0.5">
              {formatLongDate(date)}
            </CardDescription>
          </div>
        </div>
        {day?.city && (
          <div className="badge badge-accent mt-3">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {day.city}
          </div>
        )}
      </CardHeader>

      {/* Day Content */}
      <CardContent className="flex-1 overflow-y-auto p-6">
        {day?.summary ? (
          <div className="space-y-4">
            <div className="p-4 rounded-[var(--radius-md)] bg-[rgb(var(--color-accent-light))] border border-[rgb(var(--color-accent))]/20">
              <p className="text-sm font-medium text-[rgb(var(--color-accent))]">
                {day.summary}
              </p>
            </div>

            {/* Empty state for activities */}
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-[rgb(var(--color-bg-tertiary))] flex items-center justify-center">
                <svg className="w-8 h-8 text-[rgb(var(--color-text-tertiary))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <p className="text-sm text-[rgb(var(--color-text-secondary))] mb-1">
                No hay actividades planificadas
              </p>
              <p className="text-xs text-[rgb(var(--color-text-tertiary))]">
                Hacé clic en el botón abajo para agregar
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[rgb(var(--color-bg-tertiary))] flex items-center justify-center">
              <svg className="w-10 h-10 text-[rgb(var(--color-text-tertiary))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <p className="text-sm text-[rgb(var(--color-text-secondary))] mb-1">
              Este día aún no tiene información
            </p>
            <p className="text-xs text-[rgb(var(--color-text-tertiary))]">
              Empezá a planificar tu itinerario
            </p>
          </div>
        )}
      </CardContent>

      {/* Action Button */}
      <CardFooter className="p-6 border-t border-[rgb(var(--color-border-light))]">
        <Link href={`/day/${dateKey}`} className="w-full btn-primary justify-center">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          {day?.summary ? "Editar día" : "Planificar día"}
        </Link>
      </CardFooter>
    </Card>
  );
}
