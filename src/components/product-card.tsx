"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";
import { getCategoryTheme } from "@/lib/category-theme";
import { getProductImageUrl } from "@/lib/storage";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const images = (product.product_images ?? [])
    .slice()
    .sort((a, b) => a.position - b.position);
  const theme = getCategoryTheme(product.category?.slug);
  const [index, setIndex] = useState(0);
  const href = `/productos/${product.slug}`;

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-linea bg-crudo transition-transform hover:-translate-y-1 hover:shadow-lg">
      <div
        className="relative flex aspect-[4/3] items-center justify-center"
        style={images.length === 0 ? { backgroundImage: theme.gradient } : undefined}
      >
        <Link href={href} aria-label={product.name} className="absolute inset-0">
          {images.length > 0 ? (
            <Image
              src={getProductImageUrl(images[index].storage_path)}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 25vw, 50vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <div className="h-[46%] w-[46%] opacity-55">{theme.icon}</div>
            </div>
          )}
        </Link>

        {images.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Foto anterior"
              onClick={() =>
                setIndex((i) => (i === 0 ? images.length - 1 : i - 1))
              }
              className="absolute top-1/2 left-2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full bg-crudo/90 text-nogal shadow-sm"
            >
              <ChevronLeftIcon className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Foto siguiente"
              onClick={() => setIndex((i) => (i === images.length - 1 ? 0 : i + 1))}
              className="absolute top-1/2 right-2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full bg-crudo/90 text-nogal shadow-sm"
            >
              <ChevronRightIcon className="size-4" />
            </button>
            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
              {images.map((image, i) => (
                <button
                  key={image.id}
                  type="button"
                  aria-label={`Ver foto ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={cn(
                    "size-1.5 rounded-full transition-colors",
                    i === index ? "bg-nogal" : "bg-crudo/80",
                  )}
                />
              ))}
            </div>
          </>
        )}

        <span className="pointer-events-none absolute top-3 left-3 rounded-full bg-crudo/90 px-3 py-1 font-caveat text-sm font-bold text-nogal-suave">
          hecho a mano
        </span>
        {product.status !== "available" && (
          <span className="pointer-events-none absolute top-3 right-3 rounded-full bg-crudo/90 px-3 py-1 text-xs font-semibold text-nogal-suave">
            {product.status === "sold" ? "Vendido" : "Hecho a pedido"}
          </span>
        )}
      </div>

      <Link href={href} className="flex flex-1 flex-col gap-1.5 px-4 pt-4 pb-5">
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
      </Link>
    </div>
  );
}
