"use client";

import { useEffect } from "react";

const themeStorageKey = "legacyBridgeTheme";
const contrastStorageKey = "legacyBridgeHighContrast";

const getSystemTheme = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

const applyPreferences = () => {
  const root = document.documentElement;
  const theme = window.localStorage.getItem(themeStorageKey) || "system";
  const activeTheme = theme === "system" ? getSystemTheme() : theme;
  const highContrast =
    window.localStorage.getItem(contrastStorageKey) === "true";

  root.dataset.theme = activeTheme;
  root.dataset.contrast = highContrast ? "high" : "normal";
};

export default function ThemeProvider({ children }) {
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    applyPreferences();
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", applyPreferences);
    } else {
      mediaQuery.addListener(applyPreferences);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", applyPreferences);
      } else {
        mediaQuery.removeListener(applyPreferences);
      }
    };
  }, []);

  return children;
}
