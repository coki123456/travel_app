"use client";

import { signOut } from "next-auth/react";
import { EmojiIcon } from "./components/ui/EmojiIcon";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[rgb(var(--color-error))] hover:bg-[rgb(var(--color-error))]/5 transition-colors text-sm"
    >
      <EmojiIcon emoji="🚪" label="Cerrar sesión" className="text-sm" />
      <span>Cerrar sesión</span>
    </button>
  );
}
