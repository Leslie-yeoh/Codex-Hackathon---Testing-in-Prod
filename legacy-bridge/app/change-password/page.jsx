"use client";

import Button from "../../components/Button/Button";
import InputField from "../../components/Form/InputField";
import { CHANGE_PASSWORD_FIELDS } from "./constants";
import useChangePasswordForm from "./hooks/useChangePasswordForm";
import styles from "./change-password.style";

export default function ChangePasswordPage() {
  const { alertMessage, errors, form, handleSubmit, updateField } =
    useChangePasswordForm();

  return (
    <main className={styles.page}>
      <section className={styles.panel}>
        <div className={styles.header}>
          <h1 className={styles.title}>Change Password</h1>
          <p className={styles.description}>
            Your account was created with a temporary password. Set a new password
            before continuing.
          </p>
        </div>

        {alertMessage && (
          <div className={styles.alert} role="alert">
            {alertMessage}
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <InputField
            {...CHANGE_PASSWORD_FIELDS.newPassword}
            value={form.newPassword}
            error={errors.newPassword}
            onChange={(value) => updateField("newPassword", value)}
          />
          <InputField
            {...CHANGE_PASSWORD_FIELDS.confirmNewPassword}
            value={form.confirmNewPassword}
            error={errors.confirmNewPassword}
            onChange={(value) => updateField("confirmNewPassword", value)}
          />
          <Button type="submit">Save Password</Button>
        </form>
      </section>
    </main>
  );
}
