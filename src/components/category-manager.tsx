"use client";

import { useActionState, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  createCategory,
  deleteCategory,
  updateCategory,
  type CategoryFormState,
} from "@/app/actions/categories";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { CategoryWithCount } from "@/lib/queries/admin";

const initialState: CategoryFormState = { status: "idle" };

function RenameForm({
  category,
  onDone,
}: {
  category: CategoryWithCount;
  onDone: () => void;
}) {
  const [state, formAction, pending] = useActionState(
    async (prev: CategoryFormState, formData: FormData) => {
      const result = await updateCategory(category.id, prev, formData);
      if (result.status === "idle") onDone();
      return result;
    },
    initialState,
  );

  return (
    <form action={formAction} className="flex-1">
      <div className="flex flex-wrap items-center gap-2">
        <Input
          name="name"
          aria-label={`Nuevo nombre para ${category.name}`}
          defaultValue={category.name}
          required
          autoFocus
          className="max-w-xs"
        />
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? "Guardando..." : "Guardar"}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onDone}>
          Cancelar
        </Button>
      </div>
      {state.status === "error" && (
        <p className="mt-1 text-sm text-destructive">{state.message}</p>
      )}
    </form>
  );
}

function DeleteCategoryButton({ category }: { category: CategoryWithCount }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const hasProducts = category.productCount > 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="sm">
            Eliminar
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {hasProducts ? "No se puede eliminar" : "Eliminar categoría"}
          </DialogTitle>
          <DialogDescription>
            {hasProducts
              ? `“${category.name}” tiene ${category.productCount} producto(s). Muévelos a otra categoría antes de eliminarla.`
              : `¿Seguro que quieres eliminar “${category.name}”? Esta acción no se puede deshacer.`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {hasProducts ? "Entendido" : "Cancelar"}
          </Button>
          {!hasProducts && (
            <Button
              variant="destructive"
              disabled={isPending}
              onClick={() =>
                startTransition(async () => {
                  const result = await deleteCategory(category.id);
                  if (!result.success) toast.error(result.message);
                  setOpen(false);
                })
              }
            >
              {isPending ? "Eliminando..." : "Eliminar"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function CategoryManager({
  categories,
}: {
  categories: CategoryWithCount[];
}) {
  const [state, formAction, pending] = useActionState(
    createCategory,
    initialState,
  );
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div>
      <form action={formAction} className="flex max-w-sm gap-2">
        <Input
          name="name"
          aria-label="Nombre de la nueva categoría"
          placeholder="Nombre de la categoría"
          required
        />
        <Button type="submit" disabled={pending}>
          {pending ? "Agregando..." : "Agregar"}
        </Button>
      </form>
      {state.status === "error" && (
        <p className="mt-2 text-sm text-destructive">{state.message}</p>
      )}

      {categories.length === 0 ? (
        <p className="mt-6 text-nogal-suave">Aún no hay categorías.</p>
      ) : (
        <ul className="mt-6 divide-y rounded-lg border border-linea bg-white/60">
          {categories.map((category) => (
            <li
              key={category.id}
              className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5"
            >
              {editingId === category.id ? (
                <RenameForm
                  category={category}
                  onDone={() => setEditingId(null)}
                />
              ) : (
                <>
                  <div>
                    <p className="font-medium text-nogal">{category.name}</p>
                    <p className="text-sm text-nogal-suave">
                      {category.productCount === 1
                        ? "1 producto"
                        : `${category.productCount} productos`}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingId(category.id)}
                    >
                      Editar
                    </Button>
                    <DeleteCategoryButton category={category} />
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
