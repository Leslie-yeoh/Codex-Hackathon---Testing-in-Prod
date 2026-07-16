"use client";

import { useState } from "react";
import { SECURITY_SYSTEM_SETTINGS } from "../constants";

const initialBackupForm = {
  frequency: "daily",
  retention: "90",
  backupWindow: "02:00",
};

const getInitialToggles = () =>
  Object.fromEntries(
    SECURITY_SYSTEM_SETTINGS.map((setting) => [setting.label, setting.enabled])
  );

export default function useAdminSettingsForm() {
  const [toggles, setToggles] = useState(getInitialToggles);
  const [backupForm, setBackupForm] = useState(initialBackupForm);

  const updateToggle = (label, enabled) => {
    setToggles((current) => ({
      ...current,
      [label]: enabled,
    }));
  };

  const updateBackupField = (field, value) => {
    setBackupForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  return {
    backupForm,
    toggles,
    updateBackupField,
    updateToggle,
  };
}
