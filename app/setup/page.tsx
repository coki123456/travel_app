import Link from "next/link";
import prisma from "@/lib/prisma";
import SetupForm from "./SetupForm";

export default async function SetupPage() {
  const trip = await prisma.trip.findFirst();

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-12 text-zinc-900">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <header className="flex flex-col gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400">
            App Viaje
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
            Configurar viaje
          </h1>
          <p className="max-w-2xl text-sm text-zinc-600 sm:text-base">
            Cargá la info principal del viaje para empezar a planificar el
            calendario y los bloques diarios.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <section className="flex flex-col gap-4">
            {trip ? (
              <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-zinc-900">
                  Ya hay un viaje configurado
                </h2>
                <p className="mt-2 text-sm text-zinc-600">
                  {trip.name} ({trip.startDate.toDateString()} -{" "}
                  {trip.endDate.toDateString()})
                </p>
                {trip.destinations ? (
                  <p className="mt-2 text-sm text-zinc-500">
                    Destinos: {trip.destinations}
                  </p>
                ) : null}
                <Link
                  href="/"
                  className="mt-5 inline-flex items-center justify-center rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
                >
                  Ir al calendario
                </Link>
              </div>
            ) : (
              <SetupForm />
            )}
          </section>

          <aside className="flex flex-col gap-4">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-zinc-900">
                Qué podés hacer
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-zinc-600">
                <li>Definir fechas del viaje.</li>
                <li>Cargar destinos principales.</li>
                <li>Empezar el calendario día por día.</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-zinc-900">
                Siguiente paso
              </h3>
              <p className="mt-3 text-sm text-zinc-600">
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
