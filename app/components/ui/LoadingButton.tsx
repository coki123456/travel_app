"use client";

import { ButtonHTMLAttributes } from "react";

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  variant?: "primary" | "secondary" | "danger";
}

/**
 * Botón reutilizable con estado de carga
 */
export default function LoadingButton({
  isLoading = false,
  loadingText = "Cargando...",
  variant = "primary",
  children,
  disabled,
  className = "",
  ...props
}: LoadingButtonProps) {
  const baseClasses = "rounded-2xl px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70";

  const variantClasses = {
    primary: "bg-cyan-400 text-slate-950 hover:bg-cyan-300",
    secondary: "border border-slate-700 text-slate-200 hover:border-slate-500",
    danger: "border border-rose-500/40 text-rose-200 hover:border-rose-400",
  };

  return (
    <button
      {...props}
      disabled={isLoading || disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {isLoading ? loadingText : children}
    </button>
  );
}
