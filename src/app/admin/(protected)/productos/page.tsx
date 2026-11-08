import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { AdminProductsTable } from "@/components/admin-products-table";
import { Button } from "@/components/ui/button";
import { getCategories, getProducts } from "@/lib/queries/products";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-medium text-nogal">
          Productos
        </h1>
        <Button
          nativeButton={false}
          render={
            <Link href="/admin/productos/nuevo">
              <PlusIcon aria-hidden />
              Nuevo producto
            </Link>
          }
        />
      </div>

      {products.length === 0 ? (
        <p className="mt-8 text-nogal-suave">
          Todavía no hay productos. Crea el primero.
        </p>
      ) : (
        <AdminProductsTable products={products} categories={categories} />
      )}
    </div>
  );
}
