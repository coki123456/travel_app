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
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-[60] sm:hidden w-11 h-11 card flex items-center justify-center text-[rgb(var(--color-text-primary))] shadow-[var(--shadow-md)] hover-lift"
        aria-label="Abrir menú"
      >
        {isOpen ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Overlay para móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 sm:hidden animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`app-sidebar transition-transform duration-[var(--transition-slow)] sm:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } fixed left-0 top-0 h-screen z-50`}>

        {/* Logo */}
        <div className="p-6 border-b border-[rgb(var(--color-border-light))]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[var(--radius-md)] bg-gradient-to-br from-[rgb(var(--color-accent))] to-[rgb(var(--color-accent-hover))] flex items-center justify-center text-2xl">
              ✈️
            </div>
            <div>
              <h1 className="text-lg font-semibold text-[rgb(var(--color-text-primary))] tracking-tight">
                Travel Planner
              </h1>
              <p className="text-xs text-[rgb(var(--color-text-tertiary))] mt-0.5">
                Organizá tus viajes
              </p>
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
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-[var(--radius-md)] transition-all duration-[var(--transition-fast)] ${
                      isActive
                        ? "bg-[rgb(var(--color-accent))] text-white shadow-[var(--shadow-sm)]"
                        : "text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-bg-tertiary))] hover:text-[rgb(var(--color-text-primary))]"
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium text-sm">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Active Trip Card */}
          {activeTripName && (
            <div className="mt-6">
              <ActiveTripCard activeTripName={activeTripName} />
            </div>
          )}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-[rgb(var(--color-border-light))]">
          <div className="flex items-center gap-3 mb-3 p-3 rounded-[var(--radius-md)] bg-[rgb(var(--color-bg-tertiary))]">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[rgb(var(--color-accent))] to-[rgb(var(--color-accent-hover))] flex items-center justify-center text-white font-semibold text-sm shadow-[var(--shadow-sm)]">
              {userName?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-[rgb(var(--color-text-primary))] truncate">
                {userName || "Usuario"}
              </div>
              <div className="text-xs text-[rgb(var(--color-text-tertiary))] truncate mt-0.5">
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
