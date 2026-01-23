"use client";

import { useState } from "react";
import { Card } from "../ui/Card";
import { getTypeLabel } from "@/lib/constants";
import BlockTypeSelect from "./BlockTypeSelect";
import { FormInput, FormTextarea } from "../ui/FormInput";
import LoadingButton from "../ui/LoadingButton";
import { EmojiIcon } from "../ui/EmojiIcon";

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
    <Card variant="hover" padding="md" className="animate-fade-in">
      {isEditing ? (
        <div className="space-y-4">
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
            required
          />

          <FormTextarea
            label="Descripción"
            rows={3}
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            helper="Opcional: añade detalles adicionales"
          />

          <div className="flex items-center gap-2 pt-2">
            <LoadingButton
              onClick={handleSave}
              isLoading={isSubmitting}
              loadingText="Guardando..."
              variant="primary"
              className="text-xs flex-1"
            >
              Guardar cambios
            </LoadingButton>
            <button
              type="button"
              onClick={handleCancel}
              className="btn-secondary text-xs flex-1"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-3">
            <span className="badge badge-accent text-xs uppercase tracking-wider">
              {getTypeLabel(item.type)}
            </span>
          </div>

          <h3 className="text-base font-semibold text-[rgb(var(--color-text-primary))] mb-2">
            {item.title}
          </h3>

          {item.description && (
            <p className="text-sm text-[rgb(var(--color-text-secondary))] leading-relaxed mb-4">
              {item.description}
            </p>
          )}

          <div className="flex items-center gap-2 pt-2 border-t border-[rgb(var(--color-border-light))]">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="btn-secondary text-xs flex-1"
            >
              <EmojiIcon emoji="✏️" label="Editar" className="text-base" />
              Editar
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="btn-secondary text-xs text-[rgb(var(--color-error))] hover:bg-[rgb(var(--color-error))]/5"
            >
              <EmojiIcon emoji="🗑️" label="Eliminar" className="text-base" />
              Eliminar
            </button>
          </div>
        </>
      )}
    </Card>
  );
}
