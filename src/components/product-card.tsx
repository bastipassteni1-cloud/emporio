import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice, formatProductStatus } from "@/lib/format";
import { getProductImageUrl } from "@/lib/storage";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const cover = product.product_images
    ?.slice()
    .sort((a, b) => a.position - b.position)[0];

  return (
    <Link href={`/productos/${product.slug}`}>
      <Card className="overflow-hidden py-0 transition-shadow hover:shadow-md">
        <div className="relative aspect-square bg-muted">
          {cover ? (
            <Image
              src={getProductImageUrl(cover.storage_path)}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 25vw, 50vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Sin foto
            </div>
          )}
          {product.status !== "available" && (
            <Badge variant="secondary" className="absolute top-2 right-2">
              {formatProductStatus(product.status)}
            </Badge>
          )}
        </div>
        <CardContent className="px-4 pb-4">
          <p className="font-medium leading-tight">{product.name}</p>
          {product.category && (
            <p className="text-sm text-muted-foreground">
              {product.category.name}
            </p>
          )}
          <p className="mt-1 font-semibold">{formatPrice(product.price)}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
