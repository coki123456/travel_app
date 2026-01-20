import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import SetupForm from "./SetupForm";
import TripList from "./TripList";
import LogoutButton from "../LogoutButton";

export const dynamic = "force-dynamic";

export default async function SetupPage({
  searchParams,
}: {
  searchParams?: Promise<{ edit?: string }>;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const trips = await prisma.trip.findMany({
    where: {
      OR: [
        { ownerId: session.user.id },
        { sharedWith: { some: { userId: session.user.id } } },
      ],
    },
    orderBy: { createdAt: "desc" },
  });

  const resolvedSearchParams = await searchParams;
  const editId = resolvedSearchParams?.edit;
  const editingTrip = editId
    ? trips.find((trip) => trip.id === editId)
    : null;

  const tripList = trips.map((trip) => ({
    id: trip.id,
    name: trip.name,
    destinations: trip.destinations,
    dates: `${trip.startDate.toLocaleDateString("es-AR")} - ${trip.endDate.toLocaleDateString("es-AR")}`,
  }));

  return (
    <div className="min-h-screen px-4 py-6 text-slate-50 sm:px-6 lg:px-10">
      <div className="page-shell space-y-6 sm:space-y-8 animate-in">
        <header className="glass-panel subtle-grid p-5 sm:p-7 lg:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/70 via-cyan-400/70 to-emerald-400/70 text-slate-950 shadow shadow-cyan-500/30">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-400">
                    App Viaje
                  </p>
                  <p className="text-sm text-slate-300">
                    Configura tu viaje activo y arranca el calendario.
                  </p>
                </div>
              </div>
              <h1 className="text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
                <span className="gradient-text">Configurar viaje</span>
              </h1>
              <p className="max-w-2xl text-sm text-slate-300">
                Carga fechas, destinos y selecciona el viaje activo. El resto
                de las vistas usarán esta información en cualquier dispositivo.
              </p>
              <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                <span className="rounded-full border border-slate-700/70 bg-slate-900/60 px-3 py-1">
                  {tripList.length} viaje(s) guardados
                </span>
                {editingTrip ? (
                  <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-amber-100">
                    Editando: {editingTrip.name}
                  </span>
                ) : null}
              </div>
            </div>
            <LogoutButton />
          </div>
        </header>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <section className="flex flex-col gap-4">
            <TripList trips={tripList} />
          </section>

          <aside className="flex flex-col gap-4">
            <SetupForm
              initialTrip={
                editingTrip
                  ? {
                      id: editingTrip.id,
                      name: editingTrip.name,
                      startDate: editingTrip.startDate.toISOString().slice(0, 10),
                      endDate: editingTrip.endDate.toISOString().slice(0, 10),
                      destinations: editingTrip.destinations,
                    }
                  : null
              }
            />
            <div className="card-elevated p-5">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-400 text-slate-950">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-slate-100">
                  Qué puedes hacer
                </h3>
              </div>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-emerald-300">•</span>
                  <span>Definir fechas del viaje y destinos clave.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-emerald-300">•</span>
                  <span>Elegir cuál es el viaje activo para las demás vistas.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-emerald-300">•</span>
                  <span>Empezar el calendario día por día con la nueva interfaz.</span>
                </li>
              </ul>
            </div>
            <div className="card-elevated p-5">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 text-slate-950">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7 18 12m0 0-5 5m5-5H6"
                    />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-slate-100">
                  Siguiente paso
                </h3>
              </div>
              <p className="text-sm text-slate-300">
                Una vez creado el viaje, completa los bloques (mañana, tarde,
                noche, todo el día), carga adjuntos y navega con el selector
                superior sin perder contexto.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
