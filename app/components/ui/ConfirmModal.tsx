"use client";

import { useEffect, useRef, useState } from "react";
import { EmojiIcon } from "./EmojiIcon";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  isDangerous = false,
  isLoading = false,
}: ConfirmModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Trap focus dentro del modal
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center animate-fade-in">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={isLoading ? undefined : onClose}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative bg-[rgb(var(--color-bg-secondary))] rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-scale-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="p-6 border-b border-[rgb(var(--color-border-light))]">
          <div className="flex items-start gap-3">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                isDangerous
                  ? "bg-[rgb(var(--color-error))]/10"
                  : "bg-[rgb(var(--color-accent))]/10"
              }`}
            >
              <EmojiIcon
                emoji={isDangerous ? "⚠️" : "❓"}
                label={isDangerous ? "Advertencia" : "Confirmación"}
                className={`text-2xl ${
                  isDangerous ? "text-[rgb(var(--color-error))]" : "text-[rgb(var(--color-accent))]"
                }`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h2
                id="modal-title"
                className="text-lg font-semibold text-[rgb(var(--color-text-primary))]"
              >
                {title}
              </h2>
              <p className="mt-2 text-sm text-[rgb(var(--color-text-secondary))]">
                {message}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`btn flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
              isDangerous
                ? "bg-[rgb(var(--color-error))] hover:bg-[rgb(var(--color-error))]/90 text-white"
                : "btn-primary"
            }`}
          >
            {isLoading && <span className="animate-spin">⏳</span>}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

// Hook para usar el modal de confirmación
export function useConfirmModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
    isDangerous?: boolean;
  } | null>(null);

  const openModal = (modalConfig: {
    title: string;
    message: string;
    onConfirm: () => void;
    isDangerous?: boolean;
  }) => {
    setConfig(modalConfig);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setTimeout(() => setConfig(null), 300); // Esperar animación
  };

  const handleConfirm = () => {
    config?.onConfirm();
    closeModal();
  };

  return {
    isOpen,
    openModal,
    closeModal,
    handleConfirm,
    config,
  };
}
