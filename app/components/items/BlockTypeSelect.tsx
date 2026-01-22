"use client";

import { BLOCKS, ITEM_TYPES } from "@/lib/constants";

interface BlockTypeSelectProps {
  block: string;
  type: string;
  onBlockChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  className?: string;
}

/**
 * Componente compartido para seleccionar Bloque y Tipo de item
 */
export default function BlockTypeSelect({
  block,
  type,
  onBlockChange,
  onTypeChange,
  className = "",
}: BlockTypeSelectProps) {
  return (
    <div className={`grid gap-4 sm:grid-cols-2 ${className}`}>
      <div>
        <label className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-2">
          Bloque horario
        </label>
        <div className="relative">
          <select
            className="input appearance-none pr-10"
            value={block}
            onChange={(e) => onBlockChange(e.target.value)}
          >
            {BLOCKS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--color-text-tertiary))] pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-2">
          Categoría
        </label>
        <div className="relative">
          <select
            className="input appearance-none pr-10"
            value={type}
            onChange={(e) => onTypeChange(e.target.value)}
          >
            {ITEM_TYPES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--color-text-tertiary))] pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
