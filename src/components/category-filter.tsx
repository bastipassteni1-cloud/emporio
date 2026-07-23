import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { Category } from "@/lib/types";

export function CategoryFilter({
  categories,
  activeSlug,
}: {
  categories: Category[];
  activeSlug?: string;
}) {
  if (categories.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      <Link href="/">
        <Badge variant={!activeSlug ? "default" : "outline"}>Todos</Badge>
      </Link>
      {categories.map((category) => (
        <Link key={category.id} href={`/?categoria=${category.slug}`}>
          <Badge variant={activeSlug === category.slug ? "default" : "outline"}>
            {category.name}
          </Badge>
        </Link>
      ))}
    </div>
  );
}
