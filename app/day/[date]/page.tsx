import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import DayForm from "./DayForm";
import ItemsBoard from "./ItemsBoard";
import AttachmentsPanel from "./AttachmentsPanel";

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
      <div className="min-h-screen bg-zinc-50 px-6 py-10 text-zinc-900">
        <div className="mx-auto w-full max-w-4xl rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-zinc-900">
            Fecha invalida
          </h1>
          <p className="mt-3 text-sm text-zinc-600">
            Usa el formato YYYY-MM-DD.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center justify-center rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            Volver al calendario
          </Link>
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
    <div className="min-h-screen bg-zinc-50 px-6 py-10 text-zinc-900">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header className="flex flex-col gap-4">
          <Link
            href="/"
            className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400"
          >
            Volver al calendario
          </Link>
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400">
              {trip.name}
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900">
              {label}
            </h1>
          </div>
        </header>

        <section className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-6">
            <ItemsBoard date={dateParam} items={items} />
          </div>

          <aside className="flex flex-col gap-4">
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
