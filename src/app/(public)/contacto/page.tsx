import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { formatPhoneForDisplay, getWhatsAppNumber } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Escríbenos una consulta sobre nuestros productos artesanales.",
};

export default function ContactoPage() {
  const whatsapp = getWhatsAppNumber();

  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:px-7 sm:py-14 md:grid-cols-2 md:gap-14">
      <div>
        <p className="text-xs font-bold tracking-[0.18em] text-ocre-texto uppercase">
          Estamos para ayudarte
        </p>
        <h1 className="mt-2 font-heading text-3xl font-medium text-nogal sm:text-4xl">
          Conversemos
        </h1>
        <p className="mt-3 leading-relaxed text-nogal-suave">
          ¿Te gustó alguna pieza o tienes una consulta? Escríbenos y te
          responderemos a la brevedad.
        </p>

        {whatsapp && (
          <div className="mt-6 rounded-lg border border-linea bg-crudo p-5">
            <h2 className="font-heading text-lg font-medium text-nogal">
              Escríbenos por WhatsApp
            </h2>
            <p className="mt-1 text-sm text-nogal-suave">
              Es la forma más rápida de consultar por una pieza.
            </p>
            <p className="mt-3 text-lg font-semibold text-nogal">
              <a
                href={`tel:+${whatsapp}`}
                className="rounded-sm hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocre-texto"
              >
                {formatPhoneForDisplay(whatsapp)}
              </a>
            </p>
            <WhatsAppButton label="Abrir WhatsApp" className="mt-4" />
          </div>
        )}
      </div>
      <div className="rounded-lg border border-linea bg-crudo p-5 sm:p-6">
        <ContactForm />
      </div>
    </div>
  );
}
