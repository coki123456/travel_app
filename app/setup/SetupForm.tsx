"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type FormState = {
  name: string;
  startDate: string;
  endDate: string;
  destinations: string;
};

type SetupFormProps = {
  initialTrip?: {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    destinations: string | null;
  } | null;
};

const emptyState: FormState = {
  name: "",
  startDate: "",
  endDate: "",
  destinations: "",
};

export default function SetupForm({ initialTrip }: SetupFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(emptyState);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialTrip) {
      setForm({
        name: initialTrip.name,
        startDate: initialTrip.startDate,
        endDate: initialTrip.endDate,
        destinations: initialTrip.destinations ?? "",
      });
    } else {
      setForm(emptyState);
    }
  }, [initialTrip]);

  const updateField =
    (key: keyof FormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: event.target.value }));
    };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!form.name || !form.startDate || !form.endDate) {
      setError("Completa nombre, fecha de inicio y fecha de fin.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: initialTrip?.id,
          name: form.name,
          startDate: form.startDate,
          endDate: form.endDate,
          destinations: form.destinations,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(data?.error ?? "No se pudo guardar el viaje.");
        return;
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm"
    >
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900">
            {initialTrip ? "Editar viaje" : "Nuevo viaje"}
          </h2>
          {initialTrip ? (
            <button
              type="button"
              onClick={() => router.push("/setup")}
              className="text-xs font-semibold text-zinc-500 transition hover:text-zinc-700"
            >
              Cancelar
            </button>
          ) : null}
        </div>

        <div>
          <label className="text-sm font-semibold text-zinc-700">
            Nombre del viaje
          </label>
          <input
            className="mt-2 w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400"
            placeholder="Ej: Viaje a la Patagonia"
            value={form.name}
            onChange={updateField("name")}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-semibold text-zinc-700">
              Fecha de inicio
            </label>
            <input
              type="date"
              className="mt-2 w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400"
              value={form.startDate}
              onChange={updateField("startDate")}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-zinc-700">
              Fecha de fin
            </label>
            <input
              type="date"
              className="mt-2 w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400"
              value={form.endDate}
              onChange={updateField("endDate")}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-zinc-700">
            Destinos (opcional)
          </label>
          <textarea
            rows={3}
            className="mt-2 w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400"
            placeholder="Ej: Bariloche, Villa La Angostura"
            value={form.destinations}
            onChange={updateField("destinations")}
          />
        </div>

        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting
            ? "Guardando..."
            : initialTrip
            ? "Guardar cambios"
            : "Crear viaje"}
        </button>
      </div>
    </form>
  );
}
