import { z } from "zod";

export const PRODUCT_STATUS_VALUES = [
  "available",
  "sold",
  "made_to_order",
] as const;

export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .transform((v) => (v.length > 0 ? v : "Producto sin nombre")),
  description: z.string().trim(),
  price: z.coerce
    .number({ error: "El precio debe ser un número." })
    .int("El precio debe ser un número entero.")
    .min(0, "El precio no puede ser negativo.")
    .catch(0),
  dimensions: z.string().trim().optional().or(z.literal("")),
  status: z.enum(PRODUCT_STATUS_VALUES).catch("available"),
  category_id: z
    .preprocess(
      (v) => (typeof v === "string" && v.length > 0 ? v : null),
      z.string().uuid().nullable(),
    )
    .catch(null),
});

export type ProductInput = z.infer<typeof productSchema>;
