import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/lib/types";

export type CategoryWithCount = Category & { productCount: number };

export async function getCategoriesWithCounts(): Promise<CategoryWithCount[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, products(count)")
    .order("name");

  if (error) throw error;

  return (data as unknown as (Category & { products: { count: number }[] })[]).map(
    ({ products, ...category }) => ({
      ...category,
      productCount: products[0]?.count ?? 0,
    }),
  );
}

export async function getAdminCounts() {
  const supabase = await createClient();
  const count = async (table: string) => {
    const { count, error } = await supabase
      .from(table)
      .select("id", { count: "exact", head: true });
    if (error) throw error;
    return count ?? 0;
  };

  const [products, categories, messages] = await Promise.all([
    count("products"),
    count("categories"),
    count("contact_messages"),
  ]);

  return { products, categories, messages };
}
