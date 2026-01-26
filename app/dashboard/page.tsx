import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import Link from "next/link";
import { EmojiIcon } from "../components/ui/EmojiIcon";
import { Card, CardContent } from "../components/ui/Card";
import LogoutButton from "../LogoutButton";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const cookieStore = await cookies();
  const activeTripId = cookieStore.get("activeTripId")?.value;

  const [activeTrip, allTrips] = await Promise.all([
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
    prisma.trip.findMany({
      where: {
        OR: [
          { ownerId: session.user.id },
          { sharedWith: { some: { userId: session.user.id } } },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ]);

  const today = new Date();
  const upcomingTrips = allTrips.filter(trip => trip.endDate >= today);
  const pastTrips = allTrips.filter(trip => trip.endDate < today);

  return (
    <div className="min-h-screen bg-[rgb(var(--color-bg-primary))] pb-24">
      {/* Header con perfil */}
      <div className="bg-gradient-to-br from-[rgb(var(--color-accent))] to-[rgb(var(--color-accent-hover))] text-white px-3 py-3">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-base border-2 border-white/30">
                {session.user.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-semibold leading-tight">Hola, {session.user.name?.split(" ")[0] || "Viajero"}!</h1>
                <p className="text-[11px] sm:text-xs text-white/85">{session.user.email}</p>
              </div>
            </div>
            <LogoutButton variant="icon" />
          </div>

          {/* Viaje activo */}
          {activeTrip && (
            <Link href="/" className="block">
              <Card variant="default" className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-[11px] text-white/75 uppercase tracking-wider mb-1">Viaje activo</p>
                      <h3 className="text-sm sm:text-base font-semibold text-white mb-1">{activeTrip.name}</h3>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-white/85">
                        <EmojiIcon emoji="📍" label="Destino" className="text-xs" />
                        <span>{activeTrip.destinations || "Sin destino"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-white/85 mt-1">
                        <EmojiIcon emoji="📅" label="Fechas" className="text-xs" />
                        <span>
                          {activeTrip.startDate.toLocaleDateString("es-AR")} - {activeTrip.endDate.toLocaleDateString("es-AR")}
                        </span>
                      </div>
                    </div>
                    <EmojiIcon emoji="→" label="Ver calendario" className="text-2xl opacity-70" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          )}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-xl mx-auto px-4 -mt-4 space-y-6">
        {/* Próximos viajes */}
        {upcomingTrips.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base sm:text-lg font-semibold text-[rgb(var(--color-text-primary))]">
                Próximos viajes
              </h2>
              <Link href="/setup" className="text-sm text-[rgb(var(--color-accent))] font-medium">
                Ver todos
              </Link>
            </div>
            <div className="space-y-3">
              {upcomingTrips.map((trip) => (
                <Link key={trip.id} href={`/setup`}>
                  <Card variant="default" className="hover:shadow-lg transition-all">
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-[rgb(var(--color-text-primary))] mb-1 text-sm sm:text-base">
                            {trip.name}
                          </h3>
                          {trip.destinations && (
                            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-[rgb(var(--color-text-secondary))] mb-2">
                              <EmojiIcon emoji="📍" label="Destino" className="text-xs" />
                              <span>{trip.destinations}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[rgb(var(--color-text-tertiary))]">
                            <EmojiIcon emoji="📅" label="Fechas" className="text-[10px]" />
                            <span>
                              {trip.startDate.toLocaleDateString("es-AR", { day: "numeric", month: "short" })} - {trip.endDate.toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                          </div>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-[rgb(var(--color-accent-light))] flex items-center justify-center">
                          <EmojiIcon emoji="✈️" label="" className="text-lg" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Acciones rápidas */}
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-[rgb(var(--color-text-primary))] mb-3">
            Acciones rápidas
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/setup?create=true">
              <Card variant="default" className="hover:shadow-lg transition-all h-full">
                <CardContent className="p-3 flex flex-col items-center justify-center text-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-[rgb(var(--color-accent-light))] flex items-center justify-center">
                    <EmojiIcon emoji="➕" label="Crear viaje" className="text-xl" />
                  </div>
                  <span className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
                    Nuevo Viaje
                  </span>
                </CardContent>
              </Card>
            </Link>

            <Link href="/book">
              <Card variant="default" className="hover:shadow-lg transition-all h-full">
                <CardContent className="p-3 flex flex-col items-center justify-center text-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-[rgb(var(--color-accent-light))] flex items-center justify-center">
                    <EmojiIcon emoji="📖" label="Libro de viaje" className="text-xl" />
                  </div>
                  <span className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
                    Libro
                  </span>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Viajes pasados */}
        {pastTrips.length > 0 && (
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-[rgb(var(--color-text-primary))] mb-3">
              Viajes pasados
            </h2>
            <div className="space-y-2">
              {pastTrips.map((trip) => (
                <Link key={trip.id} href={`/setup`}>
                  <Card variant="default" className="hover:shadow-md transition-all opacity-80">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-[rgb(var(--color-text-primary))] text-sm truncate">
                            {trip.name}
                          </h3>
                          <p className="text-xs text-[rgb(var(--color-text-tertiary))]">
                            {trip.endDate.toLocaleDateString("es-AR", { year: "numeric", month: "long" })}
                          </p>
                        </div>
                        <EmojiIcon emoji="🏁" label="" className="text-lg opacity-50" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Estado vacío */}
        {allTrips.length === 0 && (
          <div className="text-center py-10">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-[rgb(var(--color-bg-tertiary))] flex items-center justify-center">
              <EmojiIcon emoji="🗺️" label="Sin viajes" className="text-3xl opacity-50" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-[rgb(var(--color-text-primary))] mb-2">
              No tienes viajes aún
            </h3>
            <p className="text-sm text-[rgb(var(--color-text-secondary))] mb-4">
              Comienza a planificar tu próxima aventura
            </p>
            <Link href="/setup?create=true" className="btn-primary inline-flex">
              <EmojiIcon emoji="➕" label="" className="text-base" />
              Crear tu primer viaje
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
