import { Button } from "@/components/ui/button";
import { buildProductWhatsAppMessage, buildWhatsAppLink } from "@/lib/whatsapp";

export function WhatsAppButton({ productName }: { productName: string }) {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  if (!number || number === "TODO") return null;

  const link = buildWhatsAppLink(number, buildProductWhatsAppMessage(productName));

  return (
    <Button
      size="lg"
      className="w-full sm:w-auto"
      nativeButton={false}
      render={
        <a href={link} target="_blank" rel="noopener noreferrer">
          Consultar por WhatsApp
        </a>
      }
    />
  );
}
