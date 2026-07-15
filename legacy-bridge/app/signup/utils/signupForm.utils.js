import {
  normalizeEmail,
  normalizeUsername,
} from "../../../utils/globalFormatter";
import {
  hasValidationErrors,
  validateEmail,
  validatePassword,
  validatePasswordConfirmation,
  validateUsername,
} from "../../../utils/globalValidator";

export const signupInitialErrors = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export const signupInitialForm = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export const validateSignupForm = (form) => {
  const nextForm = {
    ...form,
    username: normalizeUsername(form.username),
    email: normalizeEmail(form.email),
  };

  const nextErrors = {
    username: validateUsername(nextForm.username),
    email: validateEmail(nextForm.email),
    password: validatePassword(nextForm.password),
    confirmPassword: validatePasswordConfirmation(
      nextForm.password,
      nextForm.confirmPassword
    ),
  };

  return {
    nextForm,
    nextErrors,
    isValid: !hasValidationErrors(nextErrors),
  };
};
