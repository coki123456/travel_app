"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="inline-flex items-center justify-center rounded-2xl border border-rose-500/40 px-5 py-2 text-sm font-semibold text-rose-200 transition hover:border-rose-400"
    >
      Cerrar sesión
    </button>
  );
}
