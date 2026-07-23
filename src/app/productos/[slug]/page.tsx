import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ContactForm } from "@/components/contact-form";
import { ProductGallery } from "@/components/product-gallery";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { formatPrice, formatProductStatus } from "@/lib/format";
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

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        <ProductGallery
          images={product.product_images ?? []}
          productName={product.name}
        />

        <div>
          {product.category && (
            <p className="text-sm text-muted-foreground">
              {product.category.name}
            </p>
          )}
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            {product.name}
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <p className="text-xl font-semibold">
              {formatPrice(product.price)}
            </p>
            {product.status !== "available" && (
              <Badge variant="secondary">
                {formatProductStatus(product.status)}
              </Badge>
            )}
          </div>

          <p className="mt-4 whitespace-pre-line text-muted-foreground">
            {product.description}
          </p>

          {product.dimensions && (
            <p className="mt-4 text-sm">
              <span className="font-medium">Medidas:</span>{" "}
              {product.dimensions}
            </p>
          )}

          <div className="mt-6">
            <WhatsAppButton productName={product.name} />
          </div>

          <Separator className="my-8" />

          <div>
            <h2 className="text-lg font-medium">¿Tienes una consulta?</h2>
            <p className="mt-1 text-sm text-muted-foreground">
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
