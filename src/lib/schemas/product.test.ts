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
      expect(result.data.name).toBe("Silla de madera");
      expect(result.data.category_id).toBe(
        "123e4567-e89b-12d3-a456-426614174000",
      );
    }
  });

  it("no exige ningún campo: acepta un formulario completamente vacío", () => {
    const result = productSchema.safeParse({
      name: "",
      description: "",
      price: "",
      dimensions: "",
      status: "",
      category_id: "",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Producto sin nombre");
      expect(result.data.description).toBe("");
      expect(result.data.price).toBe(0);
      expect(result.data.status).toBe("available");
      expect(result.data.category_id).toBeNull();
    }
  });

  it("usa un precio 0 si el precio es negativo", () => {
    const result = productSchema.safeParse({ ...validInput, price: "-100" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.price).toBe(0);
  });

  it("usa un precio 0 si el precio no es entero", () => {
    const result = productSchema.safeParse({ ...validInput, price: "10.5" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.price).toBe(0);
  });

  it("usa 'available' si el estado es inválido", () => {
    const result = productSchema.safeParse({
      ...validInput,
      status: "en-reparacion",
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.status).toBe("available");
  });

  it("usa null si category_id no es un uuid válido", () => {
    const result = productSchema.safeParse({
      ...validInput,
      category_id: "no-es-uuid",
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.category_id).toBeNull();
  });

  it("permite dimensions vacío", () => {
    const result = productSchema.safeParse({ ...validInput, dimensions: "" });
    expect(result.success).toBe(true);
  });
});
