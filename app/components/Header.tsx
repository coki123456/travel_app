"use client";

import { useState } from "react";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="h-16 bg-white/90 backdrop-blur-lg border-b border-gray-200/50 shadow-sm flex items-center px-6 relative z-10">
      {/* Search Bar */}
      <div className="flex-1 max-w-2xl">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </span>
          <input
            type="text"
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Right Side - User Menu */}
      <div className="flex items-center gap-3 ml-6">
        <button
          className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-xl hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all shadow-sm"
          title="Notificaciones"
        >
          🔔
        </button>
        <button
          className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-xl hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all shadow-sm"
          title="Mensajes"
        >
          📧
        </button>
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all shadow-sm"
          title="Perfil"
        >
          <div className="w-7 h-7 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-sm">
            C
          </div>
          <span className="text-sm font-medium text-gray-700">Coki</span>
          <span className="text-gray-400">▼</span>
        </button>
      </div>
    </header>
  );
}
