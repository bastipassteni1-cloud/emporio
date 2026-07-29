"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import type { ProductFormState } from "@/app/actions/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getProductImageUrl } from "@/lib/storage";
import { formatProductStatus } from "@/lib/format";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type { Category, Product } from "@/lib/types";
import { MeasurementField } from "@/components/measurement-field";

const initialState: ProductFormState = { status: "idle" };

type ImageItem = {
  key: string;
  storagePath: string;
  existingId?: string;
};

export function ProductForm({
  categories,
  action,
  product,
}: {
  categories: Category[];
  action: (state: ProductFormState, formData: FormData) => Promise<ProductFormState>;
  product?: Product;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [images, setImages] = useState<ImageItem[]>(() =>
    (product?.product_images ?? [])
      .slice()
      .sort((a, b) => a.position - b.position)
      .map((img) => ({
        key: img.id,
        storagePath: img.storage_path,
        existingId: img.id,
      })),
  );
  const [removedIds, setRemovedIds] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;

    setUploading(true);
    setUploadError(null);
    const supabase = createClient();
    const uploaded: ImageItem[] = [];

    for (const file of files) {
      const path = `${crypto.randomUUID()}-${file.name}`;
      const { error } = await supabase.storage
        .from("product-images")
        .upload(path, file);
      if (error) {
        setUploadError("No se pudo subir una de las fotos. Intenta de nuevo.");
        continue;
      }
      uploaded.push({ key: path, storagePath: path });
    }

    setImages((prev) => [...prev, ...uploaded]);
    setUploading(false);
  }

  function removeImage(item: ImageItem) {
    setImages((prev) => prev.filter((i) => i.key !== item.key));
    if (item.existingId) {
      setRemovedIds((prev) => [...prev, item.existingId!]);
    }
  }

  function moveImage(index: number, direction: -1 | 1) {
    setImages((prev) => {
      const next = prev.slice();
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  return (
    <form action={formAction} className="max-w-4xl">
      {product && <input type="hidden" name="slug" value={product.slug} />}
      {removedIds.map((id) => (
        <input key={id} type="hidden" name="remove_image_ids" value={id} />
      ))}
      {images.map((img, index) =>
        img.existingId ? (
          <input
            key={img.key}
            type="hidden"
            name="existing_image_order"
            value={JSON.stringify({ id: img.existingId, position: index })}
          />
        ) : (
          <input
            key={img.key}
            type="hidden"
            name="new_images"
            value={JSON.stringify({
              storage_path: img.storagePath,
              position: index,
            })}
          />
        ),
      )}

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" name="name" defaultValue={product?.name} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              name="description"
              rows={4}
              defaultValue={product?.description}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Precio (CLP)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              min={0}
              step={1}
              defaultValue={product?.price}
            />
          </div>

          <MeasurementField defaultValue={product?.dimensions ?? ""} />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select name="status" defaultValue={product?.status ?? "available"}>
                <SelectTrigger id="status" className="w-full">
                  <SelectValue>
                    {(value: string) => formatProductStatus(value)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Disponible</SelectItem>
                  <SelectItem value="sold">Vendido</SelectItem>
                  <SelectItem value="made_to_order">Hecho a pedido</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category_id">Categoría</Label>
              <Select name="category_id" defaultValue={product?.category_id ?? undefined}>
                <SelectTrigger id="category_id" className="w-full">
                  <SelectValue placeholder="Selecciona una categoría">
                    {(value: string) =>
                      categories.find((c) => c.id === value)?.name ??
                      "Selecciona una categoría"
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Fotos</Label>
            {images.length > 0 && (
              <p className="text-xs text-muted-foreground">
                La primera foto es la que se muestra como portada. Usa las
                flechas para cambiar el orden.
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              {images.map((img, index) => (
                <div key={img.key} className="relative">
                  <div className="relative h-20 w-20 overflow-hidden rounded-md border">
                    <Image
                      src={getProductImageUrl(img.storagePath)}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                    {index === 0 && (
                      <span className="absolute top-0.5 left-0.5 rounded bg-nogal/80 px-1 text-[0.6rem] font-semibold text-crudo">
                        Portada
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center justify-center gap-0.5">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveImage(index, -1)}
                      aria-label="Mover a la izquierda"
                      className={cn(
                        "flex size-5 items-center justify-center rounded text-muted-foreground hover:bg-muted",
                        index === 0 && "opacity-30",
                      )}
                    >
                      <ChevronLeftIcon className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(img)}
                      className="px-1 text-[0.7rem] text-muted-foreground hover:underline"
                    >
                      Quitar
                    </button>
                    <button
                      type="button"
                      disabled={index === images.length - 1}
                      onClick={() => moveImage(index, 1)}
                      aria-label="Mover a la derecha"
                      className={cn(
                        "flex size-5 items-center justify-center rounded text-muted-foreground hover:bg-muted",
                        index === images.length - 1 && "opacity-30",
                      )}
                    >
                      <ChevronRightIcon className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="images">
              {images.length > 0 ? "Agregar más fotos" : "Subir fotos"}
            </Label>
            <Input
              id="images"
              type="file"
              accept="image/*"
              multiple
              disabled={uploading}
              onChange={handleFilesSelected}
            />
            {uploading && (
              <p className="text-sm text-muted-foreground">Subiendo fotos...</p>
            )}
            {uploadError && (
              <p className="text-sm text-destructive">{uploadError}</p>
            )}
          </div>
        </div>
      </div>

      {state.status === "error" && (
        <p className="mt-4 text-sm text-destructive">{state.message}</p>
      )}

      <Button type="submit" disabled={pending || uploading} className="mt-6">
        {pending
          ? "Guardando..."
          : uploading
            ? "Esperando fotos..."
            : product
              ? "Guardar cambios"
              : "Crear producto"}
      </Button>
    </form>
  );
}
