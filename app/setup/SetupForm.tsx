"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type InitialTrip = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  destinations: string | null;
} | null;

type Props = {
  initialTrip: InitialTrip;
};

export default function SetupForm({ initialTrip }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: initialTrip?.name ?? "",
    startDate: initialTrip?.startDate ?? "",
    endDate: initialTrip?.endDate ?? "",
    destinations: initialTrip?.destinations ?? "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const method = initialTrip ? "PUT" : "POST";
      const url = initialTrip ? `/api/trip/${initialTrip.id}` : "/api/trip";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(data?.error ?? "Error al guardar el viaje.");
        return;
      }

      const data = await response.json();

      // Establecer el viaje como activo
      await fetch("/api/trip/active", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: data.id }),
      });

      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Error al guardar viaje:", err);
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg shadow-black/30">
      <h2 className="text-lg font-semibold text-slate-100">
        {initialTrip ? "Editar viaje" : "Nuevo viaje"}
      </h2>
      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
        {error && (
          <div className="rounded-xl border border-red-800 bg-red-900/20 p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-medium text-slate-200">
            Nombre del viaje
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            maxLength={100}
            className="rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-2 text-slate-100 placeholder:text-slate-500 focus:border-slate-500 focus:outline-none"
            placeholder="Ej: Vacaciones en Europa"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="startDate"
              className="text-sm font-medium text-slate-200"
            >
              Fecha de inicio
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              className="rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-2 text-slate-100 focus:border-slate-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="endDate"
              className="text-sm font-medium text-slate-200"
            >
              Fecha de fin
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              className="rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-2 text-slate-100 focus:border-slate-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="destinations"
            className="text-sm font-medium text-slate-200"
          >
            Destinos
          </label>
          <textarea
            id="destinations"
            name="destinations"
            value={formData.destinations}
            onChange={handleChange}
            required
            maxLength={500}
            rows={3}
            className="rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-2 text-slate-100 placeholder:text-slate-500 focus:border-slate-500 focus:outline-none"
            placeholder="Ej: Paris, Roma, Barcelona"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Guardando..."
            : initialTrip
            ? "Actualizar viaje"
            : "Crear viaje"}
        </button>
      </form>
    </div>
  );
}
