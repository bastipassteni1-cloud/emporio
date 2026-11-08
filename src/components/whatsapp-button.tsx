import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { cn } from "@/lib/utils";
import {
  buildGeneralWhatsAppMessage,
  buildProductWhatsAppMessage,
  buildWhatsAppLink,
  getWhatsAppNumber,
} from "@/lib/whatsapp";

/** Verde WhatsApp oscurecido para que el texto blanco tenga buen contraste. */
export const whatsappButtonClass =
  "bg-[#0f7a40] text-white hover:bg-[#0c6635] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f7a40]";

export function WhatsAppButton({
  productName,
  label = "Consultar por WhatsApp",
  className,
}: {
  /** Si se indica, el mensaje menciona el producto. */
  productName?: string;
  label?: string;
  className?: string;
}) {
  const number = getWhatsAppNumber();
  if (!number) return null;

  const message = productName
    ? buildProductWhatsAppMessage(productName)
    : buildGeneralWhatsAppMessage();

  return (
    <Button
      size="lg"
      className={cn(
        "w-full rounded-full px-5 sm:w-auto",
        whatsappButtonClass,
        className,
      )}
      nativeButton={false}
      render={
        <a
          href={buildWhatsAppLink(number, message)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <WhatsAppIcon className="size-[1.1rem]" />
          {label}
        </a>
      }
    />
  );
}
