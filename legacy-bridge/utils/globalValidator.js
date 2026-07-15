import { EMAIL_PATTERN, PASSWORD_PATTERN } from "../constants";

const usernamePattern = /^[A-Za-z0-9 _.-]+$/;

export const validateRequired = (value, label) => {
  if (!value || !value.trim()) {
    return `${label} is required.`;
  }

  return "";
};

export const validateEmail = (value) => {
  const requiredMessage = validateRequired(value, "Email");

  if (requiredMessage) {
    return requiredMessage;
  }

  if (!EMAIL_PATTERN.test(value)) {
    return "Enter a valid email address.";
  }

  return "";
};

export const validateUsername = (value) => {
  const requiredMessage = validateRequired(value, "Username");

  if (requiredMessage) {
    return requiredMessage;
  }

  if (value.trim().length < 3) {
    return "Username must be at least 3 characters.";
  }

  if (value.trim().length > 40) {
    return "Username must be 40 characters or fewer.";
  }

  if (!usernamePattern.test(value)) {
    return "Username can only include letters, numbers, spaces, dots, underscores, and hyphens.";
  }

  return "";
};

export const validatePassword = (value) => {
  const requiredMessage = validateRequired(value, "Password");

  if (requiredMessage) {
    return requiredMessage;
  }

  if (!PASSWORD_PATTERN.test(value)) {
    return "Password must include at least 8 characters, uppercase, lowercase, number, and special character.";
  }

  return "";
};

export const validatePasswordConfirmation = (password, confirmPassword) => {
  const requiredMessage = validateRequired(confirmPassword, "Confirm password");

  if (requiredMessage) {
    return requiredMessage;
  }

  if (password !== confirmPassword) {
    return "Passwords do not match.";
  }

  return "";
};

export const hasValidationErrors = (errors) =>
  Object.values(errors).some((message) => Boolean(message));
