import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Category } from "@/lib/types";

function Pill({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "true" : undefined}
      className={cn(
        "rounded-full border-[1.5px] px-4 py-1.5 font-sans text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocre-texto sm:px-6 sm:py-2.5 sm:text-[0.95rem]",
        active
          ? "border-nogal bg-nogal text-crudo"
          : "border-linea bg-crudo text-nogal shadow-sm hover:border-ocre",
      )}
    >
      {children}
    </Link>
  );
}

export function CategoryFilter({
  categories,
  activeSlug,
}: {
  categories: Category[];
  activeSlug?: string;
}) {
  if (categories.length === 0) return null;

  return (
    <>
      <Pill href="/#catalogo" active={!activeSlug}>
        Todos
      </Pill>
      {categories.map((category) => (
        <Pill
          key={category.id}
          href={`/?categoria=${category.slug}#catalogo`}
          active={activeSlug === category.slug}
        >
          {category.name}
        </Pill>
      ))}
    </>
  );
}
