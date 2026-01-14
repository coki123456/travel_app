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
      className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg shadow-black/30"
    >
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-100">
            {initialTrip ? "Editar viaje" : "Nuevo viaje"}
          </h2>
          {initialTrip ? (
            <button
              type="button"
              onClick={() => router.push("/setup")}
              className="text-xs font-semibold text-slate-400 transition hover:text-slate-200"
            >
              Cancelar
            </button>
          ) : null}
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-200">
            Nombre del viaje
          </label>
          <input
            className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/40 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400/70"
            placeholder="Ej: Viaje a la Patagonia"
            value={form.name}
            onChange={updateField("name")}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-semibold text-slate-200">
              Fecha de inicio
            </label>
            <input
              type="date"
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/40 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400/70"
              value={form.startDate}
              onChange={updateField("startDate")}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-200">
              Fecha de fin
            </label>
            <input
              type="date"
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/40 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400/70"
              value={form.endDate}
              onChange={updateField("endDate")}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-200">
            Destinos (opcional)
          </label>
          <textarea
            rows={3}
            className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/40 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400/70"
            placeholder="Ej: Bariloche, Villa La Angostura"
            value={form.destinations}
            onChange={updateField("destinations")}
          />
        </div>

        {error ? (
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
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
