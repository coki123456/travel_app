"use client";

import { useEffect, useState } from "react";
import { EmojiIcon } from "./EmojiIcon";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

const toastConfig = {
  success: {
    icon: "✓",
    bgColor: "bg-[rgb(var(--color-success))]/10",
    borderColor: "border-[rgb(var(--color-success))]/30",
    textColor: "text-[rgb(var(--color-success))]",
  },
  error: {
    icon: "✕",
    bgColor: "bg-[rgb(var(--color-error))]/10",
    borderColor: "border-[rgb(var(--color-error))]/30",
    textColor: "text-[rgb(var(--color-error))]",
  },
  warning: {
    icon: "⚠",
    bgColor: "bg-[rgb(var(--color-warning))]/10",
    borderColor: "border-[rgb(var(--color-warning))]/30",
    textColor: "text-[rgb(var(--color-warning))]",
  },
  info: {
    icon: "ℹ",
    bgColor: "bg-[rgb(var(--color-accent))]/10",
    borderColor: "border-[rgb(var(--color-accent))]/30",
    textColor: "text-[rgb(var(--color-accent))]",
  },
};

export function Toast({ message, type = "info", duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const config = toastConfig[type];

  useEffect(() => {
    // Animación de entrada
    setTimeout(() => setIsVisible(true), 10);

    // Auto-cerrar después del duration
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Esperar animación de salida
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`fixed top-4 right-4 z-[100] max-w-sm w-full transform transition-all duration-300 ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <div
        className={`${config.bgColor} ${config.borderColor} border-2 rounded-xl p-4 shadow-lg backdrop-blur-sm flex items-start gap-3`}
      >
        <div className={`w-8 h-8 rounded-full ${config.bgColor} flex items-center justify-center flex-shrink-0`}>
          <EmojiIcon emoji={config.icon} label={type} className={`text-lg ${config.textColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${config.textColor}`}>{message}</p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className={`${config.textColor} opacity-50 hover:opacity-100 transition-opacity flex-shrink-0`}
          aria-label="Cerrar"
        >
          <EmojiIcon emoji="✕" label="Cerrar" className="text-sm" />
        </button>
      </div>
    </div>
  );
}

// Hook para usar toasts
export function useToast() {
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: ToastType }>>([]);

  const showToast = (message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return {
    toasts,
    showToast,
    removeToast,
    success: (message: string) => showToast(message, "success"),
    error: (message: string) => showToast(message, "error"),
    warning: (message: string) => showToast(message, "warning"),
    info: (message: string) => showToast(message, "info"),
  };
}

// Componente contenedor para renderizar múltiples toasts
export function ToastContainer({ toasts, onRemove }: { toasts: Array<{ id: string; message: string; type: ToastType }>; onRemove: (id: string) => void }) {
  return (
    <div className="fixed top-0 right-0 z-[100] p-4 space-y-2 pointer-events-none">
      {toasts.map((toast, index) => (
        <div key={toast.id} style={{ pointerEvents: "auto" }}>
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => onRemove(toast.id)}
          />
        </div>
      ))}
    </div>
  );
}
