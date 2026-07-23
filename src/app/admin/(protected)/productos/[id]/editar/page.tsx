import { notFound } from "next/navigation";
import { updateProduct } from "@/app/actions/products";
import { ProductForm } from "@/components/product-form";
import { getCategories, getProductById } from "@/lib/queries/products";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [categories, product] = await Promise.all([
    getCategories(),
    getProductById(id),
  ]);

  if (!product) notFound();

  const updateProductWithId = updateProduct.bind(null, product.id);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Editar producto</h1>
      <div className="mt-6">
        <ProductForm
          categories={categories}
          action={updateProductWithId}
          product={product}
        />
      </div>
    </div>
  );
}
