import { describe, expect, it } from "vitest";
import { buildProductWhatsAppMessage, buildWhatsAppLink } from "./whatsapp";

describe("buildWhatsAppLink", () => {
  it("limpia caracteres no numéricos del número de teléfono", () => {
    const link = buildWhatsAppLink("+56 9 1234 5678", "hola");
    expect(link).toBe("https://wa.me/56912345678?text=hola");
  });

  it("codifica el mensaje para uso en URL", () => {
    const link = buildWhatsAppLink("56912345678", 'Hola, ¿está disponible?');
    expect(link).toContain("https://wa.me/56912345678?text=");
    expect(link).toContain(encodeURIComponent('Hola, ¿está disponible?'));
  });
});

describe("buildProductWhatsAppMessage", () => {
  it("incluye el nombre del producto en el mensaje", () => {
    const message = buildProductWhatsAppMessage("Silla de madera");
    expect(message).toContain("Silla de madera");
  });
});
