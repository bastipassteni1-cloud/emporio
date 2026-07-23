import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/logout-button";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
        <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium">
          <Link href="/admin" className="hover:underline">
            Dashboard
          </Link>
          <Link href="/admin/productos" className="hover:underline">
            Productos
          </Link>
          <Link href="/admin/categorias" className="hover:underline">
            Categorías
          </Link>
          <Link href="/admin/mensajes" className="hover:underline">
            Mensajes
          </Link>
        </nav>
        <LogoutButton />
      </div>
      <div className="mt-6">{children}</div>
    </div>
  );
}
