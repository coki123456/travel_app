import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import DayForm from "./DayForm";
import ItemsBoardRefactored from "./ItemsBoardRefactored";
import AttachmentsPanel from "./AttachmentsPanel";

export const dynamic = "force-dynamic";

type ItemView = {
  id: string;
  title: string;
  description: string | null;
  type: string;
  block: string;
};

const parseDateParam = (value: string) => {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (!year || !month || !day) return null;

  const date = new Date(year, month - 1, day, 0, 0, 0);
  if (
    Number.isNaN(date.valueOf()) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
};

export default async function DayPage({
  params,
}: {
  params: Promise<{ date?: string }>;
}) {
  const cookieStore = await cookies();
  const activeTripId = cookieStore.get("activeTripId")?.value;
  const trip = activeTripId
    ? await prisma.trip.findUnique({ where: { id: activeTripId } })
    : null;

  if (!trip) {
    redirect("/setup");
  }

  const resolvedParams = await params;
  const dateParam = resolvedParams?.date ?? "";
  const dayStart = parseDateParam(dateParam);
  if (!dayStart) {
    return (
      <div className="min-h-screen px-6 py-10 text-slate-100">
        <div className="page-shell">
          <div className="glass-panel p-8 shadow-lg shadow-black/30">
            <h1 className="text-2xl font-semibold text-slate-100">
              Fecha inválida
            </h1>
            <p className="mt-3 text-sm text-slate-300">
              Usa el formato YYYY-MM-DD.
            </p>
            <Link
              href="/"
              className="btn-primary mt-6 inline-flex items-center justify-center"
            >
              Volver al calendario
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const nextDay = new Date(dayStart);
  nextDay.setDate(nextDay.getDate() + 1);

  const day = await prisma.day.findFirst({
    where: {
      tripId: trip.id,
      date: {
        gte: dayStart,
        lt: nextDay,
      },
    },
    include: {
      items: {
        orderBy: [{ block: "asc" }, { orderIndex: "asc" }],
      },
      attachments: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  const items: ItemView[] =
    day?.items.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      type: item.type,
      block: item.block,
    })) ?? [];

  const attachments =
    day?.attachments.map((attachment) => ({
      id: attachment.id,
      fileName: attachment.fileName,
      mimeType: attachment.mimeType,
      sizeBytes: attachment.sizeBytes,
      path: attachment.path,
    })) ?? [];

  const label = dayStart.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen px-4 py-6 text-slate-100 sm:px-6 lg:px-10">
      <div className="page-shell flex flex-col gap-6 md:gap-8">
        <header className="glass-panel p-5 sm:p-6 md:p-7">
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 transition hover:text-slate-200"
            >
              <span>←</span>
              Volver al calendario
            </Link>
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg shadow-black/30">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">
                {trip.name}
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-100 capitalize">
                {label}
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                {trip.destinations || "Define un destino para este viaje"}
              </p>
            </div>
          </div>
        </header>

        <section className="grid gap-5 md:gap-7 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-5 md:gap-6">
            <ItemsBoardRefactored date={dateParam} items={items} />
          </div>

          <aside className="flex flex-col gap-4 md:gap-5">
            <DayForm
              date={dateParam}
              initialCity={day?.city ?? null}
              initialSummary={day?.summary ?? null}
              initialJournal={day?.journal ?? null}
            />
            <AttachmentsPanel date={dateParam} attachments={attachments} />
          </aside>
        </section>
      </div>
    </div>
  );
}
