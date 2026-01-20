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
        <header className="glass-panel p-5 sm:p-7 lg:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
                <span className="gradient-text">Configurar viaje</span>
              </h1>
              <p className="max-w-2xl text-sm text-slate-300">
                Carga fechas, destinos y selecciona el viaje activo. El resto
                de las vistas usarán esta información en cualquier dispositivo.
              </p>
              <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-300">
                <span className="rounded-md border border-slate-700 bg-slate-900/60 px-3 py-1">
                  {tripList.length} viaje(s) guardados
                </span>
                {editingTrip ? (
                  <span className="rounded-md border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-amber-100">
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
              <h3 className="mb-2 text-base font-semibold text-slate-100">
                Qué puedes hacer
              </h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>• Definir fechas del viaje y destinos clave.</li>
                <li>• Elegir el viaje activo para las demás vistas.</li>
                <li>• Empezar el calendario día por día.</li>
              </ul>
            </div>
            <div className="card-elevated p-5">
              <h3 className="mb-2 text-base font-semibold text-slate-100">
                Siguiente paso
              </h3>
              <p className="text-sm text-slate-300">
                Una vez creado el viaje, completa bloques (mañana, tarde,
                noche, todo el día) y carga adjuntos desde el calendario.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
