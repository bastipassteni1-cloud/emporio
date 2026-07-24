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
      className={cn(
        "rounded-full border-[1.5px] px-4 py-1.5 font-sans text-sm font-semibold transition-colors sm:px-5 sm:py-2",
        active
          ? "border-nogal bg-nogal text-crudo"
          : "border-linea bg-crudo text-nogal-suave hover:border-ocre hover:text-nogal",
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
      <Pill href="/" active={!activeSlug}>
        Todos
      </Pill>
      {categories.map((category) => (
        <Pill
          key={category.id}
          href={`/?categoria=${category.slug}`}
          active={activeSlug === category.slug}
        >
          {category.name}
        </Pill>
      ))}
    </>
  );
}
