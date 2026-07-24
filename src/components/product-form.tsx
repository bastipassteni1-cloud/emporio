"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
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
import type { Category, Product } from "@/lib/types";
import { MeasurementField } from "@/components/measurement-field";

const initialState: ProductFormState = { status: "idle" };

type NewImage = { storage_path: string; position: number };

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
  const existingImages = product?.product_images ?? [];
  const [removedIds, setRemovedIds] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<NewImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;

    setUploading(true);
    setUploadError(null);
    const supabase = createClient();
    const uploaded: NewImage[] = [];
    let position =
      existingImages.length + newImages.length - removedIds.length;

    for (const file of files) {
      const path = `${crypto.randomUUID()}-${file.name}`;
      const { error } = await supabase.storage
        .from("product-images")
        .upload(path, file);
      if (error) {
        setUploadError("No se pudo subir una de las fotos. Intenta de nuevo.");
        continue;
      }
      uploaded.push({ storage_path: path, position: position++ });
    }

    setNewImages((prev) => [...prev, ...uploaded]);
    setUploading(false);
  }

  return (
    <form action={formAction} className="max-w-lg space-y-4">
      {product && <input type="hidden" name="slug" value={product.slug} />}
      {newImages.map((img) => (
        <input
          key={img.storage_path}
          type="hidden"
          name="new_images"
          value={JSON.stringify(img)}
        />
      ))}

      <div className="space-y-2">
        <Label htmlFor="name">Nombre</Label>
        <Input id="name" name="name" defaultValue={product?.name} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={product?.description}
          required
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
          required
        />
      </div>

      <MeasurementField defaultValue={product?.dimensions ?? ""} />

      <div className="grid grid-cols-2 gap-4">
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

      {(existingImages.length > 0 || newImages.length > 0) && (
        <div className="space-y-2">
          <Label>Fotos</Label>
          <div className="flex flex-wrap gap-3">
            {existingImages.map((image) => {
              const marked = removedIds.includes(image.id);
              return (
                <div key={image.id} className="relative">
                  <div
                    className="relative h-20 w-20 overflow-hidden rounded-md border"
                    style={{ opacity: marked ? 0.3 : 1 }}
                  >
                    <Image
                      src={getProductImageUrl(image.storage_path)}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  {marked && (
                    <input type="hidden" name="remove_image_ids" value={image.id} />
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      setRemovedIds((prev) =>
                        marked
                          ? prev.filter((id) => id !== image.id)
                          : [...prev, image.id],
                      )
                    }
                    className="mt-1 block w-full text-xs text-muted-foreground hover:underline"
                  >
                    {marked ? "Deshacer" : "Eliminar"}
                  </button>
                </div>
              );
            })}
            {newImages.map((img) => (
              <div key={img.storage_path} className="relative">
                <div className="relative h-20 w-20 overflow-hidden rounded-md border">
                  <Image
                    src={getProductImageUrl(img.storage_path)}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setNewImages((prev) =>
                      prev.filter((i) => i.storage_path !== img.storage_path),
                    )
                  }
                  className="mt-1 block w-full text-xs text-muted-foreground hover:underline"
                >
                  Quitar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="images">
          {existingImages.length > 0 || newImages.length > 0
            ? "Agregar más fotos"
            : "Fotos"}
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
        {uploadError && <p className="text-sm text-destructive">{uploadError}</p>}
      </div>

      {state.status === "error" && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}

      <Button type="submit" disabled={pending || uploading}>
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
