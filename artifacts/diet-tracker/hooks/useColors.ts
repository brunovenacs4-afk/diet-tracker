import { useApp } from "@/contexts/AppContext";
import colors from "@/constants/colors";

export type Theme = "light" | "dark";

export function useColors() {
  const { theme } = useApp();
  const palette = theme === "dark" ? colors.dark : colors.light;
  return { ...palette, radius: colors.radius };
}
