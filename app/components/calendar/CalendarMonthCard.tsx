"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle } from "../ui/Card";
import { EmojiIcon } from "../ui/EmojiIcon";

type DaySummary = {
  id: string;
  date: Date;
  city: string | null;
  summary: string | null;
};

interface CalendarMonthCardProps {
  monthDays: Date[];
  dayMap: Map<string, DaySummary>;
  tripStartDate: Date;
  tripEndDate: Date;
  today: Date;
}

const formatDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const normalizeToDay = (value: Date) =>
  new Date(value.getFullYear(), value.getMonth(), value.getDate(), 0, 0, 0);

const buildMonthMatrix = (days: Date[]) => {
  if (days.length === 0) return [];

  const first = days[0];
  const year = first.getFullYear();
  const month = first.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const lastOfMonth = new Date(year, month + 1, 0);
  const totalDays = lastOfMonth.getDate();
  const offset = (firstOfMonth.getDay() + 6) % 7; // Lunes = 0

  const cells: Array<Date | null> = [];
  for (let i = 0; i < offset; i += 1) {
    cells.push(null);
  }
  for (let day = 1; day <= totalDays; day += 1) {
    cells.push(new Date(year, month, day, 12, 0, 0));
  }

  const rows: Array<Array<Date | null>> = [];
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7));
  }

  return rows;
};

export default function CalendarMonthCard({
  monthDays,
  dayMap,
  tripStartDate,
  tripEndDate,
  today,
}: CalendarMonthCardProps) {
  const reference = monthDays[0];
  const monthLabel = reference.toLocaleDateString("es-AR", {
    month: "long",
    year: "numeric",
  });
  const matrix = buildMonthMatrix(monthDays);

  return (
    <Card variant="default" padding="lg" className="overflow-hidden">
      {/* Month Header with gradient accent */}
      <CardHeader className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[rgb(var(--color-accent))]/5 via-transparent to-[rgb(var(--color-accent))]/5 pointer-events-none" />
        <div className="flex items-center justify-between relative">
          <button
            className="btn-ghost w-10 h-10 p-0 hover:scale-110 transition-transform duration-200"
            aria-label="Mes anterior"
          >
            <EmojiIcon emoji="←" label="Mes anterior" className="text-lg" />
          </button>

          <CardTitle as="h2" className="text-xl capitalize bg-gradient-to-r from-[rgb(var(--color-text-primary))] to-[rgb(var(--color-accent))] bg-clip-text text-transparent font-bold">
            {monthLabel}
          </CardTitle>

          <button
            className="btn-ghost w-10 h-10 p-0 hover:scale-110 transition-transform duration-200"
            aria-label="Mes siguiente"
          >
            <EmojiIcon emoji="→" label="Mes siguiente" className="text-lg" />
          </button>
        </div>
      </CardHeader>

      {/* Day Headers with enhanced styling */}
      <div className="grid grid-cols-7 gap-2 mb-4 px-1">
        {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((label, idx) => (
          <div
            key={label}
            className="text-center text-xs font-bold text-[rgb(var(--color-text-tertiary))] uppercase tracking-wider py-2 rounded-lg bg-[rgb(var(--color-bg-tertiary))]/30"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            {label}
          </div>
        ))}
      </div>

      {/* Calendar Grid with enhanced cells */}
      <div className="grid grid-cols-7 gap-2.5">
        {matrix.flat().map((cell, cellIndex) => {
          if (!cell) {
            return (
              <div
                key={`empty-${cellIndex}`}
                className="aspect-square"
              />
            );
          }

          const key = formatDateKey(cell);
          const day = dayMap.get(key);
          const inTripRange = cell >= tripStartDate && cell <= tripEndDate;
          const cellDay = normalizeToDay(cell);
          const isPast = cellDay < today;
          const isToday = cellDay.getTime() === today.getTime();

          if (!inTripRange) {
            return (
              <div
                key={key}
                className="aspect-square rounded-xl flex items-center justify-center text-sm text-[rgb(var(--color-text-tertiary))]/30 bg-[rgb(var(--color-bg-tertiary))]/10"
              >
                <span>{cell.getDate()}</span>
              </div>
            );
          }

          if (!day && !isToday) {
            return <div key={key} className="aspect-square" />;
          }

          return (
            <Link
              key={key}
              href={`/day/${key}`}
              className={`aspect-square rounded-xl flex flex-col items-center justify-center text-sm font-semibold transition-all duration-300 relative group overflow-hidden ${
                isToday
                  ? "bg-gradient-to-br from-[rgb(var(--color-accent))] to-[rgb(var(--color-accent-hover))] text-white shadow-lg shadow-[rgb(var(--color-accent))]/30 scale-105 ring-2 ring-[rgb(var(--color-accent))]/50 ring-offset-2 ring-offset-[rgb(var(--color-bg-primary))]"
                  : isPast
                  ? "bg-[rgb(var(--color-bg-tertiary))]/50 text-[rgb(var(--color-text-tertiary))] hover:bg-[rgb(var(--color-bg-tertiary))] hover:scale-105 hover:shadow-md"
                  : day?.summary
                  ? "bg-gradient-to-br from-[rgb(var(--color-accent-light))] to-[rgb(var(--color-accent-light))]/70 text-[rgb(var(--color-accent))] border-2 border-[rgb(var(--color-accent))]/40 hover:border-[rgb(var(--color-accent))] hover:shadow-lg hover:shadow-[rgb(var(--color-accent))]/20 hover:scale-105"
                  : "bg-[rgb(var(--color-bg-secondary))] border-2 border-[rgb(var(--color-border-light))] text-[rgb(var(--color-text-primary))] hover:border-[rgb(var(--color-accent))]/60 hover:bg-[rgb(var(--color-bg-tertiary))]/30 hover:scale-105 hover:shadow-md"
              }`}
            >
              {/* Subtle shine effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <span className={`relative z-10 ${isToday ? "font-bold text-lg" : ""}`}>
                {cell.getDate()}
              </span>

              {/* Enhanced indicator for days with summary */}
              {day?.summary && !isToday && (
                <div className="mt-1.5 flex gap-0.5 relative z-10">
                  <div className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--color-accent))] animate-pulse" />
                </div>
              )}

              {/* Animated today indicator */}
              {isToday && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-[rgb(var(--color-error))] rounded-full border-2 border-white shadow-lg animate-pulse" />
              )}

              {/* Enhanced city tooltip */}
              {day?.city && (
                <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none scale-90 group-hover:scale-100">
                  <div className="badge badge-accent text-xs whitespace-nowrap shadow-lg backdrop-blur-sm">
                    📍 {day.city}
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-[rgb(var(--color-accent))] rotate-45" />
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
