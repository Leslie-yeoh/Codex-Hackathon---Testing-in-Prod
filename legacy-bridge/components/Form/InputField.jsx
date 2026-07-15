import { useState } from "react";
import { globalStyles } from "../../styles/global.style";

const cn = (...classes) => classes.filter(Boolean).join(" ");

export default function InputField({
  error = "",
  label,
  onChange,
  type = "text",
  value,
  ...props
}) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPasswordField = type === "password";
  const inputType = isPasswordField && isPasswordVisible ? "text" : type;

  return (
    <label className={styles.fieldGroup}>
      <span className={globalStyles.fieldLabel}>{label}</span>
      <span className={styles.inputWrap}>
        <input
          className={cn(
            globalStyles.input,
            isPasswordField && styles.passwordInput,
            error && styles.inputError
          )}
          value={value}
          type={inputType}
          aria-invalid={Boolean(error)}
          onChange={(event) => onChange(event.target.value)}
          {...props}
        />
        {isPasswordField && (
          <button
            type="button"
            className={styles.passwordToggle}
            aria-label={isPasswordVisible ? "Hide password" : "Show password"}
            onClick={() => setIsPasswordVisible((current) => !current)}
          >
            {isPasswordVisible ? "Hide" : "Show"}
          </button>
        )}
      </span>
      {error && <span className={styles.errorText}>{error}</span>}
    </label>
  );
}

const styles = {
  fieldGroup: "flex flex-col gap-2",
  inputWrap: "relative block",
  passwordInput: "pr-16",
  passwordToggle:
    "absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs font-semibold text-teal-700 transition hover:bg-teal-50",
  inputError: "border-red-400 focus:border-red-500 focus:ring-red-100",
  errorText: "text-sm font-medium text-red-700",
};
