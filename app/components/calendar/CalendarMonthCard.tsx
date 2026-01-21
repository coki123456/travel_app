"use client";

import Link from "next/link";
import { Card } from "../ui/Card";

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
    <Card variant="glass" className="mb-6 animate-fade-in">
      {/* Month Header */}
      <div className="flex items-center justify-between mb-6">
        <button className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xl transition-colors">
          ◀
        </button>

        <h3 className="text-xl font-bold text-gray-900 capitalize">
          {monthLabel}
        </h3>

        <button className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xl transition-colors">
          ▶
        </button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-2 mb-3">
        {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((label) => (
          <div
            key={label}
            className="text-center text-xs font-semibold text-gray-500 py-2"
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

          return (
            <Link
              key={key}
              href={`/day/${key}`}
              className={`aspect-square rounded-xl flex flex-col items-center justify-center text-sm font-medium transition-all relative group ${
                inTripRange
                  ? isToday
                    ? "bg-blue-500 text-white shadow-lg shadow-blue-500/40 scale-105"
                    : isPast
                    ? "bg-gray-100 text-gray-400 hover:bg-gray-200"
                    : day?.summary
                    ? "bg-blue-50 text-blue-700 border-2 border-blue-500 hover:shadow-lg hover:scale-105"
                    : "bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-400 hover:shadow-lg hover:scale-105"
                  : "text-gray-300 cursor-default"
              }`}
            >
              <span className="text-base">{cell.getDate()}</span>
              {day?.summary && (
                <div className={`mt-1 w-1.5 h-1.5 rounded-full ${isToday ? 'bg-white' : 'bg-blue-500'}`} />
              )}
              {isToday && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
              )}
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
