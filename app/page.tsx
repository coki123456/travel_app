import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
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

const formatDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

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
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        activeTripName={trip.name}
        userName={session.user.name}
        userEmail={session.user.email}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col sm:ml-72">
        {/* Header */}
        <Header />

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="flex flex-col lg:flex-row gap-4 p-4 md:p-6 max-w-[1600px] mx-auto">
            {/* Calendar Section */}
            <div className="flex-1 min-w-0">
              <div className="space-y-4">
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
            </div>

            {/* Right Panel - Daily Itinerary */}
            <div className="w-full lg:w-[400px] lg:sticky lg:top-4 lg:self-start">
              <DailyItineraryCard
                day={currentDay}
                date={allDays[0]}
                dateKey={formatDateKey(allDays[0])}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
