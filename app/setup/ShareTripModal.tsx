"use client";

import { useState, useEffect } from "react";

type SharedUser = {
  id: string;
  email: string;
  name: string | null;
  role: "OWNER" | "EDITOR" | "VIEWER";
};

type ShareTripModalProps = {
  tripId: string;
  isOpen: boolean;
  onClose: () => void;
};

export default function ShareTripModal({
  tripId,
  isOpen,
  onClose,
}: ShareTripModalProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"EDITOR" | "VIEWER">("EDITOR");
  const [sharedUsers, setSharedUsers] = useState<SharedUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadSharedUsers();
    }
  }, [isOpen, tripId]);

  const loadSharedUsers = async () => {
    try {
      const response = await fetch(`/api/trip/${tripId}/share`);
      if (response.ok) {
        const data = await response.json();
        setSharedUsers(data.sharedUsers || []);
      }
    } catch (err) {
      console.error("Error loading shared users:", err);
    }
  };

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await fetch(`/api/trip/${tripId}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Error al compartir el viaje");
        return;
      }

      setSuccess(`Viaje compartido con ${email}`);
      setEmail("");
      setRole("EDITOR");
      loadSharedUsers();
    } catch (err) {
      setError("No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAccess = async (userId: string) => {
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/trip/${tripId}/share`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Error al eliminar acceso");
        return;
      }

      setSuccess("Acceso eliminado");
      loadSharedUsers();
    } catch (err) {
      setError("No se pudo conectar con el servidor");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-100">
            Compartir viaje
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            {success}
          </div>
        )}

        <form onSubmit={handleShare} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-300"
            >
              Email del usuario
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
              placeholder="usuario@ejemplo.com"
            />
          </div>

          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-slate-300"
            >
              Permisos
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as "EDITOR" | "VIEWER")}
              className="mt-1 w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none"
            >
              <option value="EDITOR">Editor (puede ver y editar)</option>
              <option value="VIEWER">Visualizador (solo puede ver)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Compartiendo..." : "Compartir"}
          </button>
        </form>

        {sharedUsers.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-3 text-sm font-medium text-slate-300">
              Usuarios con acceso
            </h3>
            <div className="space-y-2">
              {sharedUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-2"
                >
                  <div>
                    <p className="text-sm text-slate-100">
                      {user.name || user.email}
                    </p>
                    <p className="text-xs text-slate-400">
                      {user.role === "OWNER"
                        ? "Propietario"
                        : user.role === "EDITOR"
                          ? "Editor"
                          : "Visualizador"}
                    </p>
                  </div>
                  {user.role !== "OWNER" && (
                    <button
                      onClick={() => handleRemoveAccess(user.id)}
                      className="text-xs text-rose-400 hover:text-rose-300"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
