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
    <div className="card-elevated p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="text-2xl">
          {initialTrip ? "✏️" : "➕"}
        </div>
        <h2 className="text-base font-bold text-gray-900">
          {initialTrip ? "Editar viaje" : "Nuevo viaje"}
        </h2>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 animate-in">
            <span className="text-lg">⚠️</span>
            <p className="text-sm text-rose-200">{error}</p>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-semibold text-gray-700">
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
            className="input"
            placeholder="Ej: Vacaciones en Europa"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="startDate"
              className="text-sm font-semibold text-gray-700"
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
              className="input"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="endDate"
              className="text-sm font-semibold text-gray-700"
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
              className="input"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="destinations"
            className="text-sm font-semibold text-slate-300"
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
            className="textarea"
            placeholder="Ej: Paris, Roma, Barcelona"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⏳</span>
              Guardando...
            </span>
          ) : (
            <>
              {initialTrip ? "Actualizar viaje" : "Crear viaje"}
            </>
          )}
        </button>
      </form>
    </div>
  );
}
