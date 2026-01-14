"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type DayFormProps = {
  date: string;
  initialCity: string | null;
  initialSummary: string | null;
  initialJournal: string | null;
};

export default function DayForm({
  date,
  initialCity,
  initialSummary,
  initialJournal,
}: DayFormProps) {
  const router = useRouter();
  const [city, setCity] = useState(initialCity ?? "");
  const [summary, setSummary] = useState(initialSummary ?? "");
  const [journal, setJournal] = useState(initialJournal ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/days", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          city,
          summary,
          journal,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(data?.error ?? "No se pudo guardar el dia.");
        return;
      }

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
        <div>
          <label className="text-sm font-semibold text-slate-200">
            Ciudad (opcional)
          </label>
          <input
            className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/40 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400/70"
            placeholder="Ej: Bariloche"
            value={city}
            onChange={(event) => setCity(event.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-200">
            Resumen del dia
          </label>
          <textarea
            rows={3}
            className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/40 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400/70"
            placeholder="Ej: Trekking y cena en el centro."
            value={summary}
            onChange={(event) => setSummary(event.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-200">
            Diario del dia
          </label>
          <textarea
            rows={6}
            className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/40 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400/70"
            placeholder="Notas mas largas del dia."
            value={journal}
            onChange={(event) => setJournal(event.target.value)}
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
          {isSubmitting ? "Guardando..." : "Guardar dia"}
        </button>
      </div>
    </form>
  );
}
