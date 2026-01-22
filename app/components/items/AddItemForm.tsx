"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "../ui/Card";
import BlockTypeSelect from "./BlockTypeSelect";
import { FormInput, FormTextarea } from "../ui/FormInput";
import ErrorAlert from "../ui/ErrorAlert";
import LoadingButton from "../ui/LoadingButton";
import { Icon } from "../ui/Icon";

interface AddItemFormProps {
  date: string;
}

export default function AddItemForm({ date }: AddItemFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("NOTE");
  const [block, setBlock] = useState("ALL_DAY");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setType("NOTE");
    setBlock("ALL_DAY");
  };

  const submitNew = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Completa el título.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          block,
          type,
          title,
          description,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(data?.error ?? "No se pudo guardar el elemento.");
        return;
      }

      resetForm();
      router.refresh();
    } catch (err) {
      console.error("Error al crear elemento:", err);
      setError("No se pudo conectar con el servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card variant="default" padding="md" className="mt-6 animate-fade-in">
      <div className="mb-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-[var(--radius-md)] bg-gradient-to-br from-[rgb(var(--color-accent))] to-[rgb(var(--color-accent-hover))] flex items-center justify-center shadow-[var(--shadow-sm)]">
          <Icon name="plus" label="Nuevo elemento" className="w-5 h-5 text-white" strokeWidth={2} />
        </div>
        <div>
          <h3 className="text-base font-semibold text-[rgb(var(--color-text-primary))]">
            Nuevo elemento
          </h3>
          <p className="text-xs text-[rgb(var(--color-text-secondary))]">
            Agregá actividades, notas o recordatorios
          </p>
        </div>
      </div>

      <div className="divider mb-4"></div>

      <form onSubmit={submitNew} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <BlockTypeSelect
            block={block}
            type={type}
            onBlockChange={setBlock}
            onTypeChange={setType}
          />

          <FormInput
            label="Título"
            placeholder="Ej: Check-in del hotel"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            helper="¿Qué vas a hacer?"
          />
        </div>

        <FormTextarea
          label="Descripción"
          rows={3}
          placeholder="Añadí detalles, horarios, direcciones..."
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          helper="Opcional: información adicional útil"
        />

        <ErrorAlert error={error} />

        <LoadingButton
          type="submit"
          isLoading={isSubmitting}
          loadingText="Guardando..."
          variant="primary"
          className="w-full"
        >
          <Icon name="plus" label="Agregar elemento" className="w-4 h-4" strokeWidth={2} />
          Agregar elemento
        </LoadingButton>
      </form>
    </Card>
  );
}
