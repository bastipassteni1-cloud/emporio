export type CategoryTheme = {
  gradient: string;
  labelClassName: string;
  icon: React.ReactNode;
};

const woodIcon = (
  <svg viewBox="0 0 48 48" fill="none" stroke="var(--nogal)" strokeWidth="1.6">
    <path d="M6 34 Q24 40 42 34 L42 30 Q24 36 6 30 Z" />
    <path d="M6 26 Q24 32 42 26 L42 22 Q24 28 6 22 Z" />
    <path d="M10 12h20l4 6H14z" />
  </svg>
);

const weaveIcon = (
  <svg viewBox="0 0 48 48" fill="none" stroke="var(--nogal)" strokeWidth="1.6">
    <circle cx="24" cy="24" r="15" />
    <path d="M24 9v30M9 24h30M13 13l22 22M35 13 13 35" />
  </svg>
);

const embroideryIcon = (
  <svg viewBox="0 0 48 48" fill="none" stroke="var(--nogal)" strokeWidth="1.6">
    <circle cx="24" cy="24" r="16" />
    <circle cx="24" cy="24" r="10" />
    <path d="M24 8v6M24 34v6M8 24h6M34 24h6" />
  </svg>
);

const defaultIcon = (
  <svg viewBox="0 0 48 48" fill="none" stroke="var(--nogal)" strokeWidth="1.6">
    <circle cx="24" cy="24" r="16" />
    <path d="M24 16v16M16 24h16" />
  </svg>
);

const THEMES: Record<string, CategoryTheme> = {
  madera: {
    gradient: "linear-gradient(135deg, #EBDCC2, #DCC7A0)",
    labelClassName: "text-ocre",
    icon: woodIcon,
  },
  tejidos: {
    gradient: "linear-gradient(135deg, #E3E9DB, #CBD8C2)",
    labelClassName: "text-salvia",
    icon: weaveIcon,
  },
  bordados: {
    gradient: "linear-gradient(135deg, #EFD9DD, #E3C0C8)",
    labelClassName: "text-ciruela",
    icon: embroideryIcon,
  },
};

const DEFAULT_THEME: CategoryTheme = {
  gradient: "linear-gradient(135deg, #ECE5D5, #DCD3BE)",
  labelClassName: "text-salvia",
  icon: defaultIcon,
};

export function getCategoryTheme(slug?: string | null): CategoryTheme {
  if (!slug) return DEFAULT_THEME;
  return THEMES[slug] ?? DEFAULT_THEME;
}
