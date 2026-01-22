"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormInput, FormTextarea } from "../components/ui/FormInput";
import ErrorAlert from "../components/ui/ErrorAlert";
import LoadingButton from "../components/ui/LoadingButton";
import { Icon } from "../components/ui/Icon";

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
    <div className="card p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-[var(--radius-md)] bg-gradient-to-br from-[rgb(var(--color-accent))] to-[rgb(var(--color-accent-hover))] flex items-center justify-center shadow-[var(--shadow-sm)]">
          <Icon
            name={initialTrip ? "edit" : "plus"}
            label={initialTrip ? "Editar viaje" : "Crear viaje"}
            className="w-5 h-5 text-white"
            strokeWidth={2}
          />
        </div>
        <div>
          <h2 className="text-base font-semibold text-[rgb(var(--color-text-primary))]">
            {initialTrip ? "Editar viaje" : "Nuevo viaje"}
          </h2>
          <p className="text-xs text-[rgb(var(--color-text-secondary))]">
            {initialTrip ? "Actualizá la información del viaje" : "Creá un nuevo viaje para comenzar"}
          </p>
        </div>
      </div>

      <div className="divider mb-4"></div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <ErrorAlert error={error} />

        <FormInput
          label="Nombre del viaje"
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          maxLength={100}
          placeholder="Ej: Vacaciones en Europa"
          helper="Un nombre descriptivo para tu viaje"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormInput
            label="Fecha de inicio"
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
          />

          <FormInput
            label="Fecha de fin"
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
          />
        </div>

        <FormTextarea
          label="Destinos"
          id="destinations"
          name="destinations"
          value={formData.destinations}
          onChange={handleChange}
          required
          maxLength={500}
          rows={3}
          placeholder="Ej: París, Roma, Barcelona"
          helper="Listá los destinos principales"
        />

        <LoadingButton
          type="submit"
          isLoading={loading}
          loadingText="Guardando..."
          variant="primary"
          className="w-full"
        >
          <Icon name="check" label="Guardar" className="w-4 h-4" strokeWidth={2} />
          {initialTrip ? "Actualizar viaje" : "Crear viaje"}
        </LoadingButton>
      </form>
    </div>
  );
}
