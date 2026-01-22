import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { parseDate, formatLongDate } from "@/lib/date-utils";
import DayForm from "./DayForm";
import ItemsBoardRefactored from "./ItemsBoardRefactored";
import AttachmentsPanel from "./AttachmentsPanel";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { EmojiIcon } from "../../components/ui/EmojiIcon";

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
      <div className="app-layout">
        <Sidebar
          activeTripName={trip.name}
          userName={session.user.name}
          userEmail={session.user.email}
        />
        <main className="app-main sm:ml-64">
          <Header />
          <div className="app-content">
            <div className="container-narrow">
              <div className="card p-8 animate-fade-in">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-[var(--radius-md)] bg-[rgb(var(--color-error))]/10 flex items-center justify-center">
                    <EmojiIcon symbol="⚠️" label="Fecha inválida" className="text-2xl text-[rgb(var(--color-error))]" />
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
                  <EmojiIcon symbol="⬅️" label="Volver" className="text-base" />
                  Volver al calendario
                </Link>
              </div>
            </div>
          </div>
        </main>
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
            <div className="space-y-6">
              {/* Page Header */}
              <div className="animate-fade-in">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-sm font-medium text-[rgb(var(--color-text-secondary))] transition hover:text-[rgb(var(--color-accent))] mb-4"
                >
                  <EmojiIcon symbol="⬅️" label="Volver" className="text-base" />
                  Volver al calendario
                </Link>
                <div className="card p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-[var(--radius-md)] bg-gradient-to-br from-[rgb(var(--color-accent))] to-[rgb(var(--color-accent-hover))] flex items-center justify-center shadow-[var(--shadow-sm)]">
                      <EmojiIcon symbol="📆" label="Detalle del día" className="text-2xl" />
                    </div>
                    <div className="flex-1">
                      <span className="badge badge-accent text-xs uppercase">
                        {trip.name}
                      </span>
                      <h1 className="mt-2 text-2xl font-semibold text-[rgb(var(--color-text-primary))] capitalize">
                        {label}
                      </h1>
                      <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
                        {trip.destinations || "Organizá tu día"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Two Column Layout */}
              <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
                <div className="space-y-6 animate-fade-in">
                  <ItemsBoardRefactored date={dateParam} items={items} />
                </div>

                <aside className="space-y-6 animate-slide-in-right">
                  <DayForm
                    date={dateParam}
                    initialCity={day?.city ?? null}
                    initialSummary={day?.summary ?? null}
                    initialJournal={day?.journal ?? null}
                  />
                  <AttachmentsPanel date={dateParam} attachments={attachments} />
                </aside>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
