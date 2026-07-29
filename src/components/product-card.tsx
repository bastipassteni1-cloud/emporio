"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice, formatProductStatus } from "@/lib/format";
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
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-linea bg-crudo shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      <div
        className="relative flex aspect-square items-center justify-center"
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
              className="absolute top-1/2 left-1.5 flex size-6 -translate-y-1/2 items-center justify-center rounded-full bg-crudo/90 text-nogal shadow-sm sm:left-2 sm:size-7"
            >
              <ChevronLeftIcon className="size-3.5 sm:size-4" />
            </button>
            <button
              type="button"
              aria-label="Foto siguiente"
              onClick={() => setIndex((i) => (i === images.length - 1 ? 0 : i + 1))}
              className="absolute top-1/2 right-1.5 flex size-6 -translate-y-1/2 items-center justify-center rounded-full bg-crudo/90 text-nogal shadow-sm sm:right-2 sm:size-7"
            >
              <ChevronRightIcon className="size-3.5 sm:size-4" />
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
      </div>

      <Link
        href={href}
        className={cn(
          "flex flex-1 flex-col gap-1 px-3 pt-3 pb-4 sm:gap-1.5 sm:px-4 sm:pt-4 sm:pb-5",
          theme.patternClassName,
        )}
      >
        <div className="flex items-center justify-between gap-2">
          {product.category && (
            <span
              className={`text-[0.68rem] font-bold tracking-wide uppercase sm:text-[0.72rem] ${theme.labelClassName}`}
            >
              {product.category.name}
            </span>
          )}
          {product.status !== "available" && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-[0.65rem] font-semibold text-nogal-suave">
              {formatProductStatus(product.status)}
            </span>
          )}
        </div>
        <p className="font-heading text-base font-medium text-nogal sm:text-lg">
          {product.name}
        </p>
        <div className="mt-auto flex items-center justify-between pt-2 sm:pt-2.5">
          <span className="text-sm font-bold text-nogal sm:text-base">
            {formatPrice(product.price)}
          </span>
          <span className="rounded-full border-[1.5px] border-nogal px-3 py-1 text-xs font-semibold text-nogal transition-colors group-hover:bg-nogal group-hover:text-crudo sm:px-4 sm:py-1.5 sm:text-[0.82rem]">
            Ver
          </span>
        </div>
      </Link>
    </div>
  );
}
