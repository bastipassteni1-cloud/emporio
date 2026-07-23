import { describe, expect, it } from "vitest";
import { formatPrice, formatProductStatus } from "./format";

describe("formatPrice", () => {
  it("formatea precios en CLP sin decimales", () => {
    expect(formatPrice(15000)).toBe("$15.000");
    expect(formatPrice(0)).toBe("$0");
    expect(formatPrice(1000000)).toBe("$1.000.000");
  });
});

describe("formatProductStatus", () => {
  it("traduce los estados conocidos", () => {
    expect(formatProductStatus("available")).toBe("Disponible");
    expect(formatProductStatus("sold")).toBe("Vendido");
    expect(formatProductStatus("made_to_order")).toBe("Hecho a pedido");
  });

  it("devuelve el valor original si el estado es desconocido", () => {
    expect(formatProductStatus("otro")).toBe("otro");
  });
});
