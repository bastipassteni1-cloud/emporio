"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "Girasol Artesanal";

type NavId = "inicio" | "catalogo" | "historia" | "contacto";

const navItems: { id: NavId; href: string; label: string }[] = [
  { id: "inicio", href: "/", label: "Inicio" },
  { id: "catalogo", href: "/#catalogo", label: "Catálogo" },
  { id: "historia", href: "/#historia", label: "Sobre Nosotros" },
  { id: "contacto", href: "/contacto", label: "Contacto" },
];

const homeSections = ["catalogo", "historia"] as const;

function useHomeSection(enabled: boolean): NavId {
  const [section, setSection] = useState<NavId>("inicio");

  useEffect(() => {
    if (!enabled) return;

    function update() {
      const threshold = window.innerHeight * 0.4;
      let current: NavId = "inicio";
      for (const id of homeSections) {
        const top = document.getElementById(id)?.getBoundingClientRect().top;
        if (top !== undefined && top <= threshold) current = id;
      }
      setSection(current);
    }

    const frame = requestAnimationFrame(update);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [enabled]);

  return section;
}

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const homeSection = useHomeSection(isHome);

  const activeId: NavId | null = isHome
    ? homeSection
    : pathname.startsWith("/productos")
      ? "catalogo"
      : pathname === "/contacto"
        ? "contacto"
        : null;

  return (
    <header className="z-30 border-b border-linea bg-lino/95 backdrop-blur-sm sm:sticky sm:top-0">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-4 py-3 sm:flex-row sm:justify-between sm:gap-3.5 sm:px-7">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-md font-heading text-xl font-semibold text-nogal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocre-texto sm:gap-3 sm:text-[1.7rem]"
        >
          <Image
            src="/branding/logo-256.png"
            alt=""
            width={56}
            height={56}
            quality={95}
            className="size-11 shrink-0 sm:size-14"
          />
          {siteName}
        </Link>
        <nav
          aria-label="Navegación principal"
          className="flex flex-wrap justify-center gap-x-4 gap-y-1 sm:gap-x-9"
        >
          {navItems.map((item) => {
            const active = activeId === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-sm border-b-2 py-1.5 text-sm font-semibold transition-colors sm:text-[0.95rem] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocre-texto",
                  active
                    ? "border-ocre text-nogal"
                    : "border-transparent text-nogal hover:border-ocre-suave",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
