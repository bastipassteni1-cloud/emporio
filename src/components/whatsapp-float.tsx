import { WhatsAppIcon } from "@/components/whatsapp-icon";
import {
  buildGeneralWhatsAppMessage,
  buildWhatsAppLink,
  getWhatsAppNumber,
} from "@/lib/whatsapp";

/** Botón flotante de WhatsApp, visible en todas las páginas públicas. */
export function WhatsAppFloat() {
  const number = getWhatsAppNumber();
  if (!number) return null;

  return (
    <a
      href={buildWhatsAppLink(number, buildGeneralWhatsAppMessage())}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      title="Escríbenos por WhatsApp"
      className="fixed right-4 bottom-4 z-40 flex size-13 items-center justify-center rounded-full bg-[#0f7a40] text-white shadow-lg shadow-nogal/25 transition-transform hover:scale-105 hover:bg-[#0c6635] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f7a40] motion-reduce:transition-none motion-reduce:hover:scale-100 sm:right-6 sm:bottom-6 sm:size-14"
    >
      <WhatsAppIcon className="size-7" />
    </a>
  );
}
