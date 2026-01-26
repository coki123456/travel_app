"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Inicio" },
  { href: "/setup", label: "Mis viajes" },
  { href: "/setup?create=true", label: "Nuevo" },
];

export default function TopNav() {
  const pathname = usePathname();

  return (
    <div className="w-full border-b border-[rgb(var(--color-border-light))] bg-[rgb(var(--color-bg-secondary))]/95 backdrop-blur-md">
      <nav className="mx-auto flex max-w-5xl items-center gap-2 px-4 py-2.5">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/" || pathname.startsWith("/day") || pathname === "/book"
              : item.href === "/setup"
              ? pathname.startsWith("/setup")
              : pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                isActive
                  ? "bg-[rgb(var(--color-accent-light))] text-[rgb(var(--color-accent))] border border-[rgb(var(--color-accent))/25]"
                  : "text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))]"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
