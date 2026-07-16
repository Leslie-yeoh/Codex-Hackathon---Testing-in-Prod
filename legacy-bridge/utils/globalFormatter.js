const htmlEntityMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "`": "&#96;",
};

export const coerceToString = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value);
};

export const stripHtmlTags = (value) =>
  coerceToString(value).replace(/<[^>]*>/g, "");

export const escapeString = (value) =>
  coerceToString(value).replace(/[&<>"'`]/g, (character) => htmlEntityMap[character]);

export const securitySanitizer = (value, maxLength = 255) => {
  const safeLength = Number.isFinite(maxLength) && maxLength > 0 ? maxLength : 255;
  const withoutTags = stripHtmlTags(value)
    .replace(/script/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "");

  return escapeString(withoutTags).slice(0, safeLength);
};

export const normalizeEmail = (value) =>
  securitySanitizer(value, 120).trim().toLowerCase();

export const normalizeUsername = (value) =>
  securitySanitizer(value, 40).trim().replace(/\s+/g, " ");

export const trimValue = (value) => securitySanitizer(value).trim();
