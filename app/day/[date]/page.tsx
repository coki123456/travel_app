import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { parseDate, formatLongDate } from "@/lib/date-utils";
import DayForm from "./DayForm";
import ItemsBoardRefactored from "./ItemsBoardRefactored";
import AttachmentsPanel from "./AttachmentsPanel";
import BottomNav from "../../components/BottomNav";
import { EmojiIcon } from "../../components/ui/EmojiIcon";
import TopNav from "../../components/TopNav";

export const dynamic = "force-dynamic";

type ItemView = {
  id: string;
  title: string;
  description: string | null;
  type: string;
  block: string;
};

export default async function DayPage({
  params,
}: {
  params: Promise<{ date?: string }>;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

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
  const dayStart = parseDate(dateParam);
  if (!dayStart) {
    return (
      <div className="min-h-screen bg-[rgb(var(--color-bg-primary))] pb-20">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="card p-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-[var(--radius-md)] bg-[rgb(var(--color-error))]/10 flex items-center justify-center">
                <EmojiIcon emoji="⚠️" label="Fecha inválida" className="text-2xl" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-[rgb(var(--color-text-primary))]">
                  Fecha inválida
                </h1>
                <p className="text-sm text-[rgb(var(--color-text-secondary))]">
                  Usa el formato YYYY-MM-DD
                </p>
              </div>
            </div>
            <Link
              href="/"
              className="btn-primary mt-4 w-full"
            >
              <EmojiIcon emoji="←" label="Volver" className="text-base" />
              Volver al calendario
            </Link>
          </div>
        </div>
        <BottomNav />
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

  const label = formatLongDate(dayStart);

  return (
    <div className="min-h-screen bg-[rgb(var(--color-bg-primary))] pb-20">
      <TopNav />
      {/* Header compacto */}
      <div className="sticky top-0 z-40 bg-[rgb(var(--color-bg-secondary))] border-b border-[rgb(var(--color-border-light))] shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[rgb(var(--color-accent))] mb-2"
          >
            <EmojiIcon emoji="←" label="Volver" className="text-base" />
            Calendario
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[rgb(var(--color-accent))] to-[rgb(var(--color-accent-hover))] flex items-center justify-center shadow-sm">
              <EmojiIcon emoji="📅" label="Detalle del día" className="text-lg" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-[rgb(var(--color-text-primary))] capitalize truncate">
                {label}
              </h1>
              {day?.city && (
                <p className="text-xs text-[rgb(var(--color-text-secondary))] truncate">
                  📍 {day.city}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Items Board */}
          <ItemsBoardRefactored date={dateParam} items={items} />

          {/* Day Form */}
          <DayForm
            date={dateParam}
            initialCity={day?.city ?? null}
            initialSummary={day?.summary ?? null}
            initialJournal={day?.journal ?? null}
          />

          {/* Attachments */}
          <AttachmentsPanel date={dateParam} attachments={attachments} />
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
