import { CategoryManager } from "@/components/category-manager";
import { getCategories } from "@/lib/queries/products";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Categorías</h1>
      <div className="mt-6">
        <CategoryManager categories={categories} />
      </div>
    </div>
  );
}
