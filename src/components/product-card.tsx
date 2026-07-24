import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { getCategoryTheme } from "@/lib/category-theme";
import { getProductImageUrl } from "@/lib/storage";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const cover = product.product_images
    ?.slice()
    .sort((a, b) => a.position - b.position)[0];
  const theme = getCategoryTheme(product.category?.slug);

  return (
    <Link
      href={`/productos/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-linea bg-crudo transition-transform hover:-translate-y-1 hover:shadow-lg"
    >
      <div
        className="relative flex aspect-[4/3] items-center justify-center"
        style={!cover ? { backgroundImage: theme.gradient } : undefined}
      >
        {cover ? (
          <Image
            src={getProductImageUrl(cover.storage_path)}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(min-width: 768px) 25vw, 50vw"
          />
        ) : (
          <div className="h-[46%] w-[46%] opacity-55">{theme.icon}</div>
        )}
        <span className="absolute top-3 left-3 rounded-full bg-crudo/90 px-3 py-1 font-caveat text-sm font-bold text-nogal-suave">
          hecho a mano
        </span>
        {product.status !== "available" && (
          <span className="absolute top-3 right-3 rounded-full bg-crudo/90 px-3 py-1 text-xs font-semibold text-nogal-suave">
            {product.status === "sold" ? "Vendido" : "Hecho a pedido"}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 px-4 pt-4 pb-5">
        {product.category && (
          <span
            className={`text-[0.72rem] font-bold tracking-wide uppercase ${theme.labelClassName}`}
          >
            {product.category.name}
          </span>
        )}
        <p className="font-heading text-lg font-medium text-nogal">
          {product.name}
        </p>
        <div className="mt-auto flex items-center justify-between pt-2.5">
          <span className="text-base font-bold text-nogal">
            {formatPrice(product.price)}
          </span>
          <span className="rounded-full border-[1.5px] border-nogal px-4 py-1.5 text-[0.82rem] font-semibold text-nogal transition-colors group-hover:bg-nogal group-hover:text-crudo">
            Ver
          </span>
        </div>
      </div>
    </Link>
  );
}
