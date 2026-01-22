"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ErrorAlert from "../../components/ui/ErrorAlert";
import LoadingButton from "../../components/ui/LoadingButton";

type AttachmentView = {
  id: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  path: string;
};

type AttachmentsPanelProps = {
  date: string;
  attachments: AttachmentView[];
};

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
};

export default function AttachmentsPanel({
  date,
  attachments,
}: AttachmentsPanelProps) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!file) {
      setError("Selecciona un archivo.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("date", date);

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/attachments", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(data?.error ?? "No se pudo subir el archivo.");
        return;
      }

      setFile(null);
      router.refresh();
    } catch (err) {
      console.error("Error al subir archivo:", err);
      setError("No se pudo conectar con el servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-[var(--radius-md)] bg-gradient-to-br from-[rgb(var(--color-accent))] to-[rgb(var(--color-accent-hover))] flex items-center justify-center shadow-[var(--shadow-sm)]">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        </div>
        <div>
          <h3 className="text-base font-semibold text-[rgb(var(--color-text-primary))]">
            Adjuntos
          </h3>
          <p className="text-xs text-[rgb(var(--color-text-secondary))]">
            PDF o imágenes (JPG, PNG, WEBP)
          </p>
        </div>
      </div>

      <div className="divider mb-4"></div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="file"
            accept=".pdf,image/jpeg,image/png,image/webp"
            className="block w-full text-sm text-[rgb(var(--color-text-primary))]
              file:mr-4 file:rounded-[var(--radius-md)] file:border-0
              file:bg-[rgb(var(--color-accent))] file:px-4 file:py-2 file:text-xs
              file:font-medium file:text-white
              file:transition file:hover:bg-[rgb(var(--color-accent-hover))]
              file:cursor-pointer cursor-pointer
              border border-[rgb(var(--color-border-light))]
              rounded-[var(--radius-md)] p-3
              bg-[rgb(var(--color-bg-secondary))]
              hover:border-[rgb(var(--color-accent))]/30"
            onChange={(event) => {
              const selected = event.target.files?.[0] ?? null;
              setFile(selected);
            }}
          />
        </div>

        <ErrorAlert error={error} />

        <LoadingButton
          type="submit"
          isLoading={isSubmitting}
          loadingText="Subiendo..."
          variant="primary"
          className="w-full"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Subir archivo
        </LoadingButton>
      </form>

      {attachments.length > 0 && (
        <>
          <div className="divider my-5"></div>
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-[rgb(var(--color-text-primary))] mb-3">
              Archivos adjuntos ({attachments.length})
            </h4>
            {attachments.map((attachment) => (
              <a
                key={attachment.id}
                href={attachment.path}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-[var(--radius-md)] border border-[rgb(var(--color-border-light))] bg-[rgb(var(--color-bg-tertiary))] transition hover:border-[rgb(var(--color-accent))]/30 hover:bg-[rgb(var(--color-accent-light))] group"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-[rgb(var(--color-accent))]/10 flex items-center justify-center flex-shrink-0">
                    {attachment.mimeType.startsWith('image/') ? (
                      <svg className="w-4 h-4 text-[rgb(var(--color-accent))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-[rgb(var(--color-accent))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-[rgb(var(--color-text-primary))] truncate">
                      {attachment.fileName}
                    </span>
                    <span className="text-xs text-[rgb(var(--color-text-tertiary))]">
                      {formatSize(attachment.sizeBytes)}
                    </span>
                  </div>
                </div>
                <svg className="w-4 h-4 text-[rgb(var(--color-text-tertiary))] group-hover:text-[rgb(var(--color-accent))] flex-shrink-0 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ))}
          </div>
        </>
      )}

      {attachments.length === 0 && (
        <>
          <div className="divider my-5"></div>
          <div className="rounded-[var(--radius-lg)] border-2 border-dashed border-[rgb(var(--color-border-light))] bg-[rgb(var(--color-bg-tertiary))] p-6 text-center">
            <svg className="w-8 h-8 mx-auto text-[rgb(var(--color-text-tertiary))] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-[rgb(var(--color-text-secondary))]">
              Sin archivos adjuntos
            </p>
          </div>
        </>
      )}
    </div>
  );
}
