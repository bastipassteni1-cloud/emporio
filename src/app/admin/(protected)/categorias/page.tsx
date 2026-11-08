import { CategoryManager } from "@/components/category-manager";
import { getCategoriesWithCounts } from "@/lib/queries/admin";

export default async function AdminCategoriesPage() {
  const categories = await getCategoriesWithCounts();

  return (
    <div>
      <h1 className="font-heading text-2xl font-medium text-nogal">Categorías</h1>
      <div className="mt-6">
        <CategoryManager categories={categories} />
      </div>
    </div>
  );
}
