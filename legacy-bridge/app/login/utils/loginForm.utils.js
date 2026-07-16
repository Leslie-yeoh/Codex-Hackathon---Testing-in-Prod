import { normalizeEmail } from "../../../utils/globalFormatter";
import {
  hasValidationErrors,
  validateEmail,
  validateRequired,
} from "../../../utils/globalValidator";

export const loginInitialErrors = {
  email: "",
  password: "",
};

export const getLoginInitialForm = (rememberedEmail) => ({
  email: rememberedEmail,
  password: "",
  rememberMe: Boolean(rememberedEmail),
});

export const validateLoginForm = (form) => {
  const nextForm = {
    ...form,
    email: normalizeEmail(form.email),
  };

  const nextErrors = {
    email: validateEmail(nextForm.email),
    password: validateRequired(nextForm.password, "Password"),
  };

  return {
    nextForm,
    nextErrors,
    isValid: !hasValidationErrors(nextErrors),
  };
};
