import { createProduct } from "@/app/actions/products";
import { ProductForm } from "@/components/product-form";
import { getCategories } from "@/lib/queries/products";

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div>
      <h1 className="font-heading text-2xl font-medium text-nogal">Nuevo producto</h1>
      <div className="mt-6">
        <ProductForm categories={categories} action={createProduct} />
      </div>
    </div>
  );
}
