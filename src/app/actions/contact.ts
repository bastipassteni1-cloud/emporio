"use server";

import { contactMessageSchema } from "@/lib/schemas/contact";
import { createClient } from "@/lib/supabase/server";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function submitContactMessage(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const parsed = contactMessageSchema.safeParse({
    name: formData.get("name"),
    contact_info: formData.get("contact_info"),
    message: formData.get("message"),
    product_id: formData.get("product_id") ?? "",
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Datos inválidos.",
    };
  }

  const { name, contact_info, message, product_id } = parsed.data;

  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert({
    name,
    contact_info,
    message,
    product_id: product_id || null,
  });

  if (error) {
    return {
      status: "error",
      message: "No pudimos enviar tu mensaje. Intenta de nuevo.",
    };
  }

  return { status: "success", message: "¡Mensaje enviado! Te contactaremos pronto." };
}
