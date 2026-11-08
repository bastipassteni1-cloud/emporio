import { describe, expect, it } from "vitest";
import { filterAndSortProducts, type ProductFilters } from "./admin-products";
import type { Product } from "./types";

function product(overrides: Partial<Product>): Product {
  return {
    id: "1",
    slug: "pieza",
    name: "Pieza",
    description: "",
    price: 1000,
    dimensions: null,
    status: "available",
    category_id: "madera",
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

const products = [
  product({ id: "1", name: "Elefante lámpara", price: 12000, created_at: "2026-01-01T00:00:00Z" }),
  product({ id: "2", name: "Cardigan", price: 40000, category_id: "tejidos", created_at: "2026-03-01T00:00:00Z" }),
  product({ id: "3", name: "Caballo", price: 20000, status: "sold", created_at: "2026-02-01T00:00:00Z" }),
];

const base: ProductFilters = { query: "", categoryId: "", status: "", sort: "newest" };
const ids = (filters: Partial<ProductFilters>) =>
  filterAndSortProducts(products, { ...base, ...filters }).map((p) => p.id);

describe("filterAndSortProducts", () => {
  it("ordena por más recientes por defecto", () => {
    expect(ids({})).toEqual(["2", "3", "1"]);
  });

  it("busca sin distinguir mayúsculas ni tildes", () => {
    expect(ids({ query: "LAMPARA" })).toEqual(["1"]);
  });

  it("filtra por categoría y estado", () => {
    expect(ids({ categoryId: "tejidos" })).toEqual(["2"]);
    expect(ids({ status: "sold" })).toEqual(["3"]);
  });

  it("ordena por nombre y precio", () => {
    expect(ids({ sort: "name" })).toEqual(["3", "2", "1"]);
    expect(ids({ sort: "price-asc" })).toEqual(["1", "3", "2"]);
    expect(ids({ sort: "price-desc" })).toEqual(["2", "3", "1"]);
  });

  it("no modifica la lista original", () => {
    const before = products.map((p) => p.id);
    ids({ sort: "name" });
    expect(products.map((p) => p.id)).toEqual(before);
  });
});
