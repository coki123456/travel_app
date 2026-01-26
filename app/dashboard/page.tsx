import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import Link from "next/link";
import { EmojiIcon } from "../components/ui/EmojiIcon";
import { Card, CardContent } from "../components/ui/Card";
import LogoutButton from "../LogoutButton";
import TopNav from "../components/TopNav";

export const dynamic = "force-dynamic";

type SearchParams = {
  compact?: string;
};

const palette = [
  "from-[rgb(20,136,158)] to-[rgb(14,120,141)]",
  "from-[rgb(255,124,74)] to-[rgb(242,108,58)]",
  "from-[rgb(108,99,255)] to-[rgb(80,68,189)]",
  "from-[rgb(255,184,122)] to-[rgb(255,148,94)]",
  "from-[rgb(45,198,163)] to-[rgb(34,160,130)]",
];

function getCoverGradient(index: number) {
  return palette[index % palette.length];
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
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

  const resolvedSearchParams = await searchParams;
  const compact = resolvedSearchParams?.compact === "true";
  const toggleCompactHref = compact ? "/dashboard" : "/dashboard?compact=true";

  const today = new Date();
  const upcomingTrips = allTrips.filter(trip => trip.endDate >= today);
  const pastTrips = allTrips.filter(trip => trip.endDate < today);

  const headerPadding = compact ? "px-3 py-2.5" : "px-3 py-3";
  const headerInner = compact ? "max-w-lg" : "max-w-xl";
  const containerWidth = compact ? "max-w-lg" : "max-w-xl";
  const cardPadding = compact ? "p-2.5" : "p-3";
  const actionPadding = compact ? "p-2.5" : "p-3";

  return (
    <div className="min-h-screen bg-[rgb(var(--color-bg-primary))] pb-24">
      <TopNav />
      {/* Header con perfil */}
      <div className={`bg-gradient-to-br from-[rgb(var(--color-accent))] to-[rgb(var(--color-accent-hover))] text-white ${headerPadding}`}>
        <div className={`${headerInner} mx-auto`}>
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
      <div className={`${containerWidth} mx-auto px-4 -mt-4 space-y-6`}>
        <div className="flex items-center justify-between text-[13px] text-[rgb(var(--color-text-secondary))]">
          <span>Resumen de viajes</span>
          <Link href={toggleCompactHref} className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--color-border-light))] px-3 py-1.5 text-xs font-semibold hover:border-[rgb(var(--color-accent))] hover:text-[rgb(var(--color-accent))] transition-colors">
            {compact ? "Vista amplia" : "Modo compacto"}
          </Link>
        </div>

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
              {upcomingTrips.map((trip, idx) => {
                const isActiveTrip = trip.id === activeTripId;
                const cover = getCoverGradient(idx);
                const stateBadge = isActiveTrip ? "Activo" : "Próximo";
                return (
                  <Link key={trip.id} href={`/setup`} className="block reveal" style={{ ["--reveal-delay" as string]: `${idx * 80}ms` }}>
                    <Card variant="default" className="hover:shadow-lg transition-all">
                      <CardContent className={`${cardPadding}`}>
                        <div className="flex items-start gap-3">
                          <div className={`h-14 w-14 flex-shrink-0 rounded-xl bg-gradient-to-br ${cover} text-white flex items-center justify-center text-xl font-semibold shadow-md`}>
                            <EmojiIcon emoji="✈️" label="" className="text-xl" />
                          </div>
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center gap-2 justify-between">
                              <h3 className="font-semibold text-[rgb(var(--color-text-primary))] text-sm sm:text-base truncate">
                                {trip.name}
                              </h3>
                              <span className={`badge ${isActiveTrip ? "badge-accent" : ""}`}>
                                {stateBadge}
                              </span>
                            </div>
                            {trip.destinations && (
                              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-[rgb(var(--color-text-secondary))]">
                                <EmojiIcon emoji="📍" label="Destino" className="text-xs" />
                                <span className="truncate">{trip.destinations}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[rgb(var(--color-text-tertiary))]">
                              <EmojiIcon emoji="📅" label="Fechas" className="text-[10px]" />
                              <span>
                                {trip.startDate.toLocaleDateString("es-AR", { day: "numeric", month: "short" })} - {trip.endDate.toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
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
                <CardContent className={`${actionPadding} flex flex-col items-center justify-center text-center gap-2`}>
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
                <CardContent className={`${actionPadding} flex flex-col items-center justify-center text-center gap-2`}>
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
              {pastTrips.map((trip, idx) => (
                <Link key={trip.id} href={`/setup`} className="block reveal" style={{ ["--reveal-delay" as string]: `${idx * 80}ms` }}>
                  <Card variant="default" className="hover:shadow-md transition-all opacity-80">
                    <CardContent className={`${cardPadding}`}>
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
