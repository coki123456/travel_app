"use client";

interface ErrorAlertProps {
  error: string | string[] | null;
  className?: string;
}

/**
 * Componente para mostrar errores de forma consistente
 */
export default function ErrorAlert({ error, className = "" }: ErrorAlertProps) {
  if (!error) return null;

  const errors = Array.isArray(error) ? error : [error];

  return (
    <div
      className={`rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200 ${className}`}
    >
      {errors.length === 1 ? (
        <p>{errors[0]}</p>
      ) : (
        <ul className="list-disc list-inside space-y-1">
          {errors.map((err, index) => (
            <li key={index}>{err}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
