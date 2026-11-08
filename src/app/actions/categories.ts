"use server";

import { revalidatePath } from "next/cache";
import { categorySchema } from "@/lib/schemas/category";
import { generateSlug } from "@/lib/slug";
import { requireAdmin } from "@/lib/auth";

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

  const supabase = await requireAdmin();
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

export async function updateCategory(
  categoryId: string,
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

  const supabase = await requireAdmin();

  // El slug no cambia: mantiene las URLs y el estilo de la categoría.
  const { error } = await supabase
    .from("categories")
    .update({ name: parsed.data.name })
    .eq("id", categoryId);

  if (error) {
    return { status: "error", message: "No se pudo renombrar la categoría." };
  }

  revalidatePath("/admin/categorias");
  revalidatePath("/", "layout");
  return { status: "idle" };
}

export type DeleteCategoryResult = { success: boolean; message?: string };

export async function deleteCategory(categoryId: string): Promise<DeleteCategoryResult> {
  const supabase = await requireAdmin();

  const { count, error: countError } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("category_id", categoryId);

  if (countError) {
    return { success: false, message: "No se pudo eliminar la categoría." };
  }

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
