"use client";

import Button from "../../../../components/Button/Button";
import Container from "../../../../components/Container/Container";
import ToggleRow from "../../../../components/Form/ToggleRow";
import { globalStyles } from "../../../../styles/global.style";
import {
  BACKUP_FREQUENCY_OPTIONS,
  BACKUP_RETENTION_OPTIONS,
  INTEGRATION_SETTINGS,
  SECURITY_SYSTEM_SETTINGS,
  SITE_CONFIGURATION,
} from "../constants";
import useAdminSettingsForm from "../hooks/useAdminSettingsForm";
import styles from "../settings.style";

export default function AdminSettingsContent() {
  const { backupForm, toggles, updateBackupField, updateToggle } =
    useAdminSettingsForm();

  return (
    <section className={styles.layout}>
      <Container as="article" title="General Site Configuration">
        <div className={styles.fieldGrid}>
          {SITE_CONFIGURATION.map((setting) => (
            <label key={setting.label} className={styles.fieldGroup}>
              <span className={globalStyles.fieldLabel}>{setting.label}</span>
              <input className={globalStyles.input} defaultValue={setting.value} />
            </label>
          ))}
        </div>
        <div className={styles.actions}>
          <Button type="button">Save Configuration</Button>
        </div>
      </Container>

      <Container as="article" title="Security & System">
        <div className={styles.optionList}>
          {SECURITY_SYSTEM_SETTINGS.map((setting) => (
            <ToggleRow
              key={setting.label}
              checked={toggles[setting.label]}
              description={setting.description}
              label={setting.label}
              onChange={(checked) => updateToggle(setting.label, checked)}
            />
          ))}
        </div>
        <div className={styles.actions}>
          <Button type="button">Save System Rules</Button>
        </div>
      </Container>

      <Container as="article" title="Email & Integrations">
        <SettingList settings={INTEGRATION_SETTINGS} />
        <div className={styles.actions}>
          <Button type="button" variant="secondary">
            Manage Integrations
          </Button>
        </div>
      </Container>

      <Container as="article" title="Backup & Maintenance">
        <div className={styles.fieldGrid}>
          <label className={styles.fieldGroup}>
            <span className={globalStyles.fieldLabel}>Backup Frequency</span>
            <select
              className={globalStyles.input}
              value={backupForm.frequency}
              onChange={(event) => updateBackupField("frequency", event.target.value)}
            >
              {BACKUP_FREQUENCY_OPTIONS.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className={styles.fieldGroup}>
            <span className={globalStyles.fieldLabel}>Backup Window</span>
            <input
              className={globalStyles.input}
              type="time"
              value={backupForm.backupWindow}
              onChange={(event) =>
                updateBackupField("backupWindow", event.target.value)
              }
            />
          </label>
          <label className={styles.fieldGroup}>
            <span className={globalStyles.fieldLabel}>Retention</span>
            <select
              className={globalStyles.input}
              value={backupForm.retention}
              onChange={(event) => updateBackupField("retention", event.target.value)}
            >
              {BACKUP_RETENTION_OPTIONS.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <div className={styles.settingItem}>
            <span className={styles.settingLabel}>Last Backup</span>
            <strong className={styles.settingValue}>
              Waiting for backend storage
            </strong>
          </div>
        </div>
        <div className={styles.actions}>
          <Button type="button">Save Backup Policy</Button>
          <Button type="button" variant="secondary">
            Run Backup Check
          </Button>
        </div>
      </Container>
    </section>
  );
}

function SettingList({ settings }) {
  return (
    <div className={styles.settingList}>
      {settings.map((setting) => (
        <div key={setting.label} className={styles.settingItem}>
          <span className={styles.settingLabel}>{setting.label}</span>
          <strong className={styles.settingValue}>{setting.value}</strong>
        </div>
      ))}
    </div>
  );
}
