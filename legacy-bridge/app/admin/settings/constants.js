export const SITE_CONFIGURATION = [
  { label: "Website Title", value: "Legacy Bridge" },
  { label: "Description", value: "Clinical legacy data extraction workspace" },
  { label: "Timezone", value: "Asia/Kuala Lumpur" },
  { label: "Support Email", value: "support@legacybridge.local" },
];

export const SECURITY_SYSTEM_SETTINGS = [
  {
    label: "Maintenance Mode",
    enabled: false,
    description: "Temporarily blocks normal visitors while administrators work on the system.",
  },
  {
    label: "Force Password Reset",
    enabled: true,
    description: "Requires users with temporary or outdated passwords to set a new password.",
  },
  {
    label: "Audit Logging",
    enabled: true,
    description: "Records important account, upload, record, and admin actions for traceability.",
  },
  {
    label: "Restricted Admin Links",
    enabled: true,
    description: "Keeps admin-only screens hidden from regular users in the frontend navigation.",
  },
];

export const INTEGRATION_SETTINGS = [
  { label: "Transactional Email", value: "SMTP not connected" },
  { label: "Analytics Tracking", value: "Not configured" },
  { label: "FHIR Endpoint", value: "Pending backend connection" },
  { label: "API Integrations", value: "No active integrations" },
];

export const BACKUP_FREQUENCY_OPTIONS = [
  { key: "hourly", label: "Hourly" },
  { key: "daily", label: "Daily" },
  { key: "weekly", label: "Weekly" },
];

export const BACKUP_RETENTION_OPTIONS = [
  { key: "30", label: "30 days" },
  { key: "90", label: "90 days" },
  { key: "180", label: "180 days" },
];
