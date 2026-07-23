"use server";

import { revalidatePath } from "next/cache";
import { categorySchema } from "@/lib/schemas/category";
import { generateSlug } from "@/lib/slug";
import { createClient } from "@/lib/supabase/server";

export type CategoryFormState = {
  status: "idle" | "error";
  message?: string;
};

export async function createCategory(
  _prevState: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  const parsed = categorySchema.safeParse({ name: formData.get("name") });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Datos inválidos.",
    };
  }

  const supabase = await createClient();
  const slug = generateSlug(parsed.data.name);

  const { error } = await supabase
    .from("categories")
    .insert({ name: parsed.data.name, slug });

  if (error) {
    return {
      status: "error",
      message:
        error.code === "23505"
          ? "Ya existe una categoría con ese nombre."
          : "No se pudo crear la categoría.",
    };
  }

  revalidatePath("/admin/categorias");
  revalidatePath("/");
  return { status: "idle" };
}

export type DeleteCategoryResult = { success: boolean; message?: string };

export async function deleteCategory(categoryId: string): Promise<DeleteCategoryResult> {
  const supabase = await createClient();

  const { count } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("category_id", categoryId);

  if (count && count > 0) {
    return {
      success: false,
      message: `No se puede eliminar: hay ${count} producto(s) en esta categoría.`,
    };
  }

  const { error } = await supabase.from("categories").delete().eq("id", categoryId);
  if (error) {
    return { success: false, message: "No se pudo eliminar la categoría." };
  }

  revalidatePath("/admin/categorias");
  revalidatePath("/");
  return { success: true };
}
