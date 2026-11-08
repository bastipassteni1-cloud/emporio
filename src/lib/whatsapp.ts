/**
 * Número de WhatsApp de Girasol Artesanal. Es público (se muestra en el sitio),
 * así que queda como valor por defecto para que el botón funcione aunque la
 * variable de entorno no esté configurada en el hosting.
 */
const DEFAULT_WHATSAPP_NUMBER = "56995923524";

/** Devuelve el número solo con dígitos, o null si no hay uno válido. */
export function getWhatsAppNumber(
  configured: string | undefined = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
): string | null {
  const fromEnv = (configured ?? "").replace(/\D/g, "");
  const digits = fromEnv.length >= 8 ? fromEnv : DEFAULT_WHATSAPP_NUMBER;
  return digits.length >= 8 ? digits : null;
}

/** "56995923524" → "+56 9 9592 3524". Otros formatos se muestran tal cual. */
export function formatPhoneForDisplay(digits: string): string {
  const chileanMobile = digits.match(/^56(9)(\d{4})(\d{4})$/);
  if (chileanMobile) {
    return `+56 ${chileanMobile[1]} ${chileanMobile[2]} ${chileanMobile[3]}`;
  }
  return `+${digits}`;
}

export function buildWhatsAppLink(phoneNumber: string, message: string): string {
  const digitsOnly = phoneNumber.replace(/\D/g, "");
  return `https://wa.me/${digitsOnly}?text=${encodeURIComponent(message)}`;
}

export function buildProductWhatsAppMessage(productName: string): string {
  return `Hola, me interesa el producto "${productName}" que vi en el catálogo.`;
}

export function buildGeneralWhatsAppMessage(): string {
  return "Hola, vi el catálogo de Girasol Artesanal y quiero hacer una consulta.";
}
