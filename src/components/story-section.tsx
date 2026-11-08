import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function StorySection() {
  return (
    <section
      id="historia"
      aria-labelledby="historia-title"
      className="scroll-mt-20 border-t border-linea bg-crudo"
    >
      <div className="mx-auto max-w-2xl px-5 py-12 text-center sm:py-14">
        <Image
          src="/branding/logo-256.png"
          alt=""
          width={56}
          height={56}
          quality={95}
          className="mx-auto"
        />
        <p className="mt-3 text-xs font-bold tracking-[0.18em] text-ocre-texto uppercase">
          Quiénes somos
        </p>
        <h2
          id="historia-title"
          className="mt-2 font-heading text-2xl font-medium text-nogal sm:text-3xl"
        >
          Hecho con nuestras manos y mucho cariño
        </h2>
        <p className="mt-4 leading-relaxed text-nogal-suave">
          Girasol Artesanal es un emprendimiento familiar donde cada creación
          refleja dedicación, paciencia y el valor del trabajo hecho a mano.
        </p>
        <p className="mt-3 leading-relaxed text-nogal-suave">
          Trabajamos distintas técnicas artesanales, desde piezas de madera
          hasta tejidos y bordados. Queremos compartir ese trabajo contigo,
          pieza por pieza.
        </p>
        <Button
          size="lg"
          variant="outline"
          className="mt-6 rounded-full border-nogal/40 bg-transparent px-5"
          nativeButton={false}
          render={<Link href="/#catalogo">Conoce nuestras creaciones</Link>}
        />
      </div>
    </section>
  );
}
