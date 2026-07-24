import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  const description = `${formatPrice(product.price)} — ${product.description}`;

  return {
    title: product.name,
    description,
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
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-7 sm:py-8">
      <div className="grid gap-6 md:grid-cols-2 md:gap-10">
        <ProductGallery
          images={product.product_images ?? []}
          productName={product.name}
        />

        <div>
          {product.category && (
            <span
              className={`text-[0.72rem] font-bold tracking-wide uppercase ${theme.labelClassName}`}
            >
              {product.category.name}
            </span>
          )}
          <h1 className="mt-1 font-heading text-xl font-medium text-nogal sm:text-2xl">
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

          <p className="mt-3.5 text-sm leading-relaxed whitespace-pre-line text-nogal-suave sm:mt-4 sm:text-base">
            {product.description}
          </p>

          {product.dimensions && (
            <p className="mt-3.5 text-sm text-nogal sm:mt-4">
              <span className="font-medium">Medidas:</span>{" "}
              <span className="text-nogal-suave">{product.dimensions}</span>
            </p>
          )}

          <div className="mt-5 sm:mt-6">
            <WhatsAppButton productName={product.name} />
          </div>

          <Separator className="my-6 sm:my-8" />

          <div>
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
