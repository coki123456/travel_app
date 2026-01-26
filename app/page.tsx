import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { formatDateKey, normalizeToDay, buildDaysInRange } from "@/lib/date-utils";
import CalendarMonthCard from "./components/calendar/CalendarMonthCard";
import DailyItineraryCard from "./components/itinerary/DailyItineraryCard";
import BottomNav from "./components/BottomNav";
import { EmojiIcon } from "./components/ui/EmojiIcon";
import Link from "next/link";
import TripSelector from "./TripSelector";
import TopNav from "./components/TopNav";

export const dynamic = "force-dynamic";

type DaySummary = {
  id: string;
  date: Date;
  city: string | null;
  summary: string | null;
};

const formatRange = (start: Date, end: Date) =>
  `${start.toLocaleDateString("es-AR", { day: "numeric", month: "short" })} - ${end.toLocaleDateString("es-AR", { day: "numeric", month: "short" })}`;

const formatShortDate = (date: Date) =>
  date.toLocaleDateString("es-AR", { day: "numeric", month: "short" });

const formatWeekdayDate = (date: Date) =>
  date.toLocaleDateString("es-AR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

type SearchParams = {
  compact?: string;
};

export default async function HomePage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
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
  const todayKey = formatDateKey(today);
  const activeDate =
    allDays.find((day) => formatDateKey(day) === todayKey) ?? allDays[0];
  const activeDayKey = formatDateKey(activeDate);
  const activeDay = dayMap.get(activeDayKey);

  const activeIndex = allDays.findIndex(
    (day) => formatDateKey(day) === activeDayKey
  );
  const previewDays =
    activeIndex >= 0
      ? allDays.slice(activeIndex, activeIndex + 3)
      : allDays.slice(0, 3);

  const tripLength = allDays.length;
  const daysRemaining = Math.max(
    0,
    Math.ceil((trip.endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  );
  const progress =
    tripLength > 1
      ? Math.min(
          1,
          Math.max(
            0,
            (today.getTime() - trip.startDate.getTime()) /
              (trip.endDate.getTime() - trip.startDate.getTime())
          )
        )
      : 1;
  const progressPercent = Math.round(progress * 100);

  const hasContent = (day?: DaySummary) => Boolean(day?.summary || day?.city);
  const daysWithContent = allDays.filter((day) => {
    const key = formatDateKey(day);
    if (key === todayKey) return true; // mantener hoy visible
    return hasContent(dayMap.get(key));
  });
  const monthsWithContent = Array.from(
    daysWithContent.reduce((acc, day) => {
      const key = `${day.getFullYear()}-${day.getMonth()}`;
      const bucket = acc.get(key) ?? [];
      bucket.push(day);
      acc.set(key, bucket);
      return acc;
    }, new Map<string, Date[]>())
  ).map(([, value]) => value);

  const resolvedSearchParams = await searchParams;
  const compact = resolvedSearchParams?.compact === "true";
  const toggleCompactHref = compact ? "/" : "/?compact=true";
  const containerWidth = compact ? "max-w-4xl" : "max-w-5xl";
  const sectionSpacing = compact ? "space-y-8" : "space-y-10";
  const calendarPadding = compact ? "p-4" : "p-6";
  const calendarSpacing = compact ? "space-y-4" : "space-y-6";

  return (
    <div className="min-h-screen pb-24 text-[rgb(var(--color-text-primary))]">
      <TopNav />
      <div className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[rgba(20,136,158,0.12)] via-[rgba(255,124,74,0.08)] to-transparent" />
        <div className="absolute inset-0 -z-10 blur-3xl opacity-60 bg-[radial-gradient(circle_at_12%_18%,rgba(20,136,158,0.35),transparent_35%),radial-gradient(circle_at_85%_12%,rgba(255,124,74,0.28),transparent_32%),radial-gradient(circle_at_70%_75%,rgba(20,136,158,0.18),transparent_30%)]" />
        <div className={`${containerWidth} mx-auto px-4 pt-10 pb-14`}>
          <div className="flex flex-col gap-6">
            <div className="flex items-start justify-between gap-4 flex-wrap reveal">
              <div className="space-y-3 min-w-0">
                <div className="inline-flex items-center gap-2 rounded-full bg-[rgb(var(--color-contrast-light))] border border-[rgb(var(--color-contrast))/18] px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[rgb(var(--color-contrast-hover))]">
                  <span>Viaje activo</span>
                  <span className="inline-block h-2 w-2 rounded-full bg-[rgb(var(--color-contrast))]" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl sm:text-4xl font-semibold leading-tight text-[rgb(var(--color-text-primary))]">
                    {trip.name}
                  </h1>
                  <p className="text-base text-[rgb(var(--color-text-secondary))]">
                    {trip.destinations ?? "Itinerario curado"} · {formatRange(trip.startDate, trip.endDate)} · {tripLength} {tripLength === 1 ? "día" : "días"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <div className="badge">
                    <EmojiIcon emoji="📅" label="Rango" className="text-sm" />
                    {formatShortDate(trip.startDate)} - {formatShortDate(trip.endDate)}
                  </div>
                  <div className="badge-accent">
                    <EmojiIcon emoji="🧭" label="Duración" className="text-sm" />
                    {tripLength} {tripLength === 1 ? "día" : "días"} de aventura
                  </div>
                </div>
              </div>
              <TripSelector trips={trips} currentTripId={trip.id} />
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="card p-4 reveal">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[rgb(var(--color-text-tertiary))]">
                  Estado
                </p>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-lg font-semibold">
                      {progressPercent}% recorrido
                    </p>
                    <p className="text-sm text-[rgb(var(--color-text-secondary))]">
                      {daysRemaining === 0
                        ? "En su día final"
                        : `${daysRemaining} día${daysRemaining === 1 ? "" : "s"} restantes`}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-[rgb(var(--color-accent-light))] flex items-center justify-center text-[rgb(var(--color-accent))] font-bold">
                    {tripLength}
                  </div>
                </div>
              </div>

              <div className="card p-4 reveal reveal-2">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[rgb(var(--color-text-tertiary))]">
                  Próximo día
                </p>
                <div className="mt-2 space-y-1">
                  <p className="text-lg font-semibold capitalize">
                    {formatWeekdayDate(activeDate)}
                  </p>
                  <p className="text-sm text-[rgb(var(--color-text-secondary))]">
                    {activeDay?.city ?? "Aún sin ciudad asignada"}
                  </p>
                  <div className="badge mt-2">
                    <EmojiIcon emoji="✨" label="Spotlight" className="text-sm" />
                    {activeDay?.summary ? activeDay.summary : "Agrega tu primera actividad"}
                  </div>
                </div>
              </div>

              <div className="card p-4 reveal reveal-3">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[rgb(var(--color-text-tertiary))]">
                  Libro
                </p>
                <div className="mt-2 flex flex-col gap-3">
                  <p className="text-sm text-[rgb(var(--color-text-secondary))]">
                    Guarda tus páginas favoritas y compartilas.
                  </p>
                  <Link href="/book" className="btn-secondary justify-center">
                    <EmojiIcon emoji="📖" label="Libro" className="text-base" />
                    Abrir libro
                  </Link>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 reveal reveal-2">
              <Link href="/book" className="btn-primary">
                <EmojiIcon emoji="🚀" label="Explorar" className="text-base" />
                Ver libro completo
              </Link>
              <Link href="/setup" className="btn-secondary">
                <EmojiIcon emoji="➕" label="Nuevo viaje" className="text-base" />
                Crear nuevo viaje
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className={`${containerWidth} mx-auto px-4 -mt-8 ${sectionSpacing} pb-12`}>
        <div className={`card ${calendarPadding} ${calendarSpacing} reveal`}>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <p className="text-xs uppercase tracking-[0.08em] text-[rgb(var(--color-text-tertiary))]">
                Calendario completo
              </p>
              <h3 className="text-xl font-semibold">Mapa del viaje</h3>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="badge">
                <EmojiIcon emoji="📆" label="Hoy" className="text-sm" />
                Hoy: {formatShortDate(today)}
              </div>
              <Link
                href={toggleCompactHref}
                className="text-xs font-semibold text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-accent))] border border-[rgb(var(--color-border-light))] rounded-full px-3 py-1.5 transition-colors"
              >
                {compact ? "Vista amplia" : "Modo compacto"}
              </Link>
            </div>
          </div>

          <div className={calendarSpacing}>
            {monthsWithContent.length === 0 ? (
              <div className="text-sm text-[rgb(var(--color-text-secondary))]">
                Solo se muestran días con actividades. Aún no hay días planificados.
              </div>
            ) : (
              monthsWithContent.map((monthDays, index) => {
                const reference = monthDays[0];
                return (
                  <CalendarMonthCard
                    key={`${reference.getFullYear()}-${reference.getMonth()}-${index}`}
                    monthDays={monthDays}
                    dayMap={dayMap}
                    tripStartDate={trip.startDate}
                    tripEndDate={trip.endDate}
                    today={today}
                  />
                );
              })
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.6fr,1fr] items-start">
          <div className="reveal">
            <DailyItineraryCard
              day={activeDay}
              date={activeDate}
              dateKey={activeDayKey}
            />
          </div>

          <div className="card p-6 space-y-5 reveal reveal-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.08em] text-[rgb(var(--color-text-tertiary))]">
                  Ritmo del viaje
                </p>
                <h3 className="text-xl font-semibold">Progreso y próximos días</h3>
              </div>
              <div className="badge-accent">
                <EmojiIcon emoji="🌊" label="Flujo" className="text-sm" />
                {progressPercent}%
              </div>
            </div>

            <div className="space-y-3">
              <div className="h-3 w-full rounded-full bg-[rgb(var(--color-bg-tertiary))] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[rgb(var(--color-accent))] via-[rgb(var(--color-contrast))] to-[rgb(var(--color-contrast-hover))]"
                  style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-[rgb(var(--color-text-secondary))]">
                <span>{formatShortDate(trip.startDate)}</span>
                <span>{formatShortDate(trip.endDate)}</span>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
                Próximos días
              </p>
              <div className="space-y-2">
                {previewDays.map((day) => {
                  const key = formatDateKey(day);
                  const info = dayMap.get(key);
                  return (
                    <div
                      key={key}
                      className="flex items-center justify-between gap-3 rounded-[var(--radius-lg)] border border-[rgb(var(--color-border-light))] bg-white/70 px-3 py-2"
                      style={{ boxShadow: "var(--shadow-sm)" }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-[var(--radius-md)] bg-[rgb(var(--color-accent-light))] flex items-center justify-center text-[rgb(var(--color-accent))] font-semibold">
                          {day.getDate()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold capitalize">
                            {formatWeekdayDate(day)}
                          </p>
                          <p className="text-xs text-[rgb(var(--color-text-secondary))]">
                            {info?.city ?? "Sin ciudad"} · {info?.summary ?? "Aún sin resumen"}
                          </p>
                        </div>
                      </div>
                      <Link
                        href={`/day/${key}`}
                        className="text-sm font-semibold text-[rgb(var(--color-contrast-hover))] hover:text-[rgb(var(--color-contrast))] transition-colors"
                      >
                        Abrir
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <Link href="/book" className="block reveal reveal-2">
          <div
            className="card-hover p-5 bg-gradient-to-r from-[rgb(var(--color-accent))] via-[rgb(var(--color-contrast))] to-[rgb(var(--color-contrast-hover))] text-white"
            style={{ boxShadow: "var(--shadow-lg)" }}
          >
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <p className="text-sm opacity-90">Consolidá tu aventura</p>
                <p className="text-xl font-semibold">Abrir el libro del viaje</p>
              </div>
              <div className="btn-secondary bg-white text-[rgb(var(--color-text-primary))] border-0">
                <EmojiIcon emoji="➡️" label="Ir" className="text-base" />
                Ver libro
              </div>
            </div>
          </div>
        </Link>
      </div>

      <BottomNav />
    </div>
  );
}
