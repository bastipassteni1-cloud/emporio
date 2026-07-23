import { z } from "zod";

export const PRODUCT_STATUS_VALUES = [
  "available",
  "sold",
  "made_to_order",
] as const;

export const productSchema = z.object({
  name: z.string().trim().min(2, "El nombre es muy corto."),
  description: z.string().trim().min(5, "Agrega una descripción."),
  price: z.coerce
    .number({ error: "El precio debe ser un número." })
    .int("El precio debe ser un número entero.")
    .min(0, "El precio no puede ser negativo."),
  dimensions: z.string().trim().optional().or(z.literal("")),
  status: z.enum(PRODUCT_STATUS_VALUES, { error: "Selecciona un estado." }),
  category_id: z.string().uuid("Selecciona una categoría."),
});

export type ProductInput = z.infer<typeof productSchema>;
