"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-400 bg-red-500/10 rounded-lg border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 transition-colors"
    >
      <span>🚪</span>
      Cerrar sesión
    </button>
  );
}
