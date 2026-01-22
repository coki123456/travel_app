"use client";

import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

interface BaseInputProps {
  label: string;
  error?: string | null;
  className?: string;
}

type InputProps = BaseInputProps & InputHTMLAttributes<HTMLInputElement>;
type TextareaProps = BaseInputProps & TextareaHTMLAttributes<HTMLTextAreaElement>;

/**
 * Input de texto reutilizable con label y manejo de errores
 */
export function FormInput({ label, error, className = "", ...props }: InputProps) {
  return (
    <div className={className}>
      <label className="text-xs font-semibold text-slate-300">{label}</label>
      <input
        {...props}
        className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-400/70"
      />
      {error && (
        <p className="mt-1 text-xs text-rose-400">{error}</p>
      )}
    </div>
  );
}

/**
 * Textarea reutilizable con label y manejo de errores
 */
export function FormTextarea({ label, error, className = "", ...props }: TextareaProps) {
  return (
    <div className={className}>
      <label className="text-xs font-semibold text-slate-300">{label}</label>
      <textarea
        {...props}
        className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-400/70"
      />
      {error && (
        <p className="mt-1 text-xs text-rose-400">{error}</p>
      )}
    </div>
  );
}

interface FormSelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string | null;
  className?: string;
  options: Array<{ value: string; label: string }>;
}

/**
 * Select reutilizable con label y manejo de errores
 */
export function FormSelect({ label, error, className = "", options, ...props }: FormSelectProps) {
  return (
    <div className={className}>
      <label className="text-xs font-semibold text-slate-300">{label}</label>
      <select
        {...props}
        className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-400/70"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-xs text-rose-400">{error}</p>
      )}
    </div>
  );
}
