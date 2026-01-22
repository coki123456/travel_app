import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { formatDateKey, normalizeToDay, buildDaysInRange } from "@/lib/date-utils";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import CalendarMonthCard from "./components/calendar/CalendarMonthCard";
import DailyItineraryCard from "./components/itinerary/DailyItineraryCard";

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
    <div className="app-layout">
      {/* Sidebar */}
      <Sidebar
        activeTripName={trip.name}
        userName={session.user.name}
        userEmail={session.user.email}
      />

      {/* Main Content */}
      <main className="app-main sm:ml-64">
        {/* Header */}
        <Header />

        {/* Content Area */}
        <div className="app-content">
          <div className="container-wide">
            {/* Page Title */}
            <div className="mb-6 animate-fade-in">
              <h1 className="text-2xl font-semibold text-[rgb(var(--color-text-primary))] mb-1.5">
                {trip.name}
              </h1>
              <p className="text-sm text-[rgb(var(--color-text-secondary))]">
                {trip.destinations || "Organizá tu itinerario y disfrutá tu viaje"}
              </p>
            </div>

            {/* Two Column Layout */}
            <div className="grid lg:grid-cols-[1fr_400px] gap-6">
              {/* Calendar Section */}
              <div className="space-y-6 animate-fade-in">
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
              </div>

              {/* Right Panel - Daily Itinerary */}
              <aside className="animate-slide-in-right">
                <div className="lg:sticky lg:top-6">
                  <DailyItineraryCard
                    day={currentDay}
                    date={allDays[0]}
                    dateKey={formatDateKey(allDays[0])}
                  />
                </div>
              </aside>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
