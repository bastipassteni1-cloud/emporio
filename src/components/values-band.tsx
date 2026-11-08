import { AwardIcon, LeafIcon, UsersIcon } from "lucide-react";

const values = [
  {
    icon: LeafIcon,
    title: "Hecho a mano",
    text: "Piezas únicas y auténticas",
  },
  {
    icon: UsersIcon,
    title: "Tradición familiar",
    text: "Un oficio que compartimos de generación en generación",
  },
  {
    icon: AwardIcon,
    title: "Calidad y dedicación",
    text: "Artesanías hechas con materiales nobles",
  },
];

export function ValuesBand() {
  return (
    <ul className="mx-auto grid max-w-4xl gap-3.5 px-6 pt-6 pb-4 sm:grid-cols-3 sm:gap-0 sm:px-7 sm:pt-8">
      {values.map((value) => (
        <li
          key={value.title}
          className="flex items-center gap-3.5 sm:justify-center sm:border-l sm:border-linea sm:px-4 sm:first:border-l-0"
        >
          <value.icon
            className="size-8 shrink-0 text-ocre sm:size-9"
            strokeWidth={1.25}
            aria-hidden
          />
          <div className="max-w-[13rem]">
            <p className="font-bold text-nogal">{value.title}</p>
            <p className="text-sm leading-snug text-nogal-suave">
              {value.text}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
