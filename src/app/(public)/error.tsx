"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function PublicError({
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
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <h1 className="font-heading text-2xl font-medium text-nogal">
        No pudimos cargar esta página
      </h1>
      <p className="mt-2 text-nogal-suave">
        Hubo un problema temporal. Intenta de nuevo en unos minutos.
      </p>
      <Button
        size="lg"
        className="mt-6 rounded-full px-5"
        onClick={() => unstable_retry()}
      >
        Reintentar
      </Button>
    </div>
  );
}
