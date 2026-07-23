"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DIMENSIONS_PATTERN = /^(\d+(?:[.,]\d+)?)\s*x\s*(\d+(?:[.,]\d+)?)\s*x\s*(\d+(?:[.,]\d+)?)/i;

export function parseInitialValue(value: string) {
  const match = value.match(DIMENSIONS_PATTERN);
  if (match) {
    return {
      mode: "dimensiones" as const,
      largo: match[1],
      ancho: match[2],
      alto: match[3],
      talla: "",
    };
  }
  return { mode: value ? ("talla" as const) : ("dimensiones" as const), largo: "", ancho: "", alto: "", talla: value };
}

export function MeasurementField({ defaultValue = "" }: { defaultValue?: string }) {
  const initial = parseInitialValue(defaultValue);
  const [mode, setMode] = useState<"dimensiones" | "talla">(initial.mode);
  const [largo, setLargo] = useState(initial.largo);
  const [ancho, setAncho] = useState(initial.ancho);
  const [alto, setAlto] = useState(initial.alto);
  const [talla, setTalla] = useState(initial.talla);

  const combined = useMemo(() => {
    if (mode === "talla") return talla.trim();
    const parts = [largo, ancho, alto].map((p) => p.trim()).filter(Boolean);
    return parts.length ? `${parts.join("x")} cm` : "";
  }, [mode, largo, ancho, alto, talla]);

  return (
    <div className="space-y-2">
      <Label>Medidas o talla</Label>
      <div className="flex gap-2">
        <Button
          type="button"
          size="sm"
          variant={mode === "dimensiones" ? "default" : "outline"}
          onClick={() => setMode("dimensiones")}
        >
          Dimensiones (cm)
        </Button>
        <Button
          type="button"
          size="sm"
          variant={mode === "talla" ? "default" : "outline"}
          onClick={() => setMode("talla")}
        >
          Talla
        </Button>
      </div>

      {mode === "dimensiones" ? (
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min={0}
            placeholder="Largo"
            value={largo}
            onChange={(e) => setLargo(e.target.value)}
            aria-label="Largo en centímetros"
          />
          <span className="text-muted-foreground">x</span>
          <Input
            type="number"
            min={0}
            placeholder="Ancho"
            value={ancho}
            onChange={(e) => setAncho(e.target.value)}
            aria-label="Ancho en centímetros"
          />
          <span className="text-muted-foreground">x</span>
          <Input
            type="number"
            min={0}
            placeholder="Alto"
            value={alto}
            onChange={(e) => setAlto(e.target.value)}
            aria-label="Alto en centímetros"
          />
        </div>
      ) : (
        <Input
          placeholder="Ej: M, 42, Única"
          value={talla}
          onChange={(e) => setTalla(e.target.value)}
          aria-label="Talla"
        />
      )}

      <input type="hidden" name="dimensions" value={combined} />
    </div>
  );
}
