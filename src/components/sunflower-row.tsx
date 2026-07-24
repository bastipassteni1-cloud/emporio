function Sunflower({ variant }: { variant: "a" | "b" }) {
  if (variant === "b") {
    return (
      <svg viewBox="0 0 48 48" fill="none">
        <g fill="#F4B942">
          <ellipse cx="24" cy="7" rx="4.5" ry="8" />
          <ellipse cx="24" cy="41" rx="4.5" ry="8" />
          <ellipse cx="7" cy="24" rx="8" ry="4.5" />
          <ellipse cx="41" cy="24" rx="8" ry="4.5" />
          <ellipse cx="12" cy="12" rx="4.5" ry="8" transform="rotate(-45 12 12)" />
          <ellipse cx="36" cy="36" rx="4.5" ry="8" transform="rotate(-45 36 36)" />
          <ellipse cx="12" cy="36" rx="4.5" ry="8" transform="rotate(45 12 36)" />
          <ellipse cx="36" cy="12" rx="4.5" ry="8" transform="rotate(45 36 12)" />
        </g>
        <circle cx="24" cy="24" r="10.5" fill="#6B4423" />
        <circle cx="21" cy="21" r="1.1" fill="#8B5A2B" />
        <circle cx="26" cy="20" r="1.1" fill="#8B5A2B" />
        <circle cx="24" cy="26" r="1.1" fill="#8B5A2B" />
        <circle cx="19" cy="26" r="1.1" fill="#8B5A2B" />
        <circle cx="28" cy="25" r="1.1" fill="#8B5A2B" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 48 48" fill="none">
      <g fill="#F0B429">
        <ellipse cx="24" cy="8" rx="4" ry="7" />
        <ellipse cx="24" cy="40" rx="4" ry="7" />
        <ellipse cx="8" cy="24" rx="7" ry="4" />
        <ellipse cx="40" cy="24" rx="7" ry="4" />
        <ellipse cx="13" cy="13" rx="4" ry="7" transform="rotate(-45 13 13)" />
        <ellipse cx="35" cy="35" rx="4" ry="7" transform="rotate(-45 35 35)" />
        <ellipse cx="13" cy="35" rx="4" ry="7" transform="rotate(45 13 35)" />
        <ellipse cx="35" cy="13" rx="4" ry="7" transform="rotate(45 35 13)" />
      </g>
      <circle cx="24" cy="24" r="9" fill="#7A4B22" />
    </svg>
  );
}

const SIZES = [26, 36, 26, 22, 34, 22, 36, 26];
const OPACITIES = [0.6, 0.8, 0.6, 0.45, 0.75, 0.4, 0.8, 0.6];
const VARIANTS: Array<"a" | "b"> = ["a", "b", "a", "a", "b", "a", "b", "a"];

export function SunflowerRow() {
  return (
    <div
      aria-hidden
      className="flex flex-wrap items-end justify-center gap-5 pt-5"
    >
      {SIZES.map((size, i) => (
        <div key={i} style={{ width: size, height: size, opacity: OPACITIES[i] }}>
          <Sunflower variant={VARIANTS[i]} />
        </div>
      ))}
    </div>
  );
}
