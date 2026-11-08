"use server";

import { contactMessageSchema } from "@/lib/schemas/contact";
import { createClient } from "@/lib/supabase/server";

type ContactField = "name" | "contact_info" | "message";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<ContactField, string>>;
  values?: Partial<Record<ContactField, string>>;
};

function text(formData: FormData, field: string): string {
  const value = formData.get(field);
  return typeof value === "string" ? value : "";
}

export async function submitContactMessage(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const values = {
    name: text(formData, "name"),
    contact_info: text(formData, "contact_info"),
    message: text(formData, "message"),
  };

  // Campo trampa: solo un bot lo completa. No se guarda ni se confirma envío.
  if (text(formData, "website")) {
    return {
      status: "error",
      message: "No pudimos enviar tu mensaje. Intenta de nuevo.",
      values,
    };
  }

  const parsed = contactMessageSchema.safeParse({
    ...values,
    product_id: formData.get("product_id") ?? "",
  });

  if (!parsed.success) {
    const fieldErrors: ContactFormState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as ContactField;
      fieldErrors[field] ??= issue.message;
    }
    return {
      status: "error",
      message: "Revisa los campos marcados.",
      fieldErrors,
      values,
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
      values,
    };
  }

  return { status: "success", message: "¡Mensaje enviado! Te contactaremos pronto." };
}
