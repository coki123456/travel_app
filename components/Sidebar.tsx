"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "../LogoutButton";

interface SidebarProps {
  activeTripName: string | null;
  userName: string | null;
  userEmail: string | null;
}

export default function Sidebar({ activeTripName, userName, userEmail }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Inicio", icon: "🏠" },
    { href: "/setup", label: "Mis Viajes", icon: "✈️" },
    { href: "/book", label: "Libro del Viaje", icon: "📖" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[var(--sidebar-bg)] border-r border-[var(--border)] flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <div className="text-2xl">✈️</div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">
            Travel Planner
          </h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-[var(--primary)] text-white"
                      : "text-[var(--text-secondary)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--text-primary)]"
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
        {activeTripName && (
          <div className="mt-8 p-4 bg-[var(--background)] rounded-lg border border-[var(--border)]">
            <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2">
              Viaje Activo
            </div>
            <div className="text-sm font-semibold text-[var(--text-primary)]">
              {activeTripName}
            </div>
          </div>
        )}
      </nav>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-[var(--border)]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-[var(--primary)] rounded-full flex items-center justify-center text-white font-semibold">
            {userName?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-[var(--text-primary)] truncate">
              {userName || "Usuario"}
            </div>
            <div className="text-xs text-[var(--text-muted)] truncate">
              {userEmail || ""}
            </div>
          </div>
        </div>
        <LogoutButton />
      </div>
    </aside>
  );
}
