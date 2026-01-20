import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

export const dynamic = "force-dynamic";

type DaySummary = {
  id: string;
  date: Date;
  city: string | null;
  summary: string | null;
};

const formatDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatLongDate = (date: Date) =>
  date.toLocaleDateString("es-AR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });

const normalizeToNoon = (value: Date) =>
  new Date(value.getFullYear(), value.getMonth(), value.getDate(), 12, 0, 0);

const normalizeToDay = (value: Date) =>
  new Date(value.getFullYear(), value.getMonth(), value.getDate(), 0, 0, 0);

const buildDaysInRange = (start: Date, end: Date) => {
  const result: Date[] = [];
  const cursor = normalizeToNoon(start);
  const limit = normalizeToNoon(end);

  while (cursor <= limit) {
    result.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return result;
};

const buildMonthMatrix = (days: Date[]) => {
  if (days.length === 0) return [];

  const first = days[0];
  const year = first.getFullYear();
  const month = first.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const lastOfMonth = new Date(year, month + 1, 0);
  const totalDays = lastOfMonth.getDate();
  const offset = firstOfMonth.getDay();

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

export default async function HomePage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const cookieStore = await cookies();
  const activeTripId = cookieStore.get("activeTripId")?.value;
  const [trip, trips] = await Promise.all([
    activeTripId
      ? prisma.trip.findFirst({
          where: {
            id: activeTripId,
            OR: [
              { ownerId: session.user.id },
              { sharedWith: { some: { userId: session.user.id } } },
            ],
          },
        })
      : null,
    prisma.trip.findMany({
      where: {
        OR: [
          { ownerId: session.user.id },
          { sharedWith: { some: { userId: session.user.id } } },
        ],
      },
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!trip) {
    redirect("/setup");
  }

  const days = await prisma.day.findMany({
    where: {
      date: {
        gte: trip.startDate,
        lte: trip.endDate,
      },
    },
    orderBy: { date: "asc" },
  });

  const dayMap = new Map<string, DaySummary>(
    days.map((day) => [formatDateKey(day.date), day])
  );

  const allDays = buildDaysInRange(trip.startDate, trip.endDate);
  const today = normalizeToDay(new Date());
  const months = Array.from(
    allDays.reduce((acc, day) => {
      const key = `${day.getFullYear()}-${day.getMonth()}`;
      const bucket = acc.get(key) ?? [];
      bucket.push(day);
      acc.set(key, bucket);
      return acc;
    }, new Map<string, Date[]>())
  ).map(([, value]) => value);

  return (
    <div className="flex h-screen bg-[var(--background)]">
      {/* Sidebar */}
      <Sidebar
        activeTripName={trip.name}
        userName={session.user.name}
        userEmail={session.user.email}
      />

      {/* Main Content */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* Header */}
        <Header />

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="flex h-full">
            {/* Calendar Section */}
            <div className="flex-1 p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                  {trip.name}
                </h2>
                <p className="text-sm text-[var(--text-secondary)]">
                  {trip.startDate.toLocaleDateString("es-AR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  -{" "}
                  {trip.endDate.toLocaleDateString("es-AR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>

              {/* Calendar Grid */}
              <div className="space-y-8">
                {months.map((monthDays, index) => {
                  const reference = monthDays[0];
                  const monthLabel = reference.toLocaleDateString("es-AR", {
                    month: "long",
                    year: "numeric",
                  });
                  const matrix = buildMonthMatrix(monthDays);

                  return (
                    <div
                      key={`${reference.getFullYear()}-${reference.getMonth()}-${index}`}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 capitalize mb-4">
                        {monthLabel}
                      </h3>
                      <div className="grid grid-cols-7 gap-2 mb-2">
                        {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map(
                          (label) => (
                            <div
                              key={label}
                              className="text-center text-xs font-medium text-gray-500 py-2"
                            >
                              {label}
                            </div>
                          )
                        )}
                      </div>
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
                          const inTripRange =
                            cell >= trip.startDate && cell <= trip.endDate;
                          const cellDay = normalizeToDay(cell);
                          const isPast = cellDay < today;
                          const isToday = cellDay.getTime() === today.getTime();

                          return (
                            <Link
                              key={key}
                              href={`/day/${key}`}
                              className={`aspect-square rounded-lg border flex flex-col items-center justify-center text-sm transition-all ${
                                inTripRange
                                  ? isToday
                                    ? "bg-blue-50 border-blue-500 ring-2 ring-blue-500 text-blue-700 font-semibold"
                                    : isPast
                                    ? "bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300"
                                    : "bg-white border-gray-200 text-gray-900 hover:border-blue-300 hover:bg-blue-50"
                                  : "border-transparent text-gray-300"
                              }`}
                            >
                              <span>{cell.getDate()}</span>
                              {day?.summary && (
                                <div className="mt-1 px-2 py-0.5 bg-blue-500 text-white text-[10px] rounded-full truncate max-w-full">
                                  {trip.name}
                                </div>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Panel - Itinerary */}
            <div className="w-80 bg-[var(--card-bg)] border-l border-[var(--border)] p-6 overflow-auto">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                Itinerario del Día
              </h3>

              <div className="space-y-4">
                {allDays.slice(0, 5).map((date) => {
                  const key = formatDateKey(date);
                  const day = dayMap.get(key);
                  const dayOnly = normalizeToDay(date);
                  const isPast = dayOnly < today;
                  const isToday = dayOnly.getTime() === today.getTime();

                  return (
                    <Link
                      key={key}
                      href={`/day/${key}`}
                      className={`block p-4 rounded-lg border transition-colors ${
                        isToday
                          ? "bg-blue-50 border-blue-500"
                          : "bg-[var(--background)] border-[var(--border)] hover:border-[var(--primary)]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-[var(--text-muted)] uppercase">
                          {formatLongDate(date)}
                        </span>
                        {isToday && (
                          <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                            Hoy
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[var(--text-primary)] mb-2">
                        {day?.summary || "Sin actividades"}
                      </p>
                      {day?.city && (
                        <p className="text-xs text-[var(--text-muted)]">
                          📍 {day.city}
                        </p>
                      )}
                    </Link>
                  );
                })}
              </div>

              {allDays.length > 5 && (
                <Link
                  href="/setup"
                  className="mt-4 block text-center text-sm text-[var(--primary)] hover:text-[var(--primary-hover)] font-medium"
                >
                  Ver todos los días →
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
