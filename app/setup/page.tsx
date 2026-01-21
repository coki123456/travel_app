import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import SetupForm from "./SetupForm";
import TripList from "./TripList";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { cookies } from "next/headers";

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

  const cookieStore = await cookies();
  const activeTripId = cookieStore.get("activeTripId")?.value;

  const [trips, activeTrip] = await Promise.all([
    prisma.trip.findMany({
      where: {
        OR: [
          { ownerId: session.user.id },
          { sharedWith: { some: { userId: session.user.id } } },
        ],
      },
      orderBy: { createdAt: "desc" },
    }),
    activeTripId
      ? prisma.trip.findFirst({
          where: {
            id: activeTripId,
            OR: [
              { ownerId: session.user.id },
              { sharedWith: { some: { userId: session.user.id } } },
            ],
          },
        })
      : null,
  ]);

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
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        activeTripName={activeTrip?.name ?? null}
        userName={session.user.name}
        userEmail={session.user.email}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-72">
        {/* Header */}
        <Header />

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-4 md:p-6 max-w-[1400px] mx-auto">
            <div className="space-y-6">
              {/* Page Header */}
              <div className="card-elevated p-5 sm:p-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  Configurar viaje
                </h1>
                <p className="text-sm text-gray-600 mb-3">
                  Carga fechas, destinos y selecciona el viaje activo. El resto
                  de las vistas usarán esta información en cualquier dispositivo.
                </p>
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <span className="rounded-md border border-gray-300 bg-white px-3 py-1 text-gray-700">
                    {tripList.length} viaje(s) guardados
                  </span>
                  {editingTrip ? (
                    <span className="rounded-md border border-amber-300 bg-amber-50 px-3 py-1 text-amber-700">
                      Editando: {editingTrip.name}
                    </span>
                  ) : null}
                </div>
              </div>

              {/* Two Column Layout */}
              <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
                {/* Left Column - Trip List */}
                <section className="flex flex-col gap-4">
                  <TripList trips={tripList} />
                </section>

                {/* Right Column - Setup Form */}
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
                    <h3 className="mb-2 text-base font-semibold text-gray-900">
                      Qué puedes hacer
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>• Definir fechas del viaje y destinos clave.</li>
                      <li>• Elegir el viaje activo para las demás vistas.</li>
                      <li>• Empezar el calendario día por día.</li>
                    </ul>
                  </div>
                  <div className="card-elevated p-5">
                    <h3 className="mb-2 text-base font-semibold text-gray-900">
                      Siguiente paso
                    </h3>
                    <p className="text-sm text-gray-700">
                      Una vez creado el viaje, completa bloques (mañana, tarde,
                      noche, todo el día) y carga adjuntos desde el calendario.
                    </p>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
