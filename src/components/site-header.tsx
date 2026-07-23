import Link from "next/link";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "Catálogo Artesanal";

export function SiteHeader() {
  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          {siteName}
        </Link>
        <nav className="flex gap-6 text-sm">
          <Link href="/" className="hover:underline">
            Catálogo
          </Link>
          <Link href="/contacto" className="hover:underline">
            Contacto
          </Link>
        </nav>
      </div>
    </header>
  );
}
