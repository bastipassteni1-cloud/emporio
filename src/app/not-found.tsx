import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-md flex-1 flex-col items-center justify-center px-4 py-20 text-center">
      <h1 className="font-heading text-2xl font-medium text-nogal">
        No encontramos esta página
      </h1>
      <p className="mt-2 text-nogal-suave">
        Puede que la pieza ya no esté publicada o que el enlace haya cambiado.
      </p>
      <Button
        size="lg"
        className="mt-6 rounded-full px-5"
        nativeButton={false}
        render={<Link href="/#catalogo">Ver catálogo</Link>}
      />
    </main>
  );
}
