"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg shadow-black/30">
      <h3 className="text-sm font-semibold text-slate-100">Adjuntos</h3>
      <p className="mt-2 text-sm text-slate-300">
        PDF o imágenes (JPG, PNG, WEBP).
      </p>

      <form onSubmit={onSubmit} className="mt-4 grid gap-3">
        <input
          type="file"
          accept=".pdf,image/jpeg,image/png,image/webp"
          className="block w-full text-sm text-slate-300 file:mr-4 file:rounded-xl file:border-0 file:bg-cyan-400 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-slate-950"
          onChange={(event) => {
            const selected = event.target.files?.[0] ?? null;
            setFile(selected);
          }}
        />

        {error ? (
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Subiendo..." : "Subir archivo"}
        </button>
      </form>

      <div className="mt-5 space-y-3">
        {attachments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-4 text-sm text-slate-400">
            Sin adjuntos todavía.
          </div>
        ) : (
          attachments.map((attachment) => (
            <a
              key={attachment.id}
              href={attachment.path}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm text-slate-200 shadow-lg shadow-black/20 transition hover:border-slate-600"
            >
              <div className="flex flex-col">
                <span className="font-semibold text-slate-100">
                  {attachment.fileName}
                </span>
                <span className="text-xs text-slate-400">
                  {attachment.mimeType} - {formatSize(attachment.sizeBytes)}
                </span>
              </div>
              <span className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Ver
              </span>
            </a>
          ))
        )}
      </div>
    </div>
  );
}
