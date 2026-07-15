"use client";

import Link from "next/link";
import Button from "../../components/Button/Button";
import InputField from "../../components/Form/InputField";
import { SIGNUP_FIELDS } from "./constants";
import useSignupForm from "./hooks/useSignupForm";
import styles from "./signup.style";

export default function SignupPage() {
  const { alertMessage, errors, form, handleSubmit, updateField } =
    useSignupForm();

  return (
    <main className={styles.authPage}>
      <section className={styles.panel}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>Account Registration</p>
          <h1 className={styles.title}>Create new account</h1>
          <p className={styles.description}>
            Register your account, then log in with the same email and password.
          </p>
        </div>

        {alertMessage && (
          <div className={styles.alert} role="alert">
            {alertMessage}
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.fieldGrid}>
            <InputField
              {...SIGNUP_FIELDS.username}
              value={form.username}
              error={errors.username}
              onChange={(value) => updateField("username", value)}
            />

            <InputField
              {...SIGNUP_FIELDS.email}
              value={form.email}
              error={errors.email}
              onChange={(value) => updateField("email", value)}
            />

            <InputField
              {...SIGNUP_FIELDS.password}
              value={form.password}
              error={errors.password}
              onChange={(value) => updateField("password", value)}
            />

            <InputField
              {...SIGNUP_FIELDS.confirmPassword}
              value={form.confirmPassword}
              error={errors.confirmPassword}
              onChange={(value) => updateField("confirmPassword", value)}
            />
          </div>

          <div className={styles.passwordHint}>
            Password must use at least 8 characters with uppercase, lowercase,
            number, and special character.
          </div>

          <Button type="submit">Create account</Button>
        </form>

        <div className={styles.footer}>
          <Link className={styles.link} href="/login">
            Already registered? Log in
          </Link>
        </div>
      </section>
    </main>
  );
}
