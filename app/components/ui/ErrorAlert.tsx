"use client";

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
        <svg
          className="w-5 h-5 text-[rgb(var(--color-error))] flex-shrink-0 mt-0.5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
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
