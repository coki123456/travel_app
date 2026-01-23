import React from "react";

interface EmojiIconProps {
  emoji: string;
  label: string;
  className?: string;
}

/**
 * Componente para renderizar emojis como iconos
 * Reemplaza los iconos SVG de lucide-react con emojis nativos
 */
export function EmojiIcon({ emoji, label, className = "" }: EmojiIconProps) {
  return (
    <span
      role="img"
      aria-label={label}
      className={className}
      style={{
        display: "inline-block",
        lineHeight: 1,
        userSelect: "none"
      }}
    >
      {emoji}
    </span>
  );
}
