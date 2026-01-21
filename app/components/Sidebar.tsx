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
        className="fixed top-4 left-4 z-[60] md:hidden w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-700 shadow-lg"
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
      <aside className={`fixed left-0 top-0 h-screen w-72 bg-white border-r border-gray-200 flex flex-col z-50 transition-transform duration-300 md:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="text-3xl">✈️</div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Travel Planner
            </h1>
            <p className="text-xs text-gray-600">Organización de viajes</p>
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
                      ? "bg-blue-500 text-white"
                      : "text-gray-700 hover:bg-gray-100"
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
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
            {userName?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">
              {userName || "Usuario"}
            </div>
            <div className="text-xs text-gray-600 truncate">
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
