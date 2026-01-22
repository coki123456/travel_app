"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormInput, FormTextarea } from "../../components/ui/FormInput";
import ErrorAlert from "../../components/ui/ErrorAlert";
import LoadingButton from "../../components/ui/LoadingButton";

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
    <div className="card p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-[var(--radius-md)] bg-gradient-to-br from-[rgb(var(--color-accent))] to-[rgb(var(--color-accent-hover))] flex items-center justify-center shadow-[var(--shadow-sm)]">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <h3 className="text-base font-semibold text-[rgb(var(--color-text-primary))]">
            Detalles del día
          </h3>
          <p className="text-xs text-[rgb(var(--color-text-secondary))]">
            Ciudad, resumen y notas
          </p>
        </div>
      </div>

      <div className="divider mb-4"></div>

      <form onSubmit={onSubmit} className="space-y-4">
        <FormInput
          label="Ciudad"
          placeholder="Ej: Bariloche"
          value={city}
          onChange={(event) => setCity(event.target.value)}
          helper="¿En qué ciudad estás?"
        />

        <FormTextarea
          label="Resumen del día"
          rows={3}
          placeholder="Ej: Trekking y cena en el centro"
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
          helper="Un resumen breve de las actividades"
        />

        <FormTextarea
          label="Diario del día"
          rows={6}
          placeholder="Escribí tus pensamientos, experiencias y recuerdos..."
          value={journal}
          onChange={(event) => setJournal(event.target.value)}
          helper="Notas más detalladas (opcional)"
        />

        <ErrorAlert error={error} />

        <LoadingButton
          type="submit"
          isLoading={isSubmitting}
          loadingText="Guardando..."
          variant="primary"
          className="w-full"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Guardar día
        </LoadingButton>
      </form>
    </div>
  );
}
