"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { registerUser } from "../../../services/login/loginService";
import {
  signupInitialErrors,
  signupInitialForm,
  validateSignupForm,
} from "../utils/signupForm.utils";

const INVALID_REQUIRED_FIELDS_MESSAGE =
  "Please complete all required fields correctly.";

export default function useSignupForm() {
  const router = useRouter();
  const [form, setForm] = useState(signupInitialForm);
  const [errors, setErrors] = useState(signupInitialErrors);
  const [alertMessage, setAlertMessage] = useState("");

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
    setAlertMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { nextForm, nextErrors, isValid } = validateSignupForm(form);

    setForm(nextForm);
    setErrors(nextErrors);

    if (!isValid) {
      setAlertMessage(INVALID_REQUIRED_FIELDS_MESSAGE);
      return;
    }

    const result = await registerUser(nextForm);

    if (!result.ok) {
      setAlertMessage(result.message);
      return;
    }

    router.push("/login?registered=true");
  };

  return {
    alertMessage,
    errors,
    form,
    handleSubmit,
    updateField,
  };
}

