"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-300 bg-red-500/10 rounded-lg border border-red-500/20 hover:bg-red-500/20 hover:border-red-400/40 hover:text-red-200 transition-all"
    >
      <span>🚪</span>
      Cerrar Sesión
    </button>
  );
}
