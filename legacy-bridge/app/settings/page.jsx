"use client";

import { useState } from "react";
import AppShell from "../../components/Layout/AppShell";
import Container from "../../components/Container/Container";
import Button from "../../components/Button/Button";
import { globalStyles } from "../../styles/global.style";
import {
  LANGUAGE_OPTIONS,
  SETTINGS_SECTIONS,
  THEME_OPTIONS,
} from "./constants";
import useSettingsForm from "./hooks/useSettingsForm";
import styles from "./settings.style";
import { isThemeSelected } from "./utils/settingsForm.utils";

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState(SETTINGS_SECTIONS[0].key);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const {
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
  } = useSettingsForm();

  const togglePasswordVisibility = (field) => {
    setVisiblePasswords((current) => ({
      ...current,
      [field]: !current[field],
    }));
  };

  const activeSectionLabel =
    SETTINGS_SECTIONS.find((section) => section.key === activeSection)?.label ||
    SETTINGS_SECTIONS[0].label;

  return (
    <AppShell>
      <section className={globalStyles.pageHeader}>
        <h1 className={globalStyles.pageTitle}>Settings</h1>
      </section>

      <section className={styles.settingsShell}>
        <div className={styles.mobileSectionSelect}>
          <label className={globalStyles.fieldLabel} htmlFor="settings-section">
            Settings Section
          </label>
          <select
            id="settings-section"
            className={globalStyles.input}
            value={activeSection}
            onChange={(event) => setActiveSection(event.target.value)}
          >
            {SETTINGS_SECTIONS.map((section) => (
              <option key={section.key} value={section.key}>
                {section.label}
              </option>
            ))}
          </select>
        </div>

        <aside className={styles.sideNav} aria-label="Settings navigation">
          {SETTINGS_SECTIONS.map((section) => (
            <button
              key={section.key}
              type="button"
              className={
                activeSection === section.key
                  ? styles.sideNavButtonActive
                  : styles.sideNavButton
              }
              onClick={() => setActiveSection(section.key)}
            >
              {section.label}
            </button>
          ))}
        </aside>

        <div className={styles.settingsPanel}>
          {activeSection === "profile" && (
            <Container as="article" title={activeSectionLabel}>
          <div className={styles.profileGrid}>
            <div className={styles.avatarPanel}>
              <div className={styles.avatar}>
                {accountForm.username.slice(0, 2).toUpperCase() || "U"}
              </div>
              <Button type="button" variant="secondary">
                Change picture
              </Button>
            </div>

            <div className={styles.fieldList}>
              <label className={styles.fieldGroup}>
                <span className={globalStyles.fieldLabel}>Display Name</span>
                <input
                  className={globalStyles.input}
                  value={accountForm.username}
                  onChange={(event) =>
                    updateAccountField("username", event.target.value)
                  }
                  placeholder="Display name"
                />
              </label>
              <label className={styles.fieldGroup}>
                <span className={globalStyles.fieldLabel}>Email</span>
                <input
                  className={globalStyles.input}
                  value={accountForm.email}
                  onChange={(event) =>
                    updateAccountField("email", event.target.value)
                  }
                  placeholder="name@hospital.gov.my"
                />
              </label>
              <label className={styles.fieldGroup}>
                <span className={globalStyles.fieldLabel}>Contact Number</span>
                <input
                  className={globalStyles.input}
                  value={accountForm.phone}
                  onChange={(event) =>
                    updateAccountField("phone", event.target.value)
                  }
                  placeholder="+60"
                />
              </label>
              <Button type="button">Save Profile</Button>
            </div>
          </div>
            </Container>
          )}

          {activeSection === "security" && (
            <Container as="article" title={activeSectionLabel}>
          <div className={styles.fieldList}>
            {/*
            <ToggleRow
              checked={isTwoFactorEnabled}
              label="Two-factor authentication"
              onChange={setIsTwoFactorEnabled}
            />
            */}

            <div className={styles.passwordSection}>
              <h3 className={styles.subsectionTitle}>Password</h3>
              <label className={styles.fieldGroup}>
                <span className={globalStyles.fieldLabel}>Current Password</span>
                <PasswordInput
                  isVisible={visiblePasswords.currentPassword}
                  onToggle={() => togglePasswordVisibility("currentPassword")}
                  onChange={(value) =>
                    updateAccountField("currentPassword", value)
                  }
                  value={accountForm.currentPassword}
                  placeholder="Enter current password"
                />
              </label>
              <label className={styles.fieldGroup}>
                <span className={globalStyles.fieldLabel}>New Password</span>
                <PasswordInput
                  isVisible={visiblePasswords.newPassword}
                  onToggle={() => togglePasswordVisibility("newPassword")}
                  onChange={(value) => updateAccountField("newPassword", value)}
                  value={accountForm.newPassword}
                  placeholder="Enter new password"
                />
              </label>
              <label className={styles.fieldGroup}>
                <span className={globalStyles.fieldLabel}>Confirm New Password</span>
                <PasswordInput
                  isVisible={visiblePasswords.confirmNewPassword}
                  onToggle={() => togglePasswordVisibility("confirmNewPassword")}
                  onChange={(value) =>
                    updateAccountField("confirmNewPassword", value)
                  }
                  value={accountForm.confirmNewPassword}
                  placeholder="Confirm new password"
                />
              </label>
            </div>

            <Button type="button">Save Security</Button>
          </div>
            </Container>
          )}

          {activeSection === "interface" && (
            <Container as="article" title={activeSectionLabel}>
          <div className={styles.fieldList}>
            <div className={styles.themeOptions}>
              {THEME_OPTIONS.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  className={
                    isThemeSelected(theme, option.key)
                      ? styles.optionButtonActive
                      : styles.optionButton
                  }
                  onClick={() => setTheme(option.key)}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <ToggleRow
              checked={isHighContrast}
              label="High Contrast"
              onChange={setIsHighContrast}
            />

            <label className={styles.fieldGroup}>
              <span className={globalStyles.fieldLabel}>Language</span>
              <select
                className={globalStyles.input}
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
              >
                {LANGUAGE_OPTIONS.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <Button type="button">Save Preferences</Button>
          </div>
            </Container>
          )}

          {activeSection === "privacy" && (
            <Container as="article" title={activeSectionLabel}>
          <div className={styles.fieldList}>
            <ToggleRow
              checked={isCookieConsentEnabled}
              label="Allow essential cookie consent"
              onChange={setIsCookieConsentEnabled}
            />
            <div className={styles.privacyActions}>
              <Button type="button" variant="secondary">
                Download My Data
              </Button>
              <Button type="button" variant="danger">
                Delete Account
              </Button>
            </div>
          </div>
            </Container>
          )}
        </div>
      </section>
    </AppShell>
  );
}

function PasswordInput({ isVisible, onChange, onToggle, placeholder, value }) {
  return (
    <span className={styles.passwordInputWrap}>
      <input
        className={styles.passwordInput}
        type={isVisible ? "text" : "password"}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
      <button
        type="button"
        className={styles.passwordToggle}
        onClick={onToggle}
      >
        {isVisible ? "Hide" : "Show"}
      </button>
    </span>
  );
}

function ToggleRow({ checked, label, onChange }) {
  return (
    <label className={styles.toggleRow}>
      <span>{label}</span>
      <input
        type="checkbox"
        className={globalStyles.checkbox}
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
    </label>
  );
}
