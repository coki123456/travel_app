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
    <Card variant="default" padding="lg">
      {/* Month Header */}
      <CardHeader>
        <div className="flex items-center justify-between">
          <button
            className="btn-ghost w-9 h-9 p-0"
            aria-label="Mes anterior"
          >
            <EmojiIcon emoji="←" label="Mes anterior" className="text-base" />
          </button>

          <CardTitle as="h2" className="text-xl capitalize">
            {monthLabel}
          </CardTitle>

          <button
            className="btn-ghost w-9 h-9 p-0"
            aria-label="Mes siguiente"
          >
            <EmojiIcon emoji="→" label="Mes siguiente" className="text-base" />
          </button>
        </div>
      </CardHeader>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-2 mb-3">
        {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((label) => (
          <div
            key={label}
            className="text-center text-xs font-semibold text-[rgb(var(--color-text-tertiary))] uppercase tracking-wider py-2"
          >
            {label}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
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
                className="aspect-square rounded-[var(--radius-md)] flex items-center justify-center text-sm text-[rgb(var(--color-text-tertiary))]/40"
              >
                <span>{cell.getDate()}</span>
              </div>
            );
          }

          return (
            <Link
              key={key}
              href={`/day/${key}`}
              className={`aspect-square rounded-[var(--radius-md)] flex flex-col items-center justify-center text-sm font-medium transition-all duration-[var(--transition-base)] relative hover-lift group ${
                isToday
                  ? "bg-[rgb(var(--color-accent))] text-white shadow-[var(--shadow-lg)] scale-[1.02]"
                  : isPast
                  ? "bg-[rgb(var(--color-bg-tertiary))] text-[rgb(var(--color-text-tertiary))] hover:bg-[rgb(var(--color-border-medium))]"
                  : day?.summary
                  ? "bg-[rgb(var(--color-accent-light))] text-[rgb(var(--color-accent))] border-2 border-[rgb(var(--color-accent))]/30"
                  : "bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border-light))] text-[rgb(var(--color-text-primary))] hover:border-[rgb(var(--color-accent))]/50"
              }`}
            >
              <span className={isToday ? "font-semibold" : ""}>{cell.getDate()}</span>

              {/* Indicator dot for days with summary */}
              {day?.summary && !isToday && (
                <div className="mt-1 w-1 h-1 rounded-full bg-[rgb(var(--color-accent))]" />
              )}

              {/* Today indicator */}
              {isToday && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-[rgb(var(--color-error))] rounded-full border-2 border-[rgb(var(--color-bg-secondary))]" />
              )}

              {/* City tooltip on hover */}
              {day?.city && (
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="badge badge-accent text-xs whitespace-nowrap">
                    {day.city}
                  </div>
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
