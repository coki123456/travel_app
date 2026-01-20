"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type ItemView = {
  id: string;
  title: string;
  description: string | null;
  type: string;
  block: string;
};

type ItemsBoardProps = {
  date: string;
  items: ItemView[];
};

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

const getTypeLabel = (value: string) =>
  ITEM_TYPES.find((type) => type.value === value)?.label ?? value;

export default function ItemsBoard({ date, items }: ItemsBoardProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("NOTE");
  const [block, setBlock] = useState("ALL_DAY");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editType, setEditType] = useState("NOTE");
  const [editBlock, setEditBlock] = useState("ALL_DAY");

  const grouped = useMemo(() => {
    return BLOCKS.map((blockItem) => ({
      block: blockItem.value,
      label: blockItem.label,
      items: items.filter((item) => item.block === blockItem.value),
    }));
  }, [items]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setType("NOTE");
    setBlock("ALL_DAY");
  };

  const startEdit = (item: ItemView) => {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditDescription(item.description ?? "");
    setEditType(item.type);
    setEditBlock(item.block);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditDescription("");
    setEditType("NOTE");
    setEditBlock("ALL_DAY");
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

  const submitEdit = async () => {
    if (!editingId) return;

    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/items/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
          type: editType,
          block: editBlock,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(data?.error ?? "No se pudo guardar el elemento.");
        return;
      }

      cancelEdit();
      router.refresh();
    } catch (err) {
      console.error("Error al editar elemento:", err);
      setError("No se pudo conectar con el servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteItem = async (id: string) => {
    const confirmed = window.confirm("Eliminar este elemento?");
    if (!confirmed) return;

    setError(null);
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/items/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(data?.error ?? "No se pudo eliminar el elemento.");
        return;
      }

      router.refresh();
    } catch (err) {
      console.error("Error al eliminar elemento:", err);
      setError("No se pudo conectar con el servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg shadow-black/30">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-100">Elementos del día</h2>
        <span className="text-xs uppercase tracking-[0.2em] text-slate-500">
          {items.length} elementos
        </span>
      </div>

      <div className="mt-5 space-y-6">
        {grouped.map((group) => (
          <div key={group.block} className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="uppercase tracking-[0.3em]">{group.label}</span>
              <span>{group.items.length}</span>
            </div>
            {group.items.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-4 text-sm text-slate-400">
                Sin elementos todavía.
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {group.items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-lg shadow-black/20"
                  >
                    {editingId === item.id ? (
                      <div className="space-y-3">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div>
                            <label className="text-xs font-semibold text-slate-300">
                              Bloque
                            </label>
                            <select
                              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-400/70"
                              value={editBlock}
                              onChange={(event) =>
                                setEditBlock(event.target.value)
                              }
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
                              value={editType}
                              onChange={(event) =>
                                setEditType(event.target.value)
                              }
                            >
                              {ITEM_TYPES.map((option) => (
                                <option
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-slate-300">
                            Título
                          </label>
                          <input
                            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-400/70"
                            value={editTitle}
                            onChange={(event) =>
                              setEditTitle(event.target.value)
                            }
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-slate-300">
                            Descripción
                          </label>
                          <textarea
                            rows={3}
                            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-400/70"
                            value={editDescription}
                            onChange={(event) =>
                              setEditDescription(event.target.value)
                            }
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={submitEdit}
                            disabled={isSubmitting}
                            className="rounded-xl bg-cyan-400 px-4 py-2 text-xs font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            Guardar
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-slate-500"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span className="uppercase tracking-[0.2em]">
                            {getTypeLabel(item.type)}
                          </span>
                        </div>
                        <h3 className="mt-2 text-sm font-semibold text-slate-100">
                          {item.title}
                        </h3>
                        {item.description ? (
                          <p className="mt-2 text-sm text-slate-300">
                            {item.description}
                          </p>
                        ) : null}
                        <div className="mt-4 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(item)}
                            className="rounded-xl border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-slate-500"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteItem(item.id)}
                            className="rounded-xl border border-rose-500/40 px-3 py-2 text-xs font-semibold text-rose-200 transition hover:border-rose-400"
                          >
                            Eliminar
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={submitNew} className="mt-6 grid gap-3">
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className="text-xs font-semibold text-slate-300">Bloque</label>
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
            <label className="text-xs font-semibold text-slate-300">Tipo</label>
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
          {isSubmitting ? "Guardando..." : "Agregar elemento"}
        </button>
      </form>
    </div>
  );
}


