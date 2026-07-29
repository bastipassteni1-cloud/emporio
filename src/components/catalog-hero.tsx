export function CatalogHero() {
  return (
    <section className="mx-auto max-w-5xl px-5 pt-6 pb-1 text-center sm:px-7 sm:pt-8">
      <h1 className="mx-auto max-w-[22ch] font-heading text-xl font-medium italic leading-tight text-nogal sm:max-w-[24ch] sm:text-3xl">
        Artesanía de verdad.
      </h1>
      <p className="mx-auto mt-2 max-w-[42ch] text-sm leading-relaxed text-nogal-suave sm:mt-2.5 sm:max-w-[46ch] sm:text-base">
        Madera, tejidos y bordados que llevan tiempo, cariño y oficio en
        cada detalle.
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
