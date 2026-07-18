import * as Icons from "lucide-react";

export const APP_NAME = "Legacy Bridge";
export const API_VERSION = "v1";
export const MAX_RETRY_ATTEMPTS = 3;
export const DEFAULT_PAGE_SIZE = 15;
export const SECURITY_LEVEL = "frontend-hardened";
export const SESSION_DURATION = 30 * 60 * 1000;
export const RATE_LIMIT_WINDOW = 60 * 1000;
export const ALLOWED_FILE_TYPES = ["image/png", "image/jpeg", "application/pdf"];
export const MAX_FILE_SIZE = 20 * 1024 * 1024;
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
export const PHONE_PATTERN = /^\+?[0-9\s-]{7,20}$/;
export const USER_ROLES = {
  GUEST: "Guest",
  USER: "User",
  ADMIN: "Admin",
};

export const COLORS = {
  BACKGROUND: "#f8fafc",
  SURFACE: "#ffffff",
  SURFACE_MUTED: "#f1f5f9",
  BORDER: "#e2e8f0",
  TEXT_PRIMARY: "#0f172a",
  TEXT_SECONDARY: "#475569",
  TEXT_MUTED: "#64748b",
  PRIMARY: "#0f766e",
  PRIMARY_HOVER: "#115e59",
  SUCCESS: "#059669",
  WARNING: "#d97706",
  DANGER: "#dc2626",
};

export const SPACING = {
  XS: "0.25rem",
  SM: "0.5rem",
  MD: "1rem",
  LG: "1.5rem",
  XL: "2rem",
  PAGE_X_MOBILE: "1rem",
  PAGE_X_TABLET: "1.5rem",
  PAGE_X_DESKTOP: "2rem",
  PAGE_Y_MOBILE: "1.25rem",
  PAGE_Y_DESKTOP: "2rem",
};

export const ICONSIZE = {
  XS: 14,
  SM: 16,
  MD: 20,
  LG: 24,
  XL: 32,
};

export const FONTSIZE = {
  XS: "0.75rem",
  SM: "0.875rem",
  MD: "1rem",
  LG: "1.125rem",
  XL: "1.25rem",
  "2XL": "1.5rem",
  "3XL": "1.875rem",
  "4XL": "2.25rem",
};

export const ICONS = {
  ACCOUNT: Icons.User,
  ALERT: Icons.TriangleAlert,
  AUDIT: Icons.ClipboardList,
  CHECK: Icons.Check,
  CHEVRON_DOWN: Icons.ChevronDown,
  CHEVRON_UP: Icons.ChevronUp,
  CONTRAST: Icons.Contrast,
  HOME: Icons.House,
  LOG_IN: Icons.LogIn,
  LOG_OUT: Icons.LogOut,
  SEARCH: Icons.Search,
  SETTINGS: Icons.Settings,
  THEME: Icons.Palette,
  UPLOAD: Icons.Upload,
};
