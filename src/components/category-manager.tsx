"use client";

import { useActionState, useTransition } from "react";
import { toast } from "sonner";
import {
  createCategory,
  deleteCategory,
  type CategoryFormState,
} from "@/app/actions/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Category } from "@/lib/types";

const initialState: CategoryFormState = { status: "idle" };

export function CategoryManager({ categories }: { categories: Category[] }) {
  const [state, formAction, pending] = useActionState(createCategory, initialState);
  const [isDeleting, startDeleteTransition] = useTransition();

  return (
    <div>
      <form action={formAction} className="flex max-w-sm gap-2">
        <Input name="name" placeholder="Nombre de la categoría" required />
        <Button type="submit" disabled={pending}>
          {pending ? "Agregando..." : "Agregar"}
        </Button>
      </form>
      {state.status === "error" && (
        <p className="mt-2 text-sm text-destructive">{state.message}</p>
      )}

      {categories.length === 0 ? (
        <p className="mt-6 text-muted-foreground">Aún no hay categorías.</p>
      ) : (
        <ul className="mt-6 divide-y rounded-md border">
          {categories.map((category) => (
            <li
              key={category.id}
              className="flex items-center justify-between px-4 py-2"
            >
              <span>{category.name}</span>
              <Button
                variant="ghost"
                size="sm"
                disabled={isDeleting}
                onClick={() =>
                  startDeleteTransition(async () => {
                    const result = await deleteCategory(category.id);
                    if (!result.success) toast.error(result.message);
                  })
                }
              >
                Eliminar
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
