"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateCurrentUserPassword } from "../../../services/login/loginService";
import {
  CHANGE_PASSWORD_INITIAL_ERRORS,
  CHANGE_PASSWORD_INITIAL_FORM,
  validateChangePasswordForm,
} from "../utils/changePasswordForm.utils";

const INVALID_REQUIRED_FIELDS_MESSAGE =
  "Please complete all required fields correctly.";

export default function useChangePasswordForm() {
  const router = useRouter();
  const [form, setForm] = useState(CHANGE_PASSWORD_INITIAL_FORM);
  const [errors, setErrors] = useState(CHANGE_PASSWORD_INITIAL_ERRORS);
  const [alertMessage, setAlertMessage] = useState("");

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
    setAlertMessage("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const { nextErrors, isValid } = validateChangePasswordForm(form);

    setErrors(nextErrors);

    if (!isValid) {
      setAlertMessage(INVALID_REQUIRED_FIELDS_MESSAGE);
      return;
    }

    const result = updateCurrentUserPassword(form.newPassword);

    if (!result.ok) {
      setAlertMessage(result.message);
      return;
    }

    router.push("/home");
  };

  return {
    alertMessage,
    errors,
    form,
    handleSubmit,
    updateField,
  };
}
