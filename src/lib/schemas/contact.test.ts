import { describe, expect, it } from "vitest";
import { contactMessageSchema } from "./contact";

describe("contactMessageSchema", () => {
  it("acepta un mensaje válido sin producto asociado", () => {
    const result = contactMessageSchema.safeParse({
      name: "Ana",
      contact_info: "ana@test.com",
      message: "Hola, me interesa un producto",
    });
    expect(result.success).toBe(true);
  });

  it("acepta un mensaje válido con product_id", () => {
    const result = contactMessageSchema.safeParse({
      name: "Ana",
      contact_info: "ana@test.com",
      message: "Hola, me interesa este producto",
      product_id: "123e4567-e89b-12d3-a456-426614174000",
    });
    expect(result.success).toBe(true);
  });

  it("rechaza nombre vacío", () => {
    const result = contactMessageSchema.safeParse({
      name: "",
      contact_info: "ana@test.com",
      message: "Hola",
    });
    expect(result.success).toBe(false);
  });

  it("rechaza mensaje muy corto", () => {
    const result = contactMessageSchema.safeParse({
      name: "Ana",
      contact_info: "ana@test.com",
      message: "Hi",
    });
    expect(result.success).toBe(false);
  });
});
