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
    <div className="min-h-screen bg-transparent px-6 py-12 text-slate-100">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 animate-in">
        <header className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 shadow-lg shadow-blue-500/30">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">
                  App Viaje
                </span>
              </div>
              <h1 className="text-4xl font-bold gradient-text sm:text-5xl">
                Configurar viaje
              </h1>
              <p className="max-w-2xl text-sm text-slate-300 sm:text-base">
                Carga la info principal del viaje para empezar a planificar el
                calendario y los bloques diarios.
              </p>
            </div>
            <LogoutButton />
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
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
                      startDate: editingTrip.startDate
                        .toISOString()
                        .slice(0, 10),
                      endDate: editingTrip.endDate.toISOString().slice(0, 10),
                      destinations: editingTrip.destinations,
                    }
                  : null
              }
            />
            <div className="card-elevated p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-500">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-slate-100">
                  Qué podés hacer
                </h3>
              </div>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">•</span>
                  <span>Definir fechas del viaje</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">•</span>
                  <span>Cargar destinos principales</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">•</span>
                  <span>Empezar el calendario día por día</span>
                </li>
              </ul>
            </div>
            <div className="card-elevated p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-slate-100">
                  Siguiente paso
                </h3>
              </div>
              <p className="text-sm text-slate-300">
                Una vez creado el viaje, vas a poder completar bloques (mañana,
                tarde, noche, todo el día) y adjuntar archivos.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
