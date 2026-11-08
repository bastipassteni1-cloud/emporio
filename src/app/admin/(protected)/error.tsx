"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function AdminError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="py-10">
      <h1 className="font-heading text-2xl font-medium text-nogal">
        No se pudo cargar esta sección
      </h1>
      <p className="mt-2 text-nogal-suave">
        Revisa tu conexión e inténtalo otra vez. Tus datos no se modificaron.
      </p>
      <Button className="mt-5" onClick={() => unstable_retry()}>
        Reintentar
      </Button>
    </div>
  );
}
