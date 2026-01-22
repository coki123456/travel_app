"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ErrorAlert from "../../components/ui/ErrorAlert";
import LoadingButton from "../../components/ui/LoadingButton";
import { EmojiIcon } from "../../components/ui/EmojiIcon";

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
          <EmojiIcon symbol="📎" label="Adjuntos" className="text-xl" />
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
          <EmojiIcon symbol="☁️" label="Subir archivo" className="text-base" />
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
                      <EmojiIcon symbol="🖼️" label="Imagen" className="text-base" />
                    ) : (
                      <EmojiIcon symbol="📄" label="Documento" className="text-base" />
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
                <EmojiIcon symbol="⬇️" label="Descargar" className="text-base" />
              </a>
            ))}
          </div>
        </>
      )}

      {attachments.length === 0 && (
        <>
          <div className="divider my-5"></div>
          <div className="rounded-[var(--radius-lg)] border-2 border-dashed border-[rgb(var(--color-border-light))] bg-[rgb(var(--color-bg-tertiary))] p-6 text-center">
            <EmojiIcon symbol="📂" label="Sin adjuntos" className="text-2xl" />
            <p className="text-sm text-[rgb(var(--color-text-secondary))]">
              Sin archivos adjuntos
            </p>
          </div>
        </>
      )}
    </div>
  );
}
