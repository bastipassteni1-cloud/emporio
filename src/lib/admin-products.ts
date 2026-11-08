import type { Product, ProductStatus } from "@/lib/types";

export type ProductSort =
  | "newest"
  | "name"
  | "price-asc"
  | "price-desc";

export type ProductFilters = {
  query: string;
  categoryId: string;
  status: ProductStatus | "";
  sort: ProductSort;
};

function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

export function filterAndSortProducts(
  products: Product[],
  { query, categoryId, status, sort }: ProductFilters,
): Product[] {
  const search = normalize(query);

  const filtered = products.filter(
    (product) =>
      (!search || normalize(product.name).includes(search)) &&
      (!categoryId || product.category_id === categoryId) &&
      (!status || product.status === status),
  );

  return filtered.sort((a, b) => {
    switch (sort) {
      case "name":
        return a.name.localeCompare(b.name, "es");
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      default:
        return b.created_at.localeCompare(a.created_at);
    }
  });
}
