"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "../ui/Card";
import BlockTypeSelect from "./BlockTypeSelect";
import { FormInput, FormTextarea } from "../ui/FormInput";
import ErrorAlert from "../ui/ErrorAlert";
import LoadingButton from "../ui/LoadingButton";

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
    <Card variant="default" padding="md" className="mt-6">
      <form onSubmit={submitNew} className="grid gap-3">
        <div className="grid gap-3 sm:grid-cols-[1fr_1fr_1.5fr]">
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
          />
        </div>

        <FormTextarea
          label="Descripción"
          rows={3}
          placeholder="Detalles o notas."
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />

        <ErrorAlert error={error} />

        <LoadingButton
          type="submit"
          isLoading={isSubmitting}
          loadingText="Guardando..."
          variant="primary"
        >
          Agregar elemento
        </LoadingButton>
      </form>
    </Card>
  );
}
