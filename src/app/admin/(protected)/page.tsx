import Link from "next/link";
import {
  MailIcon,
  PackageIcon,
  PlusIcon,
  TagsIcon,
  type LucideIcon,
} from "lucide-react";
import { getAdminCounts } from "@/lib/queries/admin";

function Metric({
  href,
  icon: Icon,
  value,
  label,
}: {
  href: string;
  icon: LucideIcon;
  value: number;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-lg border border-linea bg-white/60 p-4 transition-colors hover:border-ocre focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocre-texto"
    >
      <Icon className="size-5 text-ocre-texto" aria-hidden />
      <p className="mt-2 text-2xl font-bold text-nogal">{value}</p>
      <p className="text-sm text-nogal-suave">{label}</p>
    </Link>
  );
}

export default async function AdminDashboardPage() {
  const counts = await getAdminCounts();

  return (
    <div>
      <h1 className="font-heading text-2xl font-medium text-nogal">Resumen</h1>
      <p className="mt-1 text-nogal-suave">
        Gestiona los productos, categorías y mensajes del catálogo.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Metric
          href="/admin/productos"
          icon={PackageIcon}
          value={counts.products}
          label="Productos"
        />
        <Metric
          href="/admin/categorias"
          icon={TagsIcon}
          value={counts.categories}
          label="Categorías"
        />
        <Metric
          href="/admin/mensajes"
          icon={MailIcon}
          value={counts.messages}
          label="Mensajes recibidos"
        />
      </div>

      <h2 className="mt-8 font-heading text-lg font-medium text-nogal">
        Accesos rápidos
      </h2>
      <Link
        href="/admin/productos/nuevo"
        className="mt-3 inline-flex items-center gap-2 rounded-lg border border-linea bg-white/60 px-4 py-3 text-sm font-semibold text-nogal transition-colors hover:border-ocre focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocre-texto"
      >
        <PlusIcon className="size-4 text-ocre-texto" aria-hidden />
        Agregar un producto nuevo
      </Link>
    </div>
  );
}
