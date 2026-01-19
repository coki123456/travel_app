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
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <header className="flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                App Viaje
              </span>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-100 sm:text-4xl">
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
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg shadow-black/30">
              <h3 className="text-sm font-semibold text-slate-100">
                Que podes hacer
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                <li>Definir fechas del viaje.</li>
                <li>Cargar destinos principales.</li>
                <li>Empezar el calendario dia por dia.</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg shadow-black/30">
              <h3 className="text-sm font-semibold text-slate-100">
                Siguiente paso
              </h3>
              <p className="mt-3 text-sm text-slate-300">
                Una vez creado el viaje, vas a poder completar bloques (manana,
                tarde, noche, todo el dia) y adjuntar archivos.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
