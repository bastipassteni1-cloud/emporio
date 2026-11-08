import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRightIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/contact-form";
import { ProductGallery } from "@/components/product-gallery";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { formatPrice, formatProductStatus } from "@/lib/format";
import { getCategoryTheme } from "@/lib/category-theme";
import { getProductBySlug } from "@/lib/queries/products";
import { getProductImageUrl } from "@/lib/storage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return {};

  const cover = product.product_images
    ?.slice()
    .sort((a, b) => a.position - b.position)[0];
  const summary =
    product.description ||
    `${product.category?.name ?? "Artesanía"} hecha a mano`;
  const description = `${formatPrice(product.price)} — ${summary}`;

  return {
    title: product.name,
    description,
    alternates: { canonical: `/productos/${product.slug}` },
    openGraph: {
      title: product.name,
      description,
      images: cover ? [getProductImageUrl(cover.storage_path)] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const theme = getCategoryTheme(product.category?.slug);

  return (
    <div className="mx-auto max-w-5xl px-4 py-5 sm:px-7 sm:py-7">
      <nav aria-label="Ruta de navegación" className="mb-4 sm:mb-5">
        <ol className="flex flex-wrap items-center gap-1 text-sm text-nogal-suave">
          <li>
            <Link href="/#catalogo" className="hover:text-nogal hover:underline">
              Catálogo
            </Link>
          </li>
          {product.category && (
            <li className="flex items-center gap-1">
              <ChevronRightIcon className="size-3.5" aria-hidden />
              <Link
                href={`/?categoria=${product.category.slug}#catalogo`}
                className="hover:text-nogal hover:underline"
              >
                {product.category.name}
              </Link>
            </li>
          )}
          <li className="flex items-center gap-1">
            <ChevronRightIcon className="size-3.5" aria-hidden />
            <span aria-current="page" className="font-semibold text-nogal">
              {product.name}
            </span>
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-10">
        <ProductGallery
          images={product.product_images ?? []}
          productName={product.name}
        />

        <div>
          {product.category && (
            <span
              className="inline-flex items-center gap-1.5 text-[0.72rem] font-bold tracking-wide uppercase"
              style={{ color: theme.accentColor }}
            >
              <theme.icon className="size-3.5" aria-hidden />
              {product.category.name}
            </span>
          )}
          <h1 className="mt-1 font-heading text-2xl font-medium text-nogal sm:text-3xl">
            {product.name}
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <p className="text-lg font-bold text-nogal sm:text-xl">
              {formatPrice(product.price)}
            </p>
            {product.status !== "available" && (
              <Badge variant="secondary">
                {formatProductStatus(product.status)}
              </Badge>
            )}
          </div>

          {product.description && (
            <p className="mt-3.5 text-sm leading-relaxed whitespace-pre-line text-nogal-suave sm:mt-4 sm:text-base">
              {product.description}
            </p>
          )}

          {product.dimensions && (
            <p className="mt-3.5 text-sm text-nogal sm:mt-4">
              <span className="font-medium">Medidas:</span>{" "}
              <span className="text-nogal-suave">{product.dimensions}</span>
            </p>
          )}

          <div className="mt-5 flex flex-col gap-2.5 sm:mt-6 sm:flex-row sm:flex-wrap">
            <WhatsAppButton productName={product.name} />
            <Button
              size="lg"
              variant="outline"
              className="w-full rounded-full border-nogal/40 bg-transparent px-5 sm:w-auto"
              nativeButton={false}
              render={<Link href="/#catalogo">Volver al catálogo</Link>}
            />
          </div>

          <div className="mt-6 rounded-lg border border-linea bg-crudo p-5 sm:mt-8 sm:p-6">
            <h2 className="font-heading text-base font-medium text-nogal sm:text-lg">
              ¿Tienes una consulta?
            </h2>
            <p className="mt-1 text-sm text-nogal-suave">
              Escríbenos y te respondemos a la brevedad.
            </p>
            <div className="mt-4">
              <ContactForm productId={product.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
