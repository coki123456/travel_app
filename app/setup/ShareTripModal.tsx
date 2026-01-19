"use client";

import { useState, useEffect } from "react";

type SharedUser = {
  id: string;
  user: {
    email: string;
    name: string | null;
  };
  role: "OWNER" | "EDITOR" | "VIEWER";
};

type Owner = {
  email: string;
  name: string | null;
};

export default function ShareTripModal({
  tripId,
  isOpen,
  onClose,
}: {
  tripId: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"EDITOR" | "VIEWER">("EDITOR");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [owner, setOwner] = useState<Owner | null>(null);
  const [sharedUsers, setSharedUsers] = useState<SharedUser[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadSharedUsers();
    }
  }, [isOpen, tripId]);

  const loadSharedUsers = async () => {
    try {
      const res = await fetch(`/api/trip/${tripId}/share`);
      if (res.ok) {
        const data = await res.json();
        setOwner(data.owner);
        setSharedUsers(data.sharedWith);
      }
    } catch (err) {
      console.error("Error al cargar compartidos:", err);
    }
  };

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/trip/${tripId}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al compartir");
        setLoading(false);
        return;
      }

      setEmail("");
      setRole("EDITOR");
      await loadSharedUsers();
    } catch (err) {
      setError("Error al compartir el viaje");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (userId: string) => {
    if (!confirm("¿Eliminar acceso de este usuario?")) return;

    try {
      const res = await fetch(`/api/trip/${tripId}/share`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (res.ok) {
        await loadSharedUsers();
      }
    } catch (err) {
      console.error("Error al eliminar:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-3xl max-w-md w-full p-6 border border-slate-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white">
            Compartir viaje
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleShare} className="space-y-4 mb-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-2 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email del usuario
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="usuario@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Permisos
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "EDITOR" | "VIEWER")}
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="EDITOR">Puede editar</option>
              <option value="VIEWER">Solo ver</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-600 text-white font-semibold rounded-xl transition-colors"
          >
            {loading ? "Compartiendo..." : "Compartir"}
          </button>
        </form>

        <div className="border-t border-slate-700 pt-4">
          <h3 className="text-sm font-semibold text-slate-300 mb-3">
            Personas con acceso
          </h3>

          {owner && (
            <div className="mb-2 p-3 bg-slate-900/50 rounded-xl">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-white font-medium">
                    {owner.name || owner.email}
                  </p>
                  {owner.name && (
                    <p className="text-slate-400 text-sm">{owner.email}</p>
                  )}
                </div>
                <span className="text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full">
                  Dueño
                </span>
              </div>
            </div>
          )}

          {sharedUsers.length === 0 ? (
            <p className="text-slate-400 text-sm">
              No está compartido con nadie todavía
            </p>
          ) : (
            <div className="space-y-2">
              {sharedUsers.map((share) => (
                <div
                  key={share.id}
                  className="p-3 bg-slate-900/50 rounded-xl flex justify-between items-center"
                >
                  <div>
                    <p className="text-white">
                      {share.user.name || share.user.email}
                    </p>
                    {share.user.name && (
                      <p className="text-slate-400 text-sm">
                        {share.user.email}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-slate-700 text-slate-300 px-3 py-1 rounded-full">
                      {share.role === "EDITOR" ? "Editor" : "Viewer"}
                    </span>
                    <button
                      onClick={() => handleRemove(share.user.id)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
