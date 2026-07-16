import {
  hasValidationErrors,
  validatePassword,
  validatePasswordConfirmation,
} from "../../../utils/globalValidator";

export const CHANGE_PASSWORD_INITIAL_FORM = {
  newPassword: "",
  confirmNewPassword: "",
};

export const CHANGE_PASSWORD_INITIAL_ERRORS = {
  newPassword: "",
  confirmNewPassword: "",
};

export const validateChangePasswordForm = (form) => {
  const nextErrors = {
    newPassword: validatePassword(form.newPassword),
    confirmNewPassword: validatePasswordConfirmation(
      form.newPassword,
      form.confirmNewPassword
    ),
  };

  return {
    nextErrors,
    isValid: !hasValidationErrors(nextErrors),
  };
};
