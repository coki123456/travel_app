"use client";

import { signOut } from "next-auth/react";
import { Icon } from "./components/ui/Icon";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="w-full btn-ghost justify-start text-[rgb(var(--color-error))] hover:bg-[rgb(var(--color-error))]/5 hover:text-[rgb(var(--color-error))]"
    >
      <Icon name="logout" label="Cerrar sesión" className="w-4 h-4" strokeWidth={2} />
      <span className="ml-2">Cerrar sesión</span>
    </button>
  );
}
