"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { productSchema } from "@/lib/schemas/product";
import { generateSlug } from "@/lib/slug";
import { createClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";

export type ProductFormState = {
  status: "idle" | "error";
  message?: string;
};

async function ensureUniqueSlug(
  supabase: SupabaseClient,
  base: string,
  excludeId?: string,
): Promise<string> {
  const candidate = base || "producto";
  let query = supabase.from("products").select("id").eq("slug", candidate);
  if (excludeId) query = query.neq("id", excludeId);
  const { data } = await query.maybeSingle();

  if (!data) return candidate;
  return `${candidate}-${crypto.randomUUID().slice(0, 6)}`;
}

async function uploadImages(
  supabase: SupabaseClient,
  productId: string,
  files: File[],
  startPosition: number,
) {
  for (const [index, file] of files.entries()) {
    if (!file.size) continue;
    const path = `${productId}/${crypto.randomUUID()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(path, file);
    if (uploadError) throw uploadError;

    const { error: insertError } = await supabase.from("product_images").insert({
      product_id: productId,
      storage_path: path,
      position: startPosition + index,
    });
    if (insertError) throw insertError;
  }
}

export async function createProduct(
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    dimensions: formData.get("dimensions"),
    status: formData.get("status"),
    category_id: formData.get("category_id"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Datos inválidos.",
    };
  }

  const supabase = await createClient();
  const slug = await ensureUniqueSlug(supabase, generateSlug(parsed.data.name));

  const { data: product, error } = await supabase
    .from("products")
    .insert({ ...parsed.data, dimensions: parsed.data.dimensions || null, slug })
    .select("id")
    .single();

  if (error || !product) {
    return { status: "error", message: "No se pudo crear el producto." };
  }

  const images = formData.getAll("images").filter((f): f is File => f instanceof File);
  try {
    await uploadImages(supabase, product.id, images, 0);
  } catch {
    return {
      status: "error",
      message: "El producto se creó pero hubo un error subiendo las fotos.",
    };
  }

  revalidatePath("/admin/productos");
  revalidatePath("/");
  redirect("/admin/productos");
}

export async function updateProduct(
  productId: string,
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    dimensions: formData.get("dimensions"),
    status: formData.get("status"),
    category_id: formData.get("category_id"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Datos inválidos.",
    };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("products")
    .update({
      ...parsed.data,
      dimensions: parsed.data.dimensions || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", productId);

  if (error) {
    return { status: "error", message: "No se pudo actualizar el producto." };
  }

  const removeIds = formData.getAll("remove_image_ids") as string[];
  if (removeIds.length > 0) {
    const { data: imagesToRemove } = await supabase
      .from("product_images")
      .select("id, storage_path")
      .in("id", removeIds);

    if (imagesToRemove && imagesToRemove.length > 0) {
      await supabase.storage
        .from("product-images")
        .remove(imagesToRemove.map((img) => img.storage_path));
      await supabase
        .from("product_images")
        .delete()
        .in("id", imagesToRemove.map((img) => img.id));
    }
  }

  const { count } = await supabase
    .from("product_images")
    .select("id", { count: "exact", head: true })
    .eq("product_id", productId);

  const images = formData.getAll("images").filter((f): f is File => f instanceof File);
  try {
    await uploadImages(supabase, productId, images, count ?? 0);
  } catch {
    return {
      status: "error",
      message: "El producto se actualizó pero hubo un error subiendo las fotos.",
    };
  }

  revalidatePath("/admin/productos");
  revalidatePath("/");
  revalidatePath(`/productos/${formData.get("slug")}`);
  redirect("/admin/productos");
}

export async function deleteProduct(productId: string) {
  const supabase = await createClient();

  const { data: images } = await supabase
    .from("product_images")
    .select("storage_path")
    .eq("product_id", productId);

  if (images && images.length > 0) {
    await supabase.storage
      .from("product-images")
      .remove(images.map((img) => img.storage_path));
  }

  await supabase.from("products").delete().eq("id", productId);

  revalidatePath("/admin/productos");
  revalidatePath("/");
}
