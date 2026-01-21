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
        setError(data?.error ?? "No se pudo guardar el día.");
        return;
      }

      router.refresh();
    } catch (err) {
      console.error("Error al guardar el día:", err);
      setError("No se pudo conectar con el servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="card-elevated p-6"
    >
      <div className="flex flex-col gap-5">
        <div>
          <label className="text-sm font-semibold text-gray-700">
            Ciudad (opcional)
          </label>
          <input
            className="input mt-2"
            placeholder="Ej: Bariloche"
            value={city}
            onChange={(event) => setCity(event.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700">
            Resumen del día
          </label>
          <textarea
            rows={3}
            className="textarea mt-2"
            placeholder="Ej: Trekking y cena en el centro."
            value={summary}
            onChange={(event) => setSummary(event.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700">
            Diario del día
          </label>
          <textarea
            rows={6}
            className="textarea mt-2"
            placeholder="Notas más largas del día."
            value={journal}
            onChange={(event) => setJournal(event.target.value)}
          />
        </div>

        {error ? (
          <div className="rounded-lg border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Guardando..." : "Guardar día"}
        </button>
      </div>
    </form>
  );
}
