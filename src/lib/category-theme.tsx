import { AxeIcon, FlowerIcon, ShapesIcon, SpoolIcon, type LucideIcon } from "lucide-react";

export type CategoryTheme = {
  gradient: string;
  accentColor: string;
  icon: LucideIcon;
};

const maderaTheme: CategoryTheme = {
  gradient: "linear-gradient(135deg, #EBDCC2, #DCC7A0)",
  accentColor: "#B5792E",
  icon: AxeIcon,
};

const THEMES: Record<string, CategoryTheme> = {
  madera: maderaTheme,
  "artesania-en-madera": maderaTheme,
  tejidos: {
    gradient: "linear-gradient(135deg, #E3E9DB, #CBD8C2)",
    accentColor: "#A34A3E",
    icon: SpoolIcon,
  },
  bordados: {
    gradient: "linear-gradient(135deg, #EFD9DD, #E3C0C8)",
    accentColor: "#8B4C6B",
    icon: FlowerIcon,
  },
};

const DEFAULT_THEME: CategoryTheme = {
  gradient: "linear-gradient(135deg, #ECE5D5, #DCD3BE)",
  accentColor: "#6b5f52",
  icon: ShapesIcon,
};

export function getCategoryTheme(slug?: string | null): CategoryTheme {
  if (!slug) return DEFAULT_THEME;
  return THEMES[slug] ?? DEFAULT_THEME;
}
