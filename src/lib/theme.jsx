import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { KEYS, read, write } from "./storage.js";

// O tema inicial é aplicado por um script no index.html (evita "piscar" ao carregar).
const ThemeContext = createContext({ theme: "light", toggle() {} });
export const useTheme = () => useContext(ThemeContext);

const systemTheme = () =>
  window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";

function apply(theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", theme === "dark" ? "#121713" : "#3d4a3e");
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    () => document.documentElement.dataset.theme || read(KEYS.theme, null) || systemTheme(),
  );

  useEffect(() => apply(theme), [theme]);

  // Sem escolha manual salva, acompanha o tema do sistema.
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!mq) return;
    const onChange = () => {
      if (!read(KEYS.theme, null)) setTheme(mq.matches ? "dark" : "light");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const toggle = useCallback(() => {
    const next = theme === "dark" ? "light" : "dark";
    const root = document.documentElement;
    root.classList.add("theme-anim");
    setTimeout(() => root.classList.remove("theme-anim"), 500);
    write(KEYS.theme, next);
    setTheme(next);
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}
