"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ImageOffIcon, SearchIcon } from "lucide-react";
import { DeleteProductButton } from "@/components/delete-product-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  filterAndSortProducts,
  type ProductFilters,
  type ProductSort,
} from "@/lib/admin-products";
import {
  formatPrice,
  formatProductStatus,
  PRODUCT_STATUS_LABELS,
} from "@/lib/format";
import { getProductImageUrl } from "@/lib/storage";
import type { Category, Product, ProductStatus } from "@/lib/types";

const selectClass =
  "h-8 min-w-0 rounded-lg border border-input bg-transparent px-2 text-sm text-nogal focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ocre-texto";

function getCoverImage(product: Product) {
  return (product.product_images ?? [])
    .slice()
    .sort((a, b) => a.position - b.position)[0];
}

function ProductThumb({ product }: { product: Product }) {
  const cover = getCoverImage(product);

  return (
    <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-muted">
      {cover ? (
        <Image
          src={getProductImageUrl(cover.storage_path)}
          alt={product.name}
          fill
          className="object-cover"
          sizes="48px"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
          <ImageOffIcon className="size-4" aria-hidden />
        </div>
      )}
    </div>
  );
}

function ProductActions({ product }: { product: Product }) {
  return (
    <>
      <Button
        variant="outline"
        size="sm"
        nativeButton={false}
        render={
          <Link href={`/admin/productos/${product.id}/editar`}>Editar</Link>
        }
      />
      <DeleteProductButton productId={product.id} productName={product.name} />
    </>
  );
}

export function AdminProductsTable({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const [filters, setFilters] = useState<ProductFilters>({
    query: "",
    categoryId: "",
    status: "",
    sort: "newest",
  });

  const visible = useMemo(
    () => filterAndSortProducts(products, filters),
    [products, filters],
  );

  return (
    <div>
      <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-[minmax(0,2fr)_1fr_1fr_1fr]">
        <div className="relative sm:col-span-2 lg:col-span-1">
          <SearchIcon
            className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-nogal-suave"
            aria-hidden
          />
          <Input
            type="search"
            aria-label="Buscar por nombre"
            placeholder="Buscar por nombre"
            className="pl-8"
            value={filters.query}
            onChange={(e) =>
              setFilters((f) => ({ ...f, query: e.target.value }))
            }
          />
        </div>
        <select
          aria-label="Filtrar por categoría"
          className={selectClass}
          value={filters.categoryId}
          onChange={(e) =>
            setFilters((f) => ({ ...f, categoryId: e.target.value }))
          }
        >
          <option value="">Todas las categorías</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <select
          aria-label="Filtrar por estado"
          className={selectClass}
          value={filters.status}
          onChange={(e) =>
            setFilters((f) => ({
              ...f,
              status: e.target.value as ProductStatus | "",
            }))
          }
        >
          <option value="">Todos los estados</option>
          {Object.entries(PRODUCT_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select
          aria-label="Ordenar productos"
          className={selectClass}
          value={filters.sort}
          onChange={(e) =>
            setFilters((f) => ({ ...f, sort: e.target.value as ProductSort }))
          }
        >
          <option value="newest">Más recientes</option>
          <option value="name">Nombre (A–Z)</option>
          <option value="price-asc">Precio: menor a mayor</option>
          <option value="price-desc">Precio: mayor a menor</option>
        </select>
      </div>

      <p className="mt-3 text-sm text-nogal-suave" aria-live="polite">
        {visible.length} de {products.length} productos
      </p>

      {visible.length === 0 ? (
        <p className="mt-6 text-nogal-suave">
          Ningún producto coincide con estos filtros.
        </p>
      ) : (
        <>
          <ul className="mt-2 divide-y divide-linea md:hidden">
            {visible.map((product) => (
              <li key={product.id} className="py-3">
                <div className="flex gap-3">
                  <ProductThumb product={product} />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium break-words text-nogal">
                      {product.name}
                    </p>
                    <p className="text-sm text-nogal-suave">
                      {product.category?.name ?? "Sin categoría"}
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-nogal">
                    {formatPrice(product.price)}
                  </span>
                  <Badge variant="secondary">
                    {formatProductStatus(product.status)}
                  </Badge>
                  <div className="ml-auto flex gap-1">
                    <ProductActions product={product} />
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="hidden md:block">
            <Table className="mt-2">
              <TableHeader>
                <TableRow>
                  <TableHead>Foto</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <ProductThumb product={product} />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category?.name ?? "—"}</TableCell>
                    <TableCell>{formatPrice(product.price)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {formatProductStatus(product.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="space-x-2 text-right">
                      <ProductActions product={product} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
}
