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
    <div className={`grid gap-3 sm:grid-cols-2 ${className}`}>
      <div>
        <label className="text-xs font-semibold text-slate-300">Bloque</label>
        <select
          className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-400/70"
          value={block}
          onChange={(e) => onBlockChange(e.target.value)}
        >
          {BLOCKS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-300">Tipo</label>
        <select
          className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-400/70"
          value={type}
          onChange={(e) => onTypeChange(e.target.value)}
        >
          {ITEM_TYPES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
