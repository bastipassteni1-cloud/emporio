import Image from "next/image";
import Link from "next/link";
import { ExternalLinkIcon } from "lucide-react";
import { AdminNav } from "@/components/admin-nav";
import { LogoutButton } from "@/components/logout-button";
import { requireAdmin } from "@/lib/auth";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "Girasol Artesanal";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-crudo md:flex-row">
      <aside className="shrink-0 bg-nogal p-3 text-crudo md:sticky md:top-0 md:flex md:h-screen md:w-56 md:flex-col md:p-4">
        <div className="flex items-center justify-between gap-3 md:block">
          <div className="flex items-center gap-2.5">
            <Image
              src="/branding/logo-256.png"
              alt=""
              width={36}
              height={36}
              quality={95}
            />
            <div className="leading-tight">
              <p className="font-heading text-sm font-semibold">{siteName}</p>
              <p className="text-xs text-crudo/70">Administración</p>
            </div>
          </div>
          <div className="md:hidden">
            <LogoutButton />
          </div>
        </div>

        <div className="mt-3 md:mt-7 md:flex-1">
          <AdminNav />
        </div>

        <div className="hidden space-y-2 md:block">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-crudo/80 hover:bg-crudo/10 hover:text-crudo"
          >
            <ExternalLinkIcon className="size-4" aria-hidden />
            Ver sitio
          </Link>
          <LogoutButton />
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-4 sm:p-7">{children}</main>
    </div>
  );
}
