"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "Catálogo Artesanal";

const navItems = [
  { href: "/", label: "Catálogo" },
  { href: "/contacto", label: "Contacto" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="border-b border-linea bg-lino">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3.5 px-7 py-5 sm:flex-row sm:justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-heading text-xl font-semibold text-nogal"
        >
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none" className="shrink-0">
            <circle cx="13" cy="13" r="11.5" stroke="var(--nogal)" strokeWidth="1.4" />
            <circle cx="13" cy="13" r="1.6" fill="var(--ocre)" />
            <path
              d="M13 3 Q15 8 13 13 Q11 8 13 3"
              fill="none"
              stroke="var(--ciruela)"
              strokeWidth="1.2"
            />
          </svg>
          {siteName}
        </Link>
        <nav className="flex gap-7">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative pb-1 text-sm font-semibold",
                  active ? "text-nogal" : "text-nogal-suave",
                )}
              >
                {item.label}
                {active && (
                  <span
                    aria-hidden
                    className="absolute inset-x-0 -bottom-0.5 h-0.5"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle, var(--ocre) 1.4px, transparent 1.6px)",
                      backgroundSize: "7px 2px",
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
