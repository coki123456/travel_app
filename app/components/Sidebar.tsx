"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import LogoutButton from "../LogoutButton";
import ActiveTripCard from "./trips/ActiveTripCard";

interface SidebarProps {
  activeTripName: string | null;
  userName: string | null;
  userEmail: string | null;
}

export default function Sidebar({ activeTripName, userName, userEmail }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Inicio", icon: "📍" },
    { href: "/setup", label: "Mis Viajes", icon: "🧳" },
    { href: "/setup", label: "Crear Viaje", icon: "➕" },
    { href: "/", label: "Calendario", icon: "📅" },
    { href: "/setup", label: "Configuración", icon: "⚙️" },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-[60] md:hidden w-10 h-10 bg-[var(--sidebar-bg)] backdrop-blur-md border border-white/10 rounded-lg flex items-center justify-center text-white shadow-lg"
      >
        {isOpen ? "✕" : "☰"}
      </button>

      {/* Overlay para móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-screen w-72 bg-[var(--sidebar-bg)] backdrop-blur-md border-r border-white/10 flex flex-col z-50 transition-transform duration-300 md:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="text-3xl">✈️</div>
          <div>
            <h1 className="text-xl font-bold text-white">
              Travel Planner
            </h1>
            <p className="text-xs text-gray-400">Organización de viajes</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href + item.label}>
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-[var(--primary)] text-white shadow-lg shadow-blue-500/30"
                      : "text-gray-300 hover:bg-[var(--sidebar-hover)] hover:text-white"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Active Trip Selector */}
        {activeTripName && <ActiveTripCard activeTripName={activeTripName} />}
      </nav>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
            {userName?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">
              {userName || "Usuario"}
            </div>
            <div className="text-xs text-gray-400 truncate">
              {userEmail || ""}
            </div>
          </div>
        </div>
        <LogoutButton />
      </div>
    </aside>
    </>
  );
}
