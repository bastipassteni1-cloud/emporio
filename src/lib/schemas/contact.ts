import { z } from "zod";

export const contactMessageSchema = z.object({
  name: z.string().trim().min(2, "Ingresa tu nombre."),
  contact_info: z
    .string()
    .trim()
    .min(3, "Ingresa un email o teléfono de contacto."),
  message: z.string().trim().min(5, "Escribe tu mensaje."),
  product_id: z.string().uuid().optional().or(z.literal("")),
});

export type ContactMessageInput = z.infer<typeof contactMessageSchema>;
