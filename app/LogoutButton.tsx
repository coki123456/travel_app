"use client";

import { signOut } from "next-auth/react";
import { EmojiIcon } from "./components/ui/EmojiIcon";

interface LogoutButtonProps {
  variant?: "default" | "icon";
}

export default function LogoutButton({ variant = "default" }: LogoutButtonProps) {
  if (variant === "icon") {
    return (
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="w-9 h-9 flex items-center justify-center rounded-lg text-white/90 hover:bg-white/10 transition-all active:scale-95"
        aria-label="Cerrar sesión"
      >
        <EmojiIcon emoji="🚪" label="Cerrar sesión" className="text-lg" />
      </button>
    );
  }

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
