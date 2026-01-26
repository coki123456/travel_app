"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/setup", label: "Mis viajes" },
  { href: "/setup?create=true", label: "Nuevo" },
];

export default function TopNav() {
  const pathname = usePathname();

  return (
    <div className="w-full border-b border-[rgb(var(--color-border-light))] bg-[rgb(var(--color-bg-secondary))]/95 backdrop-blur-md">
      <nav className="mx-auto flex max-w-5xl items-center gap-3 sm:gap-4 px-4 py-2.5">
        {navItems.map((item, idx) => {
          const isActive =
            item.href === "/setup"
              ? pathname.startsWith("/setup")
              : pathname === item.href;

          return (
            <div key={item.href} className="flex items-center gap-3">
              {idx > 0 && <span className="h-2 w-px bg-[rgb(var(--color-border-medium))] rounded-full" />}
              <Link
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors border ${
                  isActive
                    ? "bg-[rgb(var(--color-accent-light))] text-[rgb(var(--color-accent))] border-[rgb(var(--color-accent))/25]"
                    : "text-[rgb(var(--color-text-secondary))] border-transparent hover:text-[rgb(var(--color-text-primary))] hover:border-[rgb(var(--color-border-light))]"
                }`}
              >
                {item.label}
              </Link>
            </div>
          );
        })}
      </nav>
    </div>
  );
}
