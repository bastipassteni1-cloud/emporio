export function CatalogHero() {
  return (
    <section className="mx-auto max-w-5xl px-7 pt-8 pb-1 text-center">
      <p className="font-caveat text-xl font-bold text-ciruela">
        hecho con cariño
      </p>
      <h1 className="mx-auto mt-1 max-w-[24ch] font-heading text-2xl font-medium italic leading-tight text-nogal sm:text-3xl">
        Piezas artesanales hechas a mano, una por una.
      </h1>
      <p className="mx-auto mt-2.5 max-w-[46ch] text-sm leading-relaxed text-nogal-suave sm:text-base">
        Madera, tejidos y bordados creados con tiempo y paciencia — cada
        pieza es única, igual que quien la hace.
      </p>
      <svg
        viewBox="0 0 120 14"
        fill="none"
        className="mx-auto my-2.5 h-3.5 w-[120px]"
        aria-hidden
      >
        <path
          d="M2 7 Q 15 -2, 28 7 T 54 7 T 80 7 T 106 7 T 118 7"
          stroke="var(--ocre)"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeDasharray="1 9"
        />
      </svg>
    </section>
  );
}
