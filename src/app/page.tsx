import { CatalogHero } from "@/components/catalog-hero";
import { CategoryFilter } from "@/components/category-filter";
import { ProductCard } from "@/components/product-card";
import { getCategories, getProducts } from "@/lib/queries/products";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(categoria),
  ]);

  return (
    <div>
      <CatalogHero />

      <div className="mx-auto max-w-5xl px-4 sm:px-7">
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <CategoryFilter categories={categories} activeSlug={categoria} />
        </div>

        {products.length === 0 ? (
          <p className="mt-16 text-center text-muted-foreground">
            Aún no hay productos publicados
            {categoria ? " en esta categoría" : ""}. Vuelve pronto.
          </p>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-3 pb-10 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 md:gap-7">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
