"use client";

import { useState } from "react";
import { EmojiIcon } from "./ui/EmojiIcon";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="app-header flex items-center justify-between">
      {/* Search Bar */}
      <div className="flex-1 max-w-2xl ml-12 md:ml-0">
        <div className="relative">
          <EmojiIcon
            symbol="🔍"
            label="Buscar"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base text-[rgb(var(--color-text-tertiary))]"
          />
          <input
            type="text"
            placeholder="Buscar en tu viaje..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      {/* Right Side - Actions */}
      <div className="flex items-center gap-2 ml-4">
        <button
          className="btn-ghost w-10 h-10 p-0 hidden sm:flex"
          title="Notificaciones"
          aria-label="Notificaciones"
        >
          <EmojiIcon symbol="🔔" label="Notificaciones" className="text-xl" />
        </button>

        <button
          className="btn-ghost w-10 h-10 p-0 hidden sm:flex"
          title="Configuración"
          aria-label="Configuración"
        >
          <EmojiIcon symbol="⚙️" label="Configuración" className="text-xl" />
        </button>
      </div>
    </header>
  );
}
