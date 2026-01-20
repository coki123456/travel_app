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
    weekday: "long",
    day: "numeric",
    month: "long",
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
    <div className="flex h-screen overflow-hidden relative">
      {/* Sidebar */}
      <Sidebar
        activeTripName={trip.name}
        userName={session.user.name}
        userEmail={session.user.email}
      />

      {/* Main Content */}
      <div className="flex-1 ml-72 flex flex-col relative">
        {/* Header */}
        <Header />

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="flex h-full">
            {/* Calendar Section */}
            <div className="flex-1 p-6 overflow-y-auto">
              {/* Calendar Container */}
              <div className="max-w-4xl mx-auto">
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
                      className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 mb-6 animate-fade-in"
                    >
                      {/* Month Header */}
                      <div className="flex items-center justify-between mb-6">
                        <button className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>

                        <h3 className="text-xl font-bold text-gray-900 capitalize">
                          {monthLabel}
                        </h3>

                        <button className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
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
                          const inTripRange = cell >= trip.startDate && cell <= trip.endDate;
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
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Panel - Daily Itinerary */}
            <div className="w-96 bg-white/95 backdrop-blur-sm border-l border-gray-200/50 flex flex-col shadow-xl">
              {/* Panel Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Itinerario del Día
                  </h3>
                </div>
                <p className="text-sm text-gray-600 capitalize">
                  {formatLongDate(allDays[0])}
                </p>
              </div>

              {/* Day Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {currentDay?.summary ? (
                  <>
                    <h4 className="text-base font-bold text-gray-900 mb-3">
                      {currentDay.summary}
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed mb-6">
                      Hoy visitaremos el famoso Coliseo Romano. Luego, exploraremos el Foro Romano y el Monte Palatino.
                    </p>

                    {/* Timeline */}
                    <div className="space-y-4">
                      {[
                        { time: "9:00 AM", title: "Tour por el Coliseo", checked: true },
                        { time: "12:00 PM", title: "Recorrido por el Foro Romano", checked: true },
                        { time: "3:00 PM", title: "Visita al Monte Palatino", checked: false },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            item.checked
                              ? 'bg-green-500 border-green-500'
                              : 'border-gray-300'
                          }`}>
                            {item.checked && (
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm font-semibold ${item.checked ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                              {item.time}
                            </p>
                            <p className={`text-sm ${item.checked ? 'text-gray-400' : 'text-gray-600'}`}>
                              {item.title}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-500">
                      No hay actividades planificadas
                    </p>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="p-6 border-t border-gray-200">
                <Link
                  href={`/day/${formatDateKey(allDays[0])}`}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-lg shadow-green-500/30 hover:shadow-xl hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  Guardar Cambios
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
