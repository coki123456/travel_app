"use client";

import { ButtonHTMLAttributes } from "react";
import { EmojiIcon } from "./EmojiIcon";

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  variant?: "primary" | "secondary" | "ghost";
}

/**
 * Botón minimalista con estado de carga
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
  const variantClasses = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    ghost: "btn-ghost",
  };

  return (
    <button
      {...props}
      disabled={isLoading || disabled}
      className={`${variantClasses[variant]} ${className}`}
    >
      {isLoading && (
        <EmojiIcon symbol="⏳" label="Cargando" className="animate-spin inline-block text-base" />
      )}
      {isLoading ? loadingText : children}
    </button>
  );
}
