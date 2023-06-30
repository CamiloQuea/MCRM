import { useTheme as useNextTheme } from "next-themes";

const THEME_VALUES = ["light", "dark"] as const;
export type Theme = (typeof THEME_VALUES)[number];

export const useTheme = (): {
  theme?: Theme;
  toggle: () => void;
  setDark: () => void;
  setLight: () => void;
} => {
  const { theme, setTheme } = useNextTheme();

  const toggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const setDark = () => {
    setTheme("dark");
  };

  const setLight = () => {
    setTheme("light");
  };

  return {
    theme: theme as Theme,
    toggle,
    setDark,
    setLight,
  };
};
