"use client";

import { Icon } from "./Icon";

interface ErrorAlertProps {
  error: string | string[] | null;
  className?: string;
}

/**
 * Alert de error minimalista
 */
export default function ErrorAlert({ error, className = "" }: ErrorAlertProps) {
  if (!error) return null;

  const errors = Array.isArray(error) ? error : [error];

  return (
    <div
      className={`card-flat border border-[rgb(var(--color-error))]/20 bg-[rgb(var(--color-error))]/5 animate-fade-in ${className}`}
      role="alert"
    >
      <div className="flex items-start gap-3 p-4">
        <Icon name="warning" label="Error" className="text-[rgb(var(--color-error))] flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          {errors.length === 1 ? (
            <p className="text-sm text-[rgb(var(--color-error))] font-medium">{errors[0]}</p>
          ) : (
            <ul className="space-y-1">
              {errors.map((err, index) => (
                <li key={index} className="text-sm text-[rgb(var(--color-error))] font-medium flex items-start gap-2">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-[rgb(var(--color-error))] flex-shrink-0" />
                  <span>{err}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
