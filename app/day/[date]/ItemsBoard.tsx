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
  { value: "ALL_DAY", label: "Todo el dia" },
  { value: "MORNING", label: "Manana" },
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
      setError("Completa el titulo.");
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
      setError("No se pudo conectar con el servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-900">Elementos del dia</h2>
        <span className="text-xs uppercase tracking-[0.2em] text-zinc-400">
          {items.length} elementos
        </span>
      </div>

      <div className="mt-5 space-y-6">
        {grouped.map((group) => (
          <div key={group.block} className="space-y-3">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="uppercase tracking-[0.3em]">{group.label}</span>
              <span>{group.items.length}</span>
            </div>
            {group.items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-500">
              Sin elementos todavia.
            </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {group.items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
                  >
                    {editingId === item.id ? (
                      <div className="space-y-3">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div>
                            <label className="text-xs font-semibold text-zinc-600">
                              Bloque
                            </label>
                            <select
                              className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-400"
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
                            <label className="text-xs font-semibold text-zinc-600">
                              Tipo
                            </label>
                            <select
                              className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-400"
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
                          <label className="text-xs font-semibold text-zinc-600">
                            Titulo
                          </label>
                          <input
                            className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-400"
                            value={editTitle}
                            onChange={(event) =>
                              setEditTitle(event.target.value)
                            }
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-zinc-600">
                            Descripcion
                          </label>
                          <textarea
                            rows={3}
                            className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-400"
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
                            className="rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            Guardar
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="rounded-xl border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-600 transition hover:border-zinc-300"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between text-xs text-zinc-500">
                          <span className="uppercase tracking-[0.2em]">
                            {getTypeLabel(item.type)}
                          </span>
                        </div>
                        <h3 className="mt-2 text-sm font-semibold text-zinc-900">
                          {item.title}
                        </h3>
                        {item.description ? (
                          <p className="mt-2 text-sm text-zinc-600">
                            {item.description}
                          </p>
                        ) : null}
                        <div className="mt-4 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(item)}
                            className="rounded-xl border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-600 transition hover:border-zinc-300"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteItem(item.id)}
                            className="rounded-xl border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600 transition hover:border-rose-300"
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
            <label className="text-xs font-semibold text-zinc-600">Bloque</label>
            <select
              className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-400"
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
            <label className="text-xs font-semibold text-zinc-600">Tipo</label>
            <select
              className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-400"
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
            <label className="text-xs font-semibold text-zinc-600">
              Titulo
            </label>
            <input
              className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-400"
              placeholder="Ej: Check-in del hotel"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-zinc-600">
            Descripcion
          </label>
          <textarea
            rows={3}
            className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-400"
            placeholder="Detalles o notas."
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>

        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Guardando..." : "Agregar elemento"}
        </button>
      </form>
    </div>
  );
}


