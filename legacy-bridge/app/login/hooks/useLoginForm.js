"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  authenticateUser,
  clearRememberedEmail,
  getRememberedEmail,
  saveRememberedEmail,
} from "../../../services/login/loginService";
import { hasValidationErrors } from "../../../utils/globalValidator";
import { showToast } from "../../../components/Toast/ToastProvider";
import { USER_ROLES } from "../../../constants";
import {
  getLoginInitialForm,
  loginInitialErrors,
  validateLoginForm,
} from "../utils/loginForm.utils";

const REGISTRATION_COMPLETE_MESSAGE =
  "Registration complete. Log in with your registered account.";
const INVALID_REQUIRED_FIELDS_MESSAGE =
  "Please complete all required fields correctly.";

const getRegistrationStatus = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return new URLSearchParams(window.location.search).get("registered") === "true";
};

export default function useLoginForm() {
  const router = useRouter();
  const [isRegisteredRedirect] = useState(getRegistrationStatus);
  const [form, setForm] = useState(() =>
    getLoginInitialForm(getRememberedEmail())
  );
  const [errors, setErrors] = useState(loginInitialErrors);
  const [alertMessage, setAlertMessage] = useState(
    isRegisteredRedirect ? REGISTRATION_COMPLETE_MESSAGE : ""
  );

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
    setAlertMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { nextForm, nextErrors, isValid } = validateLoginForm(form);

    setForm(nextForm);
    setErrors(nextErrors);

    if (!isValid) {
      setAlertMessage(INVALID_REQUIRED_FIELDS_MESSAGE);
      return;
    }

    const result = await authenticateUser(nextForm);

    if (!result.ok) {
      setAlertMessage(result.message);
      return;
    }

    if (nextForm.rememberMe) {
      saveRememberedEmail(nextForm.email);
    } else {
      clearRememberedEmail();
    }

    showToast("Successfully signed in.", "success");
    router.push(result.user.role === USER_ROLES.ADMIN ? "/admin" : "/home");
  };

  return {
    alertMessage,
    errors,
    form,
    handleSubmit,
    isSuccessAlert: isRegisteredRedirect && !hasValidationErrors(errors),
    updateField,
  };
}




