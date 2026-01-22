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
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar
          activeTripName={trip.name}
          userName={session.user.name}
          userEmail={session.user.email}
        />
        <div className="flex-1 flex flex-col sm:ml-72">
          <Header />
          <div className="flex-1 overflow-auto p-6">
            <div className="max-w-2xl mx-auto">
              <div className="card-elevated p-8 bg-white">
                <h1 className="text-2xl font-semibold text-gray-900">
                  Fecha inválida
                </h1>
                <p className="mt-3 text-sm text-gray-600">
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

  const label = formatLongDate(dayStart);

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
          <div className="p-4 md:p-6 max-w-[1400px] mx-auto">
            <div className="space-y-6">
              {/* Page Header */}
              <div className="card-elevated p-5 sm:p-6">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500 transition hover:text-blue-600 mb-4"
                >
                  <span>←</span>
                  Volver al calendario
                </Link>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-600">
                    {trip.name}
                  </p>
                  <h1 className="mt-3 text-3xl font-semibold tracking-tight text-gray-900 capitalize">
                    {label}
                  </h1>
                  <p className="mt-1 text-sm text-gray-700">
                    {trip.destinations || "Define un destino para este viaje"}
                  </p>
                </div>
              </div>

              {/* Two Column Layout */}
              <div className="grid gap-5 md:gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
                <div className="flex flex-col gap-5">
                  <ItemsBoardRefactored date={dateParam} items={items} />
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
