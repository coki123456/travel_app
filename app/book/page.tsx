import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import PrintButton from "./PrintButton";

export const dynamic = "force-dynamic";

const BLOCKS = [
  { key: "ALL_DAY", label: "Todo el dia" },
  { key: "MORNING", label: "Manana" },
  { key: "AFTERNOON", label: "Tarde" },
  { key: "EVENING", label: "Noche" },
];

const ITEM_TYPES: Record<string, string> = {
  HOTEL: "Hotel",
  FLIGHT: "Vuelo",
  ATTRACTION: "Atraccion",
  FOOD: "Comida",
  TRANSFER: "Traslado",
  NOTE: "Nota",
};

const getTypeLabel = (value: string) => ITEM_TYPES[value] ?? value;

const formatDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const normalizeToNoon = (value: Date) =>
  new Date(value.getFullYear(), value.getMonth(), value.getDate(), 12, 0, 0);

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

export default async function BookPage() {
  const cookieStore = await cookies();
  const activeTripId = cookieStore.get("activeTripId")?.value;
  const trip = activeTripId
    ? await prisma.trip.findUnique({ where: { id: activeTripId } })
    : null;

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
    include: {
      items: {
        orderBy: [{ block: "asc" }, { orderIndex: "asc" }],
      },
    },
    orderBy: { date: "asc" },
  });

  const dayMap = new Map(
    days.map((day) => [formatDateKey(day.date), day])
  );

  const allDays = buildDaysInRange(trip.startDate, trip.endDate);

  return (
    <div className="min-h-screen bg-transparent px-6 py-10 text-slate-100 print:bg-white print:px-0 print:py-0">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 print:max-w-none print:gap-6 print:px-0">
        <header className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg shadow-black/30 print:border-none print:shadow-none">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            App Viaje
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-100">
            Libro del viaje
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            {trip.name} - {trip.startDate.toLocaleDateString("es-AR")} -{" "}
            {trip.endDate.toLocaleDateString("es-AR")}
          </p>
          {trip.destinations ? (
            <p className="mt-1 text-sm text-slate-400">
              Destinos: {trip.destinations}
            </p>
          ) : null}
          <div className="mt-5 flex flex-wrap gap-3 print:hidden">
            <Link
              href="/"
              className="rounded-2xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-500"
            >
              Volver al calendario
            </Link>
            <PrintButton />
          </div>
        </header>

        {allDays.map((date, index) => {
          const key = formatDateKey(date);
          const day = dayMap.get(key);
          const label = date.toLocaleDateString("es-AR", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
          });

          const itemsByBlock = BLOCKS.map((block) => ({
            ...block,
            items: day?.items.filter((item) => item.block === block.key) ?? [],
          }));

          const printClasses =
            index === 0
              ? "print:break-inside-avoid print:border-none print:shadow-none"
              : "print:break-before-page print:break-inside-avoid print:border-none print:shadow-none";

          return (
            <section
              key={key}
              className={`rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg shadow-black/30 ${printClasses}`}
            >
              <div className="hidden print:block print:pb-4">
                <div className="h-1 w-full rounded-full bg-zinc-200" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                  {key}
                </span>
                <h2 className="text-xl font-semibold text-slate-100 capitalize">
                  {label}
                </h2>
                {day?.city ? (
                  <p className="text-sm text-slate-400">Ciudad: {day.city}</p>
                ) : null}
              </div>

              <div className="mt-4 grid gap-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 print:border-none print:bg-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                    Resumen
                  </p>
                  <p className="mt-2 text-sm text-slate-200">
                    {day?.summary ?? "Sin resumen todavia."}
                  </p>
                </div>

                <div className="grid gap-4">
                  {itemsByBlock.map((block) => (
                    <div
                      key={block.key}
                      className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 print:border-none"
                    >
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="uppercase tracking-[0.3em]">
                          {block.label}
                        </span>
                        <span>{block.items.length}</span>
                      </div>
                      {block.items.length === 0 ? (
                        <p className="mt-3 text-sm text-slate-400">
                          Sin elementos.
                        </p>
                      ) : (
                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                          {block.items.map((item) => (
                            <div
                              key={item.id}
                              className="rounded-xl border border-slate-800 bg-slate-900/50 p-3 print:border-none print:bg-white"
                            >
                              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                                {getTypeLabel(item.type)}
                              </p>
                              <p className="mt-2 text-sm font-semibold text-slate-100">
                                {item.title}
                              </p>
                              {item.description ? (
                                <p className="mt-2 text-sm text-slate-300">
                                  {item.description}
                                </p>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 print:border-none print:bg-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                    Diario
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-slate-200">
                    {day?.journal ?? "Sin diario todavia."}
                  </p>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
