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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[rgb(var(--color-bg-secondary))] border-t border-[rgb(var(--color-border-light))] shadow-lg backdrop-blur-lg bg-opacity-95">
      <div className="flex items-center justify-around max-w-2xl mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href === "/setup" && pathname.startsWith("/setup"));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 py-3 px-4 flex-1 transition-all duration-200 ${
                isActive
                  ? "text-[rgb(var(--color-accent))]"
                  : "text-[rgb(var(--color-text-tertiary))] active:scale-95"
              }`}
            >
              <div className={`relative ${isActive ? "scale-110" : ""} transition-transform duration-200`}>
                <EmojiIcon emoji={item.icon} label={item.label} className="text-2xl" />
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[rgb(var(--color-accent))] animate-pulse" />
                )}
              </div>
              <span className={`text-[10px] font-medium ${isActive ? "font-semibold" : ""}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
