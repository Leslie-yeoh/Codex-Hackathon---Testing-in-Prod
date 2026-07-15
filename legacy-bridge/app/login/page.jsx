"use client";

import Link from "next/link";
import Button from "../../components/Button/Button";
import InputField from "../../components/Form/InputField";
import { globalStyles } from "../../styles/global.style";
import { LOGIN_FIELDS } from "./constants";
import useLoginForm from "./hooks/useLoginForm";
import styles from "./login.style";

const cn = (...classes) => classes.filter(Boolean).join(" ");

export default function LoginPage() {
  const {
    alertMessage,
    errors,
    form,
    handleSubmit,
    isSuccessAlert,
    updateField,
  } = useLoginForm();

  return (
    <main className={styles.authPage}>
      <section className={styles.panel}>
        <div className={styles.header}>
          <h1 className={styles.title}>Log in to Legacy Bridge</h1>
        </div>

        {alertMessage && (
          <div
            className={cn(
              styles.alert,
              isSuccessAlert ? styles.alertSuccess : styles.alertError
            )}
            role="alert"
          >
            {alertMessage}
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <InputField
            {...LOGIN_FIELDS.email}
            value={form.email}
            error={errors.email}
            onChange={(value) => updateField("email", value)}
          />

          <InputField
            {...LOGIN_FIELDS.password}
            value={form.password}
            error={errors.password}
            onChange={(value) => updateField("password", value)}
          />

          <label className={styles.checkboxRow}>
            <input
              type="checkbox"
              className={globalStyles.checkbox}
              checked={form.rememberMe}
              onChange={(event) => updateField("rememberMe", event.target.checked)}
            />
            <span>Remember me on this device</span>
          </label>

          <Button type="submit">Log in</Button>
        </form>

        <div className={styles.footer}>
          <p className={styles.accountPrompt}>
            Don&apos;t have an account?{" "}
            <Link className={styles.link} href="/signup">
              Create one
            </Link>
            .
          </p>
          <Link className={styles.link} href="/home">
            Continue without signing in
          </Link>
        </div>
      </section>
    </main>
  );
}
