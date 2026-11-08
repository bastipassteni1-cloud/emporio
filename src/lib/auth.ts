import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Exige una sesión válida en el servidor. Toda acción de administración debe
 * pasar por aquí, además de las políticas RLS de la base de datos.
 */
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  return supabase;
}
