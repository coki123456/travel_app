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
    <div className="app-layout">
      {/* Sidebar */}
      <Sidebar
        activeTripName={activeTrip?.name ?? null}
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
                <div className="card p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-[var(--radius-md)] bg-gradient-to-br from-[rgb(var(--color-accent))] to-[rgb(var(--color-accent-hover))] flex items-center justify-center shadow-[var(--shadow-sm)]">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h1 className="text-xl font-semibold text-[rgb(var(--color-text-primary))] mb-1.5">
                        Configurar viajes
                      </h1>
                      <p className="text-sm text-[rgb(var(--color-text-secondary))] mb-2.5">
                        Creá y administrá tus viajes. Elegí fechas, destinos y seleccioná el viaje activo.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="badge badge-accent">
                          {tripList.length} {tripList.length === 1 ? 'viaje' : 'viajes'}
                        </span>
                        {editingTrip && (
                          <span className="badge" style={{backgroundColor: 'rgb(var(--color-warning))/10', color: 'rgb(var(--color-warning))'}}>
                            Editando: {editingTrip.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Two Column Layout */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Left Column - Trip List */}
                <div className="space-y-6 animate-fade-in">
                  <TripList trips={tripList} />
                </div>

                {/* Right Column - Setup Form */}
                <aside className="space-y-6 animate-slide-in-right">
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

                  <div className="card-flat p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <svg className="w-5 h-5 text-[rgb(var(--color-accent))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="text-base font-semibold text-[rgb(var(--color-text-primary))]">
                        Qué podés hacer
                      </h3>
                    </div>
                    <ul className="space-y-2 text-sm text-[rgb(var(--color-text-secondary))]">
                      <li className="flex items-start gap-2">
                        <span className="text-[rgb(var(--color-accent))] mt-0.5">•</span>
                        <span>Definir fechas del viaje y destinos clave</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[rgb(var(--color-accent))] mt-0.5">•</span>
                        <span>Elegir el viaje activo para las demás vistas</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[rgb(var(--color-accent))] mt-0.5">•</span>
                        <span>Empezar el calendario día por día</span>
                      </li>
                    </ul>
                  </div>

                  <div className="card-flat p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <svg className="w-5 h-5 text-[rgb(var(--color-accent))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                      <h3 className="text-base font-semibold text-[rgb(var(--color-text-primary))]">
                        Siguiente paso
                      </h3>
                    </div>
                    <p className="text-sm text-[rgb(var(--color-text-secondary))]">
                      Una vez creado el viaje, completá bloques horarios y cargá adjuntos desde el calendario.
                    </p>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
