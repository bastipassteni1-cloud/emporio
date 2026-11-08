import { describe, expect, it } from "vitest";
import {
  buildGeneralWhatsAppMessage,
  buildProductWhatsAppMessage,
  buildWhatsAppLink,
  formatPhoneForDisplay,
  getWhatsAppNumber,
} from "./whatsapp";

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

describe("getWhatsAppNumber", () => {
  it("usa el número configurado, solo con dígitos", () => {
    expect(getWhatsAppNumber("+56 9 1111 2222")).toBe("56911112222");
  });

  it("usa el número de la tienda si la variable falta o dice TODO", () => {
    expect(getWhatsAppNumber(undefined)).toBe("56995923524");
    expect(getWhatsAppNumber("")).toBe("56995923524");
    expect(getWhatsAppNumber("TODO")).toBe("56995923524");
  });
});

describe("formatPhoneForDisplay", () => {
  it("formatea un celular chileno", () => {
    expect(formatPhoneForDisplay("56995923524")).toBe("+56 9 9592 3524");
  });

  it("deja otros números con el prefijo +", () => {
    expect(formatPhoneForDisplay("5491122334455")).toBe("+5491122334455");
  });
});

describe("buildGeneralWhatsAppMessage", () => {
  it("menciona la tienda", () => {
    expect(buildGeneralWhatsAppMessage()).toContain("Girasol Artesanal");
  });
});
