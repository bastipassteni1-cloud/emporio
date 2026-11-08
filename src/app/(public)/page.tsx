import { CatalogHero } from "@/components/catalog-hero";
import { CategoryFilter } from "@/components/category-filter";
import { ProductCard } from "@/components/product-card";
import { StorySection } from "@/components/story-section";
import { ValuesBand } from "@/components/values-band";
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
      {/* Portada y beneficios comparten fondo y terminan en una onda suave. */}
      <div className="relative bg-gradient-to-b from-lino to-[#fdf8f2] pb-10 sm:pb-14">
        <CatalogHero />
        <ValuesBand />
        <svg
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-8 w-full text-lino sm:h-12"
          viewBox="0 0 1440 48"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M0 14C240 40 480 44 760 26S1200 2 1440 20V48H0Z"
          />
        </svg>
      </div>

      <section
        id="catalogo"
        aria-labelledby="catalogo-title"
        className="mx-auto max-w-5xl scroll-mt-20 px-4 pt-4 sm:px-7"
      >
        <div className="text-center">
          <h2
            id="catalogo-title"
            className="font-heading text-3xl font-medium text-nogal sm:text-[2.5rem]"
          >
            Nuestro Catálogo
          </h2>
          <p className="mt-2 text-nogal-suave sm:text-lg">
            Descubre nuestras artesanías en madera, tejidos y más.
          </p>
        </div>

        <div className="mt-5 flex flex-wrap justify-center gap-2 sm:gap-3">
          <CategoryFilter categories={categories} activeSlug={categoria} />
        </div>

        {products.length === 0 ? (
          <p className="mt-16 pb-16 text-center text-muted-foreground">
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
      </section>

      <StorySection />
    </div>
  );
}
