"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "Girasol Artesanal";

const navItems = [
  { href: "/", label: "Catálogo" },
  { href: "/contacto", label: "Contacto" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="border-b border-linea bg-lino">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-4 py-3.5 sm:flex-row sm:justify-between sm:gap-3.5 sm:px-7 sm:py-5">
        <Link
          href="/"
          className="flex items-center gap-2 font-heading text-lg font-semibold text-nogal sm:gap-2.5 sm:text-xl"
        >
          <Image
            src="/branding/logo-256.png"
            alt=""
            width={44}
            height={44}
            quality={95}
            className="shrink-0"
          />
          {siteName}
        </Link>
        <nav className="flex gap-5 sm:gap-7">
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
