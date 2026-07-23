import { describe, expect, it } from "vitest";
import { parseInitialValue } from "./measurement-field";

describe("parseInitialValue", () => {
  it("reconoce dimensiones LxAxAlto con unidad", () => {
    expect(parseInitialValue("20x30x12 cm")).toEqual({
      mode: "dimensiones",
      largo: "20",
      ancho: "30",
      alto: "12",
      talla: "",
    });
  });

  it("reconoce dimensiones sin espacios ni unidad", () => {
    const result = parseInitialValue("40x40x90");
    expect(result.mode).toBe("dimensiones");
    expect(result.largo).toBe("40");
    expect(result.ancho).toBe("40");
    expect(result.alto).toBe("90");
  });

  it("trata texto libre como talla", () => {
    expect(parseInitialValue("M")).toEqual({
      mode: "talla",
      largo: "",
      ancho: "",
      alto: "",
      talla: "M",
    });
  });

  it("por defecto usa modo dimensiones cuando está vacío", () => {
    expect(parseInitialValue("").mode).toBe("dimensiones");
  });
});
