import Image from "next/image";
import Link from "next/link";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { getCategories } from "@/lib/queries/products";
import {
  buildGeneralWhatsAppMessage,
  buildWhatsAppLink,
  formatPhoneForDisplay,
  getWhatsAppNumber,
} from "@/lib/whatsapp";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "Girasol Artesanal";

const footerLinkClass =
  "mb-2 block rounded-sm text-sm font-semibold text-crudo/90 hover:text-ocre-suave focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocre-suave";

export async function SiteFooter() {
  // El pie no debe tumbar la página si la base de datos no responde.
  const categories = await getCategories().catch(() => []);
  const whatsapp = getWhatsAppNumber();

  return (
    <footer className="bg-nogal text-crudo">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-5 pt-8 pb-6 text-center sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:gap-7 sm:px-7 sm:text-left">
        <div className="max-w-[300px]">
          <Link
            href="/"
            className="mb-2 flex items-center justify-center gap-2 font-heading text-lg font-semibold sm:justify-start"
          >
            <Image
              src="/branding/logo-256.png"
              alt=""
              width={36}
              height={36}
              quality={95}
            />
            {siteName}
          </Link>
          <p className="text-sm leading-relaxed text-crudo/75">
            Productos artesanales hechos a mano. Cada pieza pasa por manos
            que conocen el oficio.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8 sm:justify-start sm:gap-12">
          <div>
            <h2 className="mb-2.5 text-xs font-semibold tracking-wide text-crudo/70 uppercase">
              Explorar
            </h2>
            <Link href="/" className={footerLinkClass}>
              Inicio
            </Link>
            <Link href="/#catalogo" className={footerLinkClass}>
              Catálogo
            </Link>
            <Link href="/#historia" className={footerLinkClass}>
              Sobre nosotros
            </Link>
            <Link href="/contacto" className={footerLinkClass}>
              Contacto
            </Link>
          </div>

          {categories.length > 0 && (
            <div>
              <h2 className="mb-2.5 text-xs font-semibold tracking-wide text-crudo/70 uppercase">
                Categorías
              </h2>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/?categoria=${category.slug}#catalogo`}
                  className={footerLinkClass}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          )}

          {whatsapp && (
            <div>
              <h2 className="mb-2.5 text-xs font-semibold tracking-wide text-crudo/70 uppercase">
                Contacto
              </h2>
              <a
                href={buildWhatsAppLink(whatsapp, buildGeneralWhatsAppMessage())}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-2 flex items-center justify-center gap-2 rounded-sm text-sm font-semibold text-crudo/90 hover:text-ocre-suave focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocre-suave sm:justify-start"
              >
                <WhatsAppIcon className="size-4" />
                {formatPhoneForDisplay(whatsapp)}
              </a>
            </div>
          )}
        </div>
      </div>
      <div className="border-t border-crudo/15 px-5 pt-3.5 pb-6 text-center text-[0.82rem] text-crudo/70 sm:px-7">
        © {new Date().getFullYear()} {siteName}. Productos artesanales
        hechos a mano.
      </div>
    </footer>
  );
}
