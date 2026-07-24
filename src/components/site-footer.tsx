import Link from "next/link";
import { SunflowerRow } from "@/components/sunflower-row";
import { getCategories } from "@/lib/queries/products";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "Catálogo Artesanal";

export async function SiteFooter() {
  const categories = await getCategories();

  return (
    <footer className="mt-10 border-t border-linea bg-crudo">
      <SunflowerRow />
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-5 py-6 text-center sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:gap-7 sm:px-7 sm:text-left">
        <div className="max-w-[280px]">
          <Link
            href="/"
            className="mb-2 flex items-center justify-center gap-2 font-heading text-lg font-semibold text-nogal sm:justify-start"
          >
            <svg width="22" height="22" viewBox="0 0 26 26" fill="none">
              <circle cx="13" cy="13" r="11.5" stroke="var(--nogal)" strokeWidth="1.4" />
              <circle cx="13" cy="13" r="1.6" fill="var(--ocre)" />
            </svg>
            {siteName}
          </Link>
          <p className="text-sm leading-relaxed text-nogal-suave">
            Productos artesanales hechos a mano. Cada pieza pasa por manos
            que conocen el oficio.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8 sm:justify-start sm:gap-12">
          <div>
            <h4 className="mb-2.5 text-xs font-semibold tracking-wide text-nogal-suave uppercase">
              Explorar
            </h4>
            <Link href="/" className="mb-2 block text-sm font-semibold text-nogal hover:text-ocre">
              Catálogo
            </Link>
            <Link
              href="/contacto"
              className="mb-2 block text-sm font-semibold text-nogal hover:text-ocre"
            >
              Contacto
            </Link>
          </div>

          {categories.length > 0 && (
            <div>
              <h4 className="mb-2.5 text-xs font-semibold tracking-wide text-nogal-suave uppercase">
                Categorías
              </h4>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/?categoria=${category.slug}`}
                  className="mb-2 block text-sm font-semibold text-nogal hover:text-ocre"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="px-5 pt-3.5 pb-[26px] text-center text-[0.82rem] text-nogal-suave sm:px-7">
        © {new Date().getFullYear()} {siteName}. Productos artesanales
        hechos a mano.
      </div>
    </footer>
  );
}
