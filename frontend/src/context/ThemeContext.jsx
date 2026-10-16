import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

const STORAGE_KEY = "et-theme";

// Applies the resolved theme to <html data-theme="...">
const applyTheme = (resolved) => {
  document.documentElement.setAttribute("data-theme", resolved);
};

// Resolves "system" to "light" or "dark" based on the OS preference.
const resolveTheme = (preference) => {
  if (preference === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return preference;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || "system";
  });

  // Apply on mount and whenever theme changes
  useEffect(() => {
    const resolved = resolveTheme(theme);
    applyTheme(resolved);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  // Listen for OS-level dark mode changes when in "system" mode
  useEffect(() => {
    if (theme !== "system") return undefined;

    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => applyTheme(resolveTheme("system"));
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, [theme]);

  const resolved = resolveTheme(theme);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolved }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};
