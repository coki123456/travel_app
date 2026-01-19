import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import TripSelector from "./TripSelector";
import LogoutButton from "./LogoutButton";

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
    <div className="min-h-screen bg-transparent px-5 py-8 text-slate-100 sm:px-6 sm:py-10 md:px-8 md:py-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 md:gap-10 animate-in">
        <header className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 shadow-lg shadow-blue-500/30">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">
              App Viaje
            </span>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-3">
              <h1 className="text-4xl font-bold gradient-text sm:text-5xl">
                {trip.name}
              </h1>
              <TripSelector
                trips={trips}
                activeTripId={activeTripId ?? null}
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/setup"
                className="btn-secondary"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                Cambiar viaje
              </Link>
              <Link
                href="/book"
                className="btn-secondary"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Libro del viaje
              </Link>
              <LogoutButton />
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm font-medium sm:text-base">
              {trip.startDate.toLocaleDateString("es-AR")} - {trip.endDate.toLocaleDateString("es-AR")}
            </p>
          </div>
        </header>

        <section className="grid gap-6 md:gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-5 md:gap-6">
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
                  className="card-elevated p-6 md:p-7"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full" />
                    <h2 className="text-xl font-bold text-slate-100 capitalize">
                      {monthLabel}
                    </h2>
                  </div>
                  <div className="grid grid-cols-7 gap-2 text-xs font-semibold text-slate-400">
                    {["dom", "lun", "mar", "mie", "jue", "vie", "sab"].map(
                      (label) => (
                        <div key={label} className="text-center uppercase tracking-wider">
                          {label}
                        </div>
                      )
                    )}
                  </div>
                  <div className="mt-3 grid grid-cols-7 gap-2 md:gap-2.5">
                    {matrix.flat().map((cell, cellIndex) => {
                      if (!cell) {
                        return (
                          <div
                            key={`empty-${cellIndex}`}
                            className="h-12 md:h-14"
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
                          className={[
                            "flex h-12 md:h-14 items-center justify-center rounded-xl text-sm md:text-base font-semibold transition-all duration-200",
                            inTripRange
                              ? [
                                  "border border-slate-700 hover:border-blue-500/50 hover:scale-105",
                                  isPast ? "bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 text-emerald-100" : "bg-slate-800/60 text-slate-100",
                                  isToday ? "ring-2 ring-blue-500 shadow-lg shadow-blue-500/30" : "",
                                ].join(" ")
                              : "text-slate-600",
                          ].join(" ")}
                        >
                          <span className="relative flex items-center justify-center">
                            {cell.getDate()}
                            {day?.summary ? (
                              <span className="absolute -right-1.5 -top-1.5 flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
                              </span>
                            ) : null}
                            {isPast && !isToday ? (
                              <span className="absolute -left-1 -top-1 text-[10px]">
                                ✓
                              </span>
                            ) : null}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <aside className="flex flex-col gap-5">
            <div className="card-elevated p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100">
                    Resumen por día
                  </h3>
                  <p className="text-xs text-slate-400">
                    Tus notas rápidas
                  </p>
                </div>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {allDays.map((date) => {
                const key = formatDateKey(date);
                const day = dayMap.get(key);
                const dayOnly = normalizeToDay(date);
                const isPast = dayOnly < today;
                const isToday = dayOnly.getTime() === today.getTime();

                return (
                  <Link
                    key={key}
                    href={`/day/${key}`}
                    className={[
                      "card p-4 hover:scale-[1.02] transition-all duration-200",
                      isPast ? "bg-emerald-500/5 border-emerald-500/20" : "",
                      isToday ? "ring-2 ring-blue-500 shadow-lg shadow-blue-500/20" : "",
                    ].join(" ")}
                  >
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="uppercase tracking-wider text-slate-400">
                        {formatLongDate(date)}
                      </span>
                      {day?.city && (
                        <span className="badge badge-primary text-[10px]">
                          {day.city}
                        </span>
                      )}
                    </div>
                    <p className="mt-3 text-sm text-slate-200 line-clamp-2">
                      {day?.summary ?? "Sin resumen todavía."}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <span
                        className={[
                          "h-2 w-2 rounded-full",
                          isToday
                            ? "bg-blue-400 shadow-lg shadow-blue-500/50"
                            : isPast
                            ? "bg-emerald-400"
                            : "bg-slate-500",
                        ].join(" ")}
                      />
                      <span className="text-xs font-medium text-slate-400">
                        {isToday ? "Hoy" : isPast ? "Completado" : "Próximo"}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}
