export const DASHBOARD_KPIS = [
  { label: "Total Users", value: "128" },
  { label: "Records Processed", value: "2,418" },
  { label: "Validation Success", value: "94.6%" },
];

export const DASHBOARD_WEEKLY_VOLUME = [
  { day: "Mon", records: 248 },
  { day: "Tue", records: 312 },
  { day: "Wed", records: 286 },
  { day: "Thu", records: 374 },
  { day: "Fri", records: 421 },
  { day: "Sat", records: 198 },
  { day: "Sun", records: 164 },
];

export const DASHBOARD_MODULE_HEALTH = [
  {
    name: "Upload Workspace",
    detail: "Image and PDF intake available",
    status: "Healthy",
  },
  {
    name: "FHIR Validation",
    detail: "Patient and Observation checks active",
    status: "Healthy",
  },
  {
    name: "Audit Logging",
    detail: "Recent activity is being captured",
    status: "Healthy",
  },
  {
    name: "Backend Sync",
    detail: "Waiting for production API connection",
    status: "Pending",
  },
];

export const DASHBOARD_SYSTEM_CONDITIONS = [
  {
    label: "Response Time",
    value: "182 ms",
    detail: "Average speed when the app responds to user actions",
    status: "Healthy",
  },
  {
    label: "CPU Usage",
    value: "42%",
    detail: "Current workload on the server environment",
    status: "Healthy",
  },
  {
    label: "Error Rate",
    value: "0.8%",
    detail: "Failed actions detected in the current monitoring window",
    status: "Healthy",
  },
];

export const DASHBOARD_ACTIVITY = [
  {
    time: "10:42 AM",
    area: "Users",
    event: "Admin created a new user account",
    status: "Logged",
  },
  {
    time: "10:18 AM",
    area: "Upload",
    event: "Prescription image submitted for extraction",
    status: "Logged",
  },
  {
    time: "09:55 AM",
    area: "Validation",
    event: "FHIR payload marked valid",
    status: "Logged",
  },
  {
    time: "09:31 AM",
    area: "Audit",
    event: "Review status changed to flagged",
    status: "Logged",
  },
];
