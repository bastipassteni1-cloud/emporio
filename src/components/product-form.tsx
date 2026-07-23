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
import type { Category, Product } from "@/lib/types";
import { MeasurementField } from "@/components/measurement-field";

const initialState: ProductFormState = { status: "idle" };

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

  return (
    <form action={formAction} className="max-w-lg space-y-4">
      {product && <input type="hidden" name="slug" value={product.slug} />}

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

      {existingImages.length > 0 && (
        <div className="space-y-2">
          <Label>Fotos actuales</Label>
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
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="images">
          {existingImages.length > 0 ? "Agregar más fotos" : "Fotos"}
        </Label>
        <Input id="images" name="images" type="file" accept="image/*" multiple />
      </div>

      {state.status === "error" && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? "Guardando..." : product ? "Guardar cambios" : "Crear producto"}
      </Button>
    </form>
  );
}
