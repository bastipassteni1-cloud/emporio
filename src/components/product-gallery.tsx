"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { getProductImageUrl } from "@/lib/storage";
import type { ProductImage } from "@/lib/types";

const ZOOM_SCALE = 2.2;

export function ProductGallery({
  images,
  productName,
}: {
  images: ProductImage[];
  productName: string;
}) {
  const sorted = images.slice().sort((a, b) => a.position - b.position);
  const [active, setActive] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin({
      x: Math.min(100, Math.max(0, x)),
      y: Math.min(100, Math.max(0, y)),
    });
  }

  if (sorted.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        Sin fotos disponibles
      </div>
    );
  }

  return (
    <div>
      <div
        ref={containerRef}
        className="relative aspect-square cursor-zoom-in overflow-hidden rounded-2xl bg-muted"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <Image
          src={getProductImageUrl(sorted[active].storage_path)}
          alt={productName}
          fill
          className="object-contain transition-transform duration-150 ease-out"
          style={{
            transform: isZoomed ? `scale(${ZOOM_SCALE})` : "scale(1)",
            transformOrigin: `${origin.x}% ${origin.y}%`,
          }}
          sizes="(min-width: 768px) 50vw, 100vw"
          priority
        />
      </div>
      {sorted.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {sorted.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => {
                setActive(index);
                setIsZoomed(false);
              }}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-md border-2",
                index === active ? "border-primary" : "border-transparent",
              )}
            >
              <Image
                src={getProductImageUrl(image.storage_path)}
                alt={`${productName} ${index + 1}`}
                fill
                className="object-contain"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
