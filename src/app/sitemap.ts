import type { MetadataRoute } from "next";
import { getPublicProductEntries } from "@/lib/queries/products";
import { siteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getPublicProductEntries().catch(() => []);

  return [
    { url: siteUrl },
    { url: `${siteUrl}/contacto` },
    ...products.map((product) => ({
      url: `${siteUrl}/productos/${product.slug}`,
      lastModified: product.updated_at,
    })),
  ];
}
