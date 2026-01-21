"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "../ui/Card";

const BLOCKS = [
  { value: "ALL_DAY", label: "Todo el día" },
  { value: "MORNING", label: "Mañana" },
  { value: "AFTERNOON", label: "Tarde" },
  { value: "EVENING", label: "Noche" },
];

const ITEM_TYPES = [
  { value: "HOTEL", label: "Hotel" },
  { value: "FLIGHT", label: "Vuelo" },
  { value: "ATTRACTION", label: "Atraccion" },
  { value: "FOOD", label: "Comida" },
  { value: "TRANSFER", label: "Traslado" },
  { value: "NOTE", label: "Nota" },
];

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
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className="text-xs font-semibold text-slate-300">
              Bloque
            </label>
            <select
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-400/70"
              value={block}
              onChange={(event) => setBlock(event.target.value)}
            >
              {BLOCKS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-300">
              Tipo
            </label>
            <select
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-400/70"
              value={type}
              onChange={(event) => setType(event.target.value)}
            >
              {ITEM_TYPES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-300">
              Título
            </label>
            <input
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-400/70"
              placeholder="Ej: Check-in del hotel"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-300">
            Descripción
          </label>
          <textarea
            rows={3}
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-400/70"
            placeholder="Detalles o notas."
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>

        {error && (
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Guardando..." : "Agregar elemento"}
        </button>
      </form>
    </Card>
  );
}
