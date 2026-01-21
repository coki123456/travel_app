"use client";

import { useState } from "react";
import { Card } from "../ui/Card";

type ItemView = {
  id: string;
  title: string;
  description: string | null;
  type: string;
  block: string;
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

interface ItemCardProps {
  item: ItemView;
  onUpdate: () => void;
  onDelete: () => void;
  isSubmitting: boolean;
}

export default function ItemCard({
  item,
  onUpdate,
  onDelete,
  isSubmitting,
}: ItemCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(item.title);
  const [editDescription, setEditDescription] = useState(item.description ?? "");
  const [editType, setEditType] = useState(item.type);
  const [editBlock, setEditBlock] = useState(item.block);

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/items/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
          type: editType,
          block: editBlock,
        }),
      });

      if (response.ok) {
        setIsEditing(false);
        onUpdate();
      }
    } catch (err) {
      console.error("Error al editar elemento:", err);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditTitle(item.title);
    setEditDescription(item.description ?? "");
    setEditType(item.type);
    setEditBlock(item.block);
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Eliminar este elemento?");
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/items/${item.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onDelete();
      }
    } catch (err) {
      console.error("Error al eliminar elemento:", err);
    }
  };

  return (
    <Card variant="default" padding="md" className="shadow-lg shadow-black/20">
      {isEditing ? (
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-slate-300">
                Bloque
              </label>
              <select
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-400/70"
                value={editBlock}
                onChange={(e) => setEditBlock(e.target.value)}
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
                onChange={(e) => setEditType(e.target.value)}
              >
                {ITEM_TYPES.map((option) => (
                  <option key={option.value} value={option.value}>
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
              onChange={(e) => setEditTitle(e.target.value)}
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
              onChange={(e) => setEditDescription(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSubmitting}
              className="rounded-xl bg-cyan-400 px-4 py-2 text-xs font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={handleCancel}
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
          {item.description && (
            <p className="mt-2 text-sm text-slate-300">{item.description}</p>
          )}
          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="rounded-xl border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-slate-500"
            >
              Editar
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="rounded-xl border border-rose-500/40 px-3 py-2 text-xs font-semibold text-rose-200 transition hover:border-rose-400"
            >
              Eliminar
            </button>
          </div>
        </>
      )}
    </Card>
  );
}
