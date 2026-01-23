"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import LogoutButton from "../LogoutButton";
import ActiveTripCard from "./trips/ActiveTripCard";
import { EmojiIcon } from "./ui/EmojiIcon";

interface SidebarProps {
  activeTripName: string | null;
  userName: string | null;
  userEmail: string | null;
}

const navItems = [
  { href: "/", label: "Inicio", icon: "📆" },
  { href: "/setup", label: "Mis Viajes", icon: "📋" },
  { href: "/setup", label: "Crear Viaje", icon: "➕" },
  { href: "/", label: "Calendario", icon: "📅" },
];

export default function Sidebar({ activeTripName, userName, userEmail }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-[60] sm:hidden w-10 h-10 rounded-lg bg-white dark:bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border-light))] flex items-center justify-center text-[rgb(var(--color-text-primary))] shadow-sm active:scale-95 transition-transform"
        aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
      >
        {isOpen ? (
          <EmojiIcon emoji="✕" label="" className="text-base" />
        ) : (
          <EmojiIcon emoji="☰" label="" className="text-base" />
        )}
      </button>

      {/* Overlay para móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/10 backdrop-blur-[2px] z-40 sm:hidden animate-fade-in"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`app-sidebar transition-transform duration-300 ease-in-out sm:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } fixed left-0 top-0 h-screen z-50 sm:block`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-[rgb(var(--color-border-light))]">
          <div className="flex items-center gap-2.5 px-2">
            <EmojiIcon emoji="✈️" label="" className="text-xl" />
            <h1 className="text-base font-semibold text-[rgb(var(--color-text-primary))]">
              Travel Planner
            </h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 overflow-y-auto">
          <ul className="space-y-0.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href + item.label}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-[rgb(var(--color-accent))] text-white"
                        : "text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-bg-tertiary))] hover:text-[rgb(var(--color-text-primary))]"
                    }`}
                  >
                    <EmojiIcon emoji={item.icon} label="" className="text-sm" />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Active Trip Card */}
          {activeTripName && (
            <div className="mt-4">
              <ActiveTripCard activeTripName={activeTripName} />
            </div>
          )}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-3 border-t border-[rgb(var(--color-border-light))]">
          <div className="flex items-center gap-2 mb-2 px-2 py-1.5">
            <div className="w-7 h-7 rounded-full bg-[rgb(var(--color-accent))] flex items-center justify-center text-white font-medium text-xs">
              {userName?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-[rgb(var(--color-text-primary))] truncate">
                {userName || "Usuario"}
              </div>
            </div>
          </div>
          <LogoutButton />
        </div>
      </aside>
    </>
  );
}
