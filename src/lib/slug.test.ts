import { describe, expect, it } from "vitest";
import { generateSlug } from "./slug";

describe("generateSlug", () => {
  it("convierte a minúsculas y reemplaza espacios por guiones", () => {
    expect(generateSlug("Silla de Madera")).toBe("silla-de-madera");
  });

  it("elimina tildes y caracteres especiales", () => {
    expect(generateSlug("Canastó de Mimbre Único")).toBe(
      "canasto-de-mimbre-unico",
    );
  });

  it("colapsa guiones múltiples y recorta los de los extremos", () => {
    expect(generateSlug("  ¡Poncho!! de Lana  ")).toBe("poncho-de-lana");
  });
});
