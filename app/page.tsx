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
  const notedDays = Array.from(dayMap.values()).filter((day) => day.summary)
    .length;
  const completedDays = allDays.filter(
    (date) => normalizeToDay(date) < today
  ).length;
  const upcomingDay =
    allDays.find((date) => normalizeToDay(date) >= today) ??
    allDays[allDays.length - 1];

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
    <div className="min-h-screen px-4 py-6 text-slate-50 sm:px-6 lg:px-10">
      <div className="page-shell space-y-6 sm:space-y-8 md:space-y-10 animate-in">
        <header className="glass-panel subtle-grid p-5 sm:p-7 lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/70 via-cyan-400/70 to-emerald-400/70 shadow-lg shadow-cyan-500/20">
                  <svg
                    className="h-5 w-5 text-slate-950"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-400">
                    Travel App
                  </p>
                  <p className="text-sm text-slate-300">
                    {trip.destinations || "Añade tus destinos clave"}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
                  <span className="gradient-text">{trip.name}</span>
                </h1>
                <TripSelector
                  trips={trips}
                  activeTripId={activeTripId ?? null}
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-300">
                <span className="rounded-full border border-slate-700/80 bg-slate-900/50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                  {trip.startDate.toLocaleDateString("es-AR")} –{" "}
                  {trip.endDate.toLocaleDateString("es-AR")}
                </span>
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                  {allDays.length} días de viaje
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-3">
              <Link href="/setup" className="btn-tertiary text-xs sm:text-sm">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7h12m0 0-4-4m4 4-4 4m0 6H4m0 0 4 4m-4-4 4-4"
                  />
                </svg>
                Configurar
              </Link>
              <Link href="/book" className="btn-tertiary text-xs sm:text-sm">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                Libro
              </Link>
              <LogoutButton />
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Días planificados
              </p>
              <p className="mt-2 text-2xl font-semibold">{allDays.length}</p>
            </div>
            <div className="card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Con resumen
              </p>
              <p className="mt-2 text-2xl font-semibold">{notedDays}</p>
            </div>
            <div className="card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Completados
              </p>
              <p className="mt-2 text-2xl font-semibold">
                {completedDays}/{allDays.length}
              </p>
            </div>
            <div className="card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Próximo día
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-100">
                {formatLongDate(upcomingDay)}
              </p>
            </div>
          </div>
        </header>

        <section className="grid gap-5 lg:grid-cols-[1.65fr_1fr]">
          <div className="flex flex-col gap-4 sm:gap-5">
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
                  className="card-elevated p-4 sm:p-5 md:p-6"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-1 rounded-full bg-gradient-to-b from-blue-400 to-cyan-400" />
                      <h2 className="text-lg sm:text-xl font-semibold capitalize">
                        {monthLabel}
                      </h2>
                    </div>
                    <span className="rounded-full border border-slate-700/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Calendario
                    </span>
                  </div>
                  <div className="mb-2 grid grid-cols-7 gap-1 sm:gap-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500 sm:text-xs">
                    {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map(
                      (label) => (
                        <div key={label} className="text-center">
                          <span className="hidden sm:inline">{label}</span>
                          <span className="sm:hidden">{label[0]}</span>
                        </div>
                      )
                    )}
                  </div>
                  <div className="grid grid-cols-7 gap-1 sm:gap-2">
                    {matrix.flat().map((cell, cellIndex) => {
                      if (!cell) {
                        return (
                          <div
                            key={`empty-${cellIndex}`}
                            className="h-12 sm:h-14 md:h-16"
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

                      const stateClasses = !inTripRange
                        ? "border border-dashed border-slate-800 text-slate-600"
                        : isToday
                          ? "border border-blue-400/60 bg-blue-500/10 shadow-lg shadow-blue-500/20"
                          : isPast
                            ? "border border-emerald-400/30 bg-emerald-500/10 text-emerald-50"
                            : "border border-slate-800/80 bg-slate-900/50 hover:border-slate-600/70";

                      return (
                        <Link
                          key={key}
                          href={`/day/${key}`}
                          className={`group relative flex h-12 items-center justify-center rounded-xl text-xs font-semibold transition duration-200 sm:h-14 md:h-16 sm:text-sm ${stateClasses}`}
                        >
                          <span className="relative flex items-center justify-center">
                            {cell.getDate()}
                            {day?.summary ? (
                              <span className="absolute -right-1 -top-1 sm:-right-1.5 sm:-top-1.5 flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-80" />
                                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-300 sm:h-2 sm:w-2" />
                              </span>
                            ) : null}
                            {isPast && !isToday ? (
                              <span className="absolute -left-0.5 -top-0.5 text-[10px] text-emerald-300 sm:-left-1 sm:-top-1">
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

          <aside className="flex flex-col gap-4 sm:gap-5">
            <div className="card-elevated p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 text-slate-950">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-100">
                    Resumen por día
                  </h3>
                  <p className="text-xs text-slate-400">
                    Saltá directo a los días que importan.
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
                      "card p-4 transition duration-200 hover:-translate-y-0.5 active:scale-[0.99]",
                      isPast ? "border-emerald-500/25 bg-emerald-500/10" : "",
                      isToday
                        ? "ring-1 ring-blue-400/60 shadow-lg shadow-blue-500/15"
                        : "",
                    ].join(" ")}
                  >
                    <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                      <span>{formatLongDate(date)}</span>
                      {day?.city && (
                        <span className="badge badge-primary text-[10px] px-2 py-0.5">
                          {day.city}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-slate-100 line-clamp-2">
                      {day?.summary ?? "Sin resumen todavía."}
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-xs font-medium text-slate-400">
                      <span
                        className={[
                          "h-2 w-2 rounded-full",
                          isToday
                            ? "bg-blue-400 shadow shadow-blue-500/40"
                            : isPast
                              ? "bg-emerald-400"
                              : "bg-slate-500",
                        ].join(" ")}
                      />
                      <span>
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
