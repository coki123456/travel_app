"use client";

import { signOut } from "next-auth/react";
import { EmojiIcon } from "./components/ui/EmojiIcon";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="w-full btn-ghost justify-start text-[rgb(var(--color-error))] hover:bg-[rgb(var(--color-error))]/5 hover:text-[rgb(var(--color-error))]"
    >
      <EmojiIcon emoji="🚪" label="Cerrar sesión" className="text-base" />
      <span className="ml-2">Cerrar sesión</span>
    </button>
  );
}
