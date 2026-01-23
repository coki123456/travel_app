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

export const dynamic = "force-dynamic";

type DaySummary = {
  id: string;
  date: Date;
  city: string | null;
  summary: string | null;
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

  // Obtener el día actual del viaje
  const currentDayKey = formatDateKey(allDays[0]);
  const currentDay = dayMap.get(currentDayKey);

  return (
    <div className="min-h-screen bg-[rgb(var(--color-bg-primary))] pb-20">
      {/* Header compacto */}
      <div className="sticky top-0 z-40 bg-[rgb(var(--color-bg-secondary))] border-b border-[rgb(var(--color-border-light))] shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-[rgb(var(--color-text-primary))] truncate">
                {trip.name}
              </h1>
              {trip.destinations && (
                <p className="text-xs text-[rgb(var(--color-text-secondary))] truncate">
                  {trip.destinations}
                </p>
              )}
            </div>
            <TripSelector trips={trips} currentTripId={trip.id} />
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Calendar Section */}
          {months.map((monthDays, index) => {
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
          })}

          {/* Daily Itinerary - Mobile optimized */}
          <div className="mt-6">
            <DailyItineraryCard
              day={currentDay}
              date={allDays[0]}
              dateKey={formatDateKey(allDays[0])}
            />
          </div>

          {/* Link al libro */}
          <Link href="/book" className="block">
            <div className="flex items-center justify-center gap-2 p-4 rounded-xl bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border-light))] hover:border-[rgb(var(--color-accent))]/50 transition-all">
              <EmojiIcon emoji="📖" label="Ver libro del viaje" className="text-xl" />
              <span className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
                Ver libro del viaje
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
