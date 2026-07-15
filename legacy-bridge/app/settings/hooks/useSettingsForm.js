"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { getCurrentUser } from "../../../services/login/loginService";

const themeStorageKey = "legacyBridgeTheme";
const contrastStorageKey = "legacyBridgeHighContrast";

const getStoredTheme = () => {
  if (typeof window === "undefined") {
    return "system";
  }

  return window.localStorage.getItem(themeStorageKey) || "system";
};

const getStoredContrast = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(contrastStorageKey) === "true";
};

const getInitialAccountForm = () => {
  const user = getCurrentUser();

  return {
    username: user?.username || "",
    email: user?.email || "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  };
};

export default function useSettingsForm() {
  const [accountForm, setAccountForm] = useState(getInitialAccountForm);
  const [theme, setTheme] = useState(getStoredTheme);
  const [isHighContrast, setIsHighContrast] = useState(getStoredContrast);
  const [language, setLanguage] = useState("en");
  const [isCookieConsentEnabled, setIsCookieConsentEnabled] = useState(true);
  // Temporary disabled until two-factor setup flow is added.
  // const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);

  useLayoutEffect(() => {
    const root = document.documentElement;
    const applyTheme = () => {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      const activeTheme = theme === "system" ? systemTheme : theme;

      root.dataset.theme = activeTheme;
      window.localStorage.setItem(themeStorageKey, theme);
    };
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    applyTheme();
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", applyTheme);
    } else {
      mediaQuery.addListener(applyTheme);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", applyTheme);
      } else {
        mediaQuery.removeListener(applyTheme);
      }
    };
  }, [theme]);

  useEffect(() => {
    document.documentElement.dataset.contrast = isHighContrast ? "high" : "normal";
    window.localStorage.setItem(contrastStorageKey, String(isHighContrast));
  }, [isHighContrast]);

  const updateAccountField = (field, value) => {
    setAccountForm((current) => ({ ...current, [field]: value }));
  };

  return {
    accountForm,
    isCookieConsentEnabled,
    isHighContrast,
    language,
    setIsCookieConsentEnabled,
    setIsHighContrast,
    setLanguage,
    setTheme,
    theme,
    updateAccountField,
  };
}
