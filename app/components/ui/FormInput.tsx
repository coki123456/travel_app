"use client";

import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { EmojiIcon } from "./EmojiIcon";

interface BaseInputProps {
  label?: string;
  error?: string | null;
  helper?: string;
  className?: string;
}

type InputProps = BaseInputProps & InputHTMLAttributes<HTMLInputElement>;
type TextareaProps = BaseInputProps & TextareaHTMLAttributes<HTMLTextAreaElement>;

/**
 * Input de texto minimalista
 */
export function FormInput({ label, error, helper, className = "", ...props }: InputProps) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-2">
          {label}
          {props.required && <span className="text-[rgb(var(--color-error))] ml-1">*</span>}
        </label>
      )}
      <input
        {...props}
        className="input"
      />
      {helper && !error && (
        <p className="mt-1.5 text-xs text-[rgb(var(--color-text-tertiary))]">{helper}</p>
      )}
      {error && (
        <p className="mt-1.5 text-xs text-[rgb(var(--color-error))] flex items-center gap-1">
          <EmojiIcon symbol="⚠️" label="Error" className="text-sm" />
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Textarea minimalista
 */
export function FormTextarea({ label, error, helper, className = "", ...props }: TextareaProps) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-2">
          {label}
          {props.required && <span className="text-[rgb(var(--color-error))] ml-1">*</span>}
        </label>
      )}
      <textarea
        {...props}
        className="input resize-vertical min-h-[80px]"
      />
      {helper && !error && (
        <p className="mt-1.5 text-xs text-[rgb(var(--color-text-tertiary))]">{helper}</p>
      )}
      {error && (
        <p className="mt-1.5 text-xs text-[rgb(var(--color-error))] flex items-center gap-1">
          <EmojiIcon symbol="⚠️" label="Error" className="text-sm" />
          {error}
        </p>
      )}
    </div>
  );
}

interface FormSelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string | null;
  helper?: string;
  className?: string;
  options: Array<{ value: string; label: string }>;
}

/**
 * Select minimalista
 */
export function FormSelect({ label, error, helper, className = "", options, ...props }: FormSelectProps) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-2">
          {label}
          {props.required && <span className="text-[rgb(var(--color-error))] ml-1">*</span>}
        </label>
      )}
      <select
        {...props}
        className="input appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2016%2016%22%3E%3Cpath%20fill%3D%22%23525252%22%20d%3D%22M4.427%206.427l3.396%203.396a.25.25%200%2000.354%200l3.396-3.396A.25.25%200%200011.396%206H4.604a.25.25%200%2000-.177.427z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_0.75rem_center] bg-no-repeat pr-10"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {helper && !error && (
        <p className="mt-1.5 text-xs text-[rgb(var(--color-text-tertiary))]">{helper}</p>
      )}
      {error && (
        <p className="mt-1.5 text-xs text-[rgb(var(--color-error))] flex items-center gap-1">
          <EmojiIcon symbol="⚠️" label="Error" className="text-sm" />
          {error}
        </p>
      )}
    </div>
  );
}
