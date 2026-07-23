import { describe, expect, it } from "vitest";
import { productSchema } from "./product";

const validInput = {
  name: "Silla de madera",
  description: "Silla artesanal tallada a mano.",
  price: "25000",
  dimensions: "40x40x90 cm",
  status: "available",
  category_id: "123e4567-e89b-12d3-a456-426614174000",
};

describe("productSchema", () => {
  it("acepta datos válidos y coerciona el precio a número", () => {
    const result = productSchema.safeParse(validInput);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.price).toBe(25000);
    }
  });

  it("rechaza nombre muy corto", () => {
    const result = productSchema.safeParse({ ...validInput, name: "A" });
    expect(result.success).toBe(false);
  });

  it("rechaza precio negativo", () => {
    const result = productSchema.safeParse({ ...validInput, price: "-100" });
    expect(result.success).toBe(false);
  });

  it("rechaza precio no entero", () => {
    const result = productSchema.safeParse({ ...validInput, price: "10.5" });
    expect(result.success).toBe(false);
  });

  it("rechaza un estado inválido", () => {
    const result = productSchema.safeParse({ ...validInput, status: "en-reparacion" });
    expect(result.success).toBe(false);
  });

  it("rechaza category_id que no es uuid", () => {
    const result = productSchema.safeParse({ ...validInput, category_id: "no-es-uuid" });
    expect(result.success).toBe(false);
  });

  it("permite dimensions vacío", () => {
    const result = productSchema.safeParse({ ...validInput, dimensions: "" });
    expect(result.success).toBe(true);
  });
});
