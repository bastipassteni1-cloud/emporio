import { describe, expect, it } from "vitest";
import { categorySchema } from "./category";

describe("categorySchema", () => {
  it("acepta un nombre válido", () => {
    expect(categorySchema.safeParse({ name: "Madera" }).success).toBe(true);
  });

  it("rechaza un nombre muy corto", () => {
    expect(categorySchema.safeParse({ name: "M" }).success).toBe(false);
  });
});
