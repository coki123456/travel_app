"use client";

import { useState } from "react";
import { Card } from "../ui/Card";
import { getTypeLabel } from "@/lib/constants";
import BlockTypeSelect from "./BlockTypeSelect";
import { FormInput, FormTextarea } from "../ui/FormInput";
import LoadingButton from "../ui/LoadingButton";

type ItemView = {
  id: string;
  title: string;
  description: string | null;
  type: string;
  block: string;
};

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
          <BlockTypeSelect
            block={editBlock}
            type={editType}
            onBlockChange={setEditBlock}
            onTypeChange={setEditType}
          />

          <FormInput
            label="Título"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />

          <FormTextarea
            label="Descripción"
            rows={3}
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
          />

          <div className="flex items-center gap-2">
            <LoadingButton
              onClick={handleSave}
              isLoading={isSubmitting}
              loadingText="Guardando..."
              variant="primary"
              className="rounded-xl px-4 py-2 text-xs"
            >
              Guardar
            </LoadingButton>
            <LoadingButton
              onClick={handleCancel}
              variant="secondary"
              className="rounded-xl px-4 py-2 text-xs"
            >
              Cancelar
            </LoadingButton>
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
