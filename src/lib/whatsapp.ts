export function buildWhatsAppLink(phoneNumber: string, message: string): string {
  const digitsOnly = phoneNumber.replace(/\D/g, "");
  return `https://wa.me/${digitsOnly}?text=${encodeURIComponent(message)}`;
}

export function buildProductWhatsAppMessage(productName: string): string {
  return `Hola, me interesa el producto "${productName}" que vi en el catálogo.`;
}
