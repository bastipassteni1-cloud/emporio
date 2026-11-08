import { z } from "zod";

export const contactMessageSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Ingresa tu nombre.")
    .max(100, "El nombre es demasiado largo."),
  contact_info: z
    .string()
    .trim()
    .min(3, "Ingresa un email o teléfono de contacto.")
    .max(150, "El contacto es demasiado largo."),
  message: z
    .string()
    .trim()
    .min(5, "Escribe tu mensaje.")
    .max(2000, "El mensaje no puede superar los 2.000 caracteres."),
  product_id: z.string().uuid().optional().or(z.literal("")),
});

export type ContactMessageInput = z.infer<typeof contactMessageSchema>;
