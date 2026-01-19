import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import TripSelector from "./TripSelector";

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

  // Obtener viajes propios y compartidos
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
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 md:gap-10">
        <header className="flex flex-col gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            App Viaje
          </span>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-3">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-100 sm:text-4xl">
                {trip.name}
              </h1>
              <TripSelector
                trips={trips}
                activeTripId={activeTripId ?? null}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/setup"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-700 px-5 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500"
              >
                Cambiar viaje
              </Link>
              <Link
                href="/book"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-700 px-5 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500"
              >
                Libro del viaje
              </Link>
            </div>
          </div>
          <p className="text-sm text-slate-300 sm:text-base">
            {trip.startDate.toLocaleDateString("es-AR")} -{" "}
            {trip.endDate.toLocaleDateString("es-AR")}
          </p>
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
                  className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-black/30 md:p-6"
                >
                  <h2 className="text-lg font-semibold text-slate-100 capitalize">
                    {monthLabel}
                  </h2>
                  <div className="mt-4 grid grid-cols-7 gap-2 text-xs text-slate-500">
                    {["dom", "lun", "mar", "mie", "jue", "vie", "sab"].map(
                      (label) => (
                        <div key={label} className="text-center uppercase">
                          {label}
                        </div>
                      )
                    )}
                  </div>
                  <div className="mt-2 grid grid-cols-7 gap-2 md:gap-2.5">
                    {matrix.flat().map((cell, cellIndex) => {
                      if (!cell) {
                        return (
                          <div
                            key={`empty-${cellIndex}`}
                            className="h-11 rounded-xl bg-transparent"
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
                            "flex h-12 items-center justify-center rounded-xl border text-sm transition md:h-14 md:text-base",
                            inTripRange
                              ? [
                                  "border-slate-700 text-slate-100 hover:border-slate-500",
                                  isPast ? "bg-emerald-500/15" : "bg-slate-900/60",
                                  isToday ? "ring-2 ring-emerald-400" : "",
                                ].join(" ")
                              : "border-transparent text-slate-600",
                          ].join(" ")}
                        >
                          <span className="relative flex items-center justify-center">
                            {cell.getDate()}
                            {day?.summary ? (
                              <span className="absolute -right-2 top-0 h-2 w-2 rounded-full bg-emerald-400" />
                            ) : null}
                            {isPast ? (
                              <span className="absolute -left-2 -top-1 text-[10px] text-emerald-300">
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

          <aside className="flex flex-col gap-4">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg shadow-black/30">
              <h3 className="text-sm font-semibold text-slate-100">
                Resumen por dia
              </h3>
              <p className="mt-2 text-sm text-slate-300">
                Anota un resumen rapido para cada fecha.
              </p>
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
                      "rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-black/20 transition hover:border-slate-600",
                      isPast ? "bg-emerald-500/10" : "",
                      isToday ? "ring-2 ring-emerald-400" : "",
                    ].join(" ")}
                  >
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="uppercase tracking-[0.2em]">
                        {formatLongDate(date)}
                      </span>
                      <span className="text-slate-500">{day?.city ?? ""}</span>
                    </div>
                    <p className="mt-3 text-sm text-slate-200">
                      {day?.summary ?? "Sin resumen todavia."}
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                      <span
                        className={[
                          "h-2 w-2 rounded-full",
                          isToday
                            ? "bg-emerald-400"
                            : isPast
                            ? "bg-emerald-300"
                            : "bg-slate-500",
                        ].join(" ")}
                      />
                      <span>
                        {isToday ? "Hoy" : isPast ? "Pasado" : "Proximo"}
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
