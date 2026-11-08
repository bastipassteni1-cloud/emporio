import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Portada de la página principal: el texto a la izquierda y una sola composición
 * fotográfica (public/hero/portada.jpg) a la derecha, fundida con el fondo.
 *
 * Desde 1024 px la foto va a la derecha, hasta el borde de la pantalla, con el
 * borde inferior curvo. En pantallas más chicas queda debajo del texto.
 */
export function CatalogHero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-hidden lg:flex lg:h-[19.5rem] lg:items-center xl:h-[22.5rem]"
    >
      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 pt-7 text-center sm:px-7 sm:pt-9 lg:pt-0 lg:text-left">
        <div className="lg:max-w-[17rem] xl:max-w-[21rem]">
          <p className="flex items-center justify-center gap-3 text-xs font-semibold tracking-[0.2em] text-ocre-texto uppercase sm:text-[0.8rem] lg:justify-start">
            Artesanía chilena
            <span aria-hidden className="h-px w-10 bg-ocre" />
          </p>
          <h1
            id="hero-title"
            className="mt-3 font-heading text-4xl leading-[1.02] font-medium text-nogal italic sm:text-5xl lg:text-[2.75rem] xl:text-[3.5rem]"
          >
            <span className="lg:block">Artesanía de</span> verdad
          </h1>
          <p className="mx-auto mt-3.5 max-w-[34ch] leading-relaxed text-nogal sm:text-lg lg:mx-0 lg:text-base xl:text-lg">
            Madera, tejidos y bordados que llevan tiempo, cariño y oficio en
            cada detalle.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3 lg:mt-5 lg:flex-nowrap lg:justify-start xl:mt-6">
            <Button
              size="lg"
              className="h-11 rounded-full px-6 text-[0.95rem] lg:h-10 lg:px-5 lg:text-sm xl:h-11 xl:px-6 xl:text-[0.95rem]"
              nativeButton={false}
              render={
                <Link href="/#catalogo">
                  Ver catálogo
                  <ArrowRightIcon aria-hidden />
                </Link>
              }
            />
            <Button
              size="lg"
              variant="outline"
              className="h-11 rounded-full border-nogal bg-transparent px-6 text-[0.95rem] lg:h-10 lg:px-5 lg:text-sm xl:h-11 xl:px-6 xl:text-[0.95rem]"
              nativeButton={false}
              render={<Link href="/#historia">Sobre nosotros</Link>}
            />
          </div>
        </div>
      </div>

      {/*
        Celular: debajo del texto, a todo el ancho, con el borde superior difuminado.
        Tablet: centrada y con los bordes difuminados, para no alargar la portada.
        Escritorio (1024 px o más): a la derecha, hasta el borde de la pantalla.
        Entre 1024 y 1279 px empieza donde termina el texto y se recorta solo la
        tela de la izquierda. Desde 1280 px tiene el ancho justo para su
        proporción (unas 3 veces la altura de la portada). La esquina inferior
        derecha es curva y lleva una línea dorada fina.
      */}
      <div className="relative mx-auto mt-6 aspect-[12/5] [mask-image:linear-gradient(to_bottom,transparent,#000_28%)] sm:aspect-[3/1] md:max-w-3xl md:[mask-composite:intersect] md:[mask-image:linear-gradient(to_bottom,transparent,#000_28%),linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent)] lg:absolute lg:inset-y-0 lg:right-0 lg:left-[calc(max(1.75rem,50%-30.25rem)+16.5rem)] lg:mx-0 lg:mt-0 lg:aspect-auto lg:max-w-none lg:overflow-hidden lg:rounded-br-[72%_40%] lg:border-b-2 lg:border-ocre-suave lg:[mask-composite:add] lg:[mask-image:linear-gradient(to_right,transparent,#000_10%)] xl:left-auto xl:w-[63rem] xl:[mask-image:linear-gradient(to_right,transparent,transparent_12%,#000_27%)]">
        <Image
          src="/hero/portada.jpg"
          alt="Flor bordada sobre un paño, caballo de madera y chaleco tejido a mano"
          fill
          preload
          sizes="(min-width: 1280px) 1008px, (min-width: 1024px) 840px, (min-width: 768px) 768px, 100vw"
          className="object-cover object-[84%_50%] sm:object-center lg:object-right xl:object-[75%_50%]"
        />
      </div>
    </section>
  );
}
