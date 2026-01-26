"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { EmojiIcon } from "./ui/EmojiIcon";

const navItems = [
  { href: "/dashboard", label: "Inicio", icon: "🏠" },
  { href: "/setup", label: "Viajes", icon: "🗺️" },
  { href: "/setup?create=true", label: "Nuevo", icon: "➕" },
  { href: "/", label: "Calendario", icon: "📅" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[rgb(var(--color-bg-secondary))] border-t border-[rgb(var(--color-border-light))] shadow-lg backdrop-blur-lg bg-opacity-98">
      <div className="flex items-center justify-around max-w-2xl mx-auto px-2 py-1">
        {navItems.map((item) => {
          // Lógica mejorada para detectar active state
          let isActive = false;
          if (item.href === "/dashboard") {
            isActive = pathname === "/dashboard";
          } else if (item.href === "/setup?create=true") {
            isActive = false; // Nunca activo (es una acción)
          } else if (item.href === "/setup") {
            isActive = pathname.startsWith("/setup");
          } else if (item.href === "/") {
            isActive = pathname === "/" || pathname.startsWith("/day") || pathname === "/book";
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-2 py-3.5 px-4 flex-1 transition-all duration-200 rounded-2xl ${
                isActive
                  ? "text-[rgb(var(--color-accent-hover))] bg-[rgb(var(--color-accent))]/12 border border-[rgb(var(--color-accent))/35] shadow-[0_10px_24px_rgba(20,136,158,0.18)]"
                  : "text-[rgb(var(--color-text-tertiary))] hover:text-[rgb(var(--color-text-primary))] active:scale-95"
              }`}
            >
              <div className={`relative ${isActive ? "scale-110" : ""} transition-transform duration-200`}>
                <EmojiIcon emoji={item.icon} label={item.label} className="text-3xl" />
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[rgb(var(--color-accent))] animate-pulse" />
                )}
              </div>
              <span className={`text-[13px] font-semibold sm:text-sm ${isActive ? "text-[rgb(var(--color-text-primary))]" : ""}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
