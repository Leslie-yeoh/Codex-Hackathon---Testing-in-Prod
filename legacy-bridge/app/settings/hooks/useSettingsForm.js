"use client";

import { useState } from "react";
import { getCurrentUser } from "../../../services/login/loginService";
import { SETTINGS_SECTIONS } from "../constants";

const themeStorageKey = "legacyBridgeTheme";
const contrastStorageKey = "legacyBridgeHighContrast";
const languageStorageKey = "legacyBridgeLanguage";

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
const getStoredLanguage = () => {
  if (typeof window === "undefined") {
    return "en";
  }

  return window.localStorage.getItem(languageStorageKey) || "en";
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
  const [activeSection, setActiveSection] = useState(SETTINGS_SECTIONS[0].key);
  const [accountForm, setAccountForm] = useState(getInitialAccountForm);
  const [theme, setTheme] = useState(getStoredTheme);
  const [isHighContrast, setIsHighContrast] = useState(getStoredContrast);
  const [language, setLanguage] = useState(getStoredLanguage);
  const [isCookieConsentEnabled, setIsCookieConsentEnabled] = useState(true);
  // Temporary disabled until two-factor setup flow is added.
  // const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);

  const updateAccountField = (field, value) => {
    setAccountForm((current) => ({ ...current, [field]: value }));
  };
  const savePreferences = () => {
    const root = document.documentElement;
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

    root.dataset.theme = theme === "system" ? systemTheme : theme;
    root.dataset.contrast = isHighContrast ? "high" : "normal";
    window.localStorage.setItem(themeStorageKey, theme);
    window.localStorage.setItem(contrastStorageKey, String(isHighContrast));
    window.localStorage.setItem(languageStorageKey, language);
  };

  const activeSectionLabel =
    SETTINGS_SECTIONS.find((section) => section.key === activeSection)?.label ||
    SETTINGS_SECTIONS[0].label;

  return {
    accountForm,
    activeSection,
    activeSectionLabel,
    isCookieConsentEnabled,
    isHighContrast,
    language,
    setActiveSection,
    savePreferences,
    setIsCookieConsentEnabled,
    setIsHighContrast,
    setLanguage,
    setTheme,
    theme,
    updateAccountField,
  };
}
