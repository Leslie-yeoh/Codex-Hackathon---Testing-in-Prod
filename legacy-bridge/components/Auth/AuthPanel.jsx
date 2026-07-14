import Link from "next/link";
import { globalStyles } from "../../styles/global.style";

const cn = (...classes) => classes.filter(Boolean).join(" ");

export default function AuthPanel({
  eyebrow,
  title,
  description,
  submitLabel,
  alternateLabel,
  alternateHref,
}) {
  return (
    <section className={styles.panel}>
      <div className={styles.header}>
        <p className={globalStyles.eyebrow}>{eyebrow}</p>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>{description}</p>
      </div>

      <form className={styles.form}>
        <label className={styles.fieldGroup}>
          <span className={globalStyles.fieldLabel}>Hospital email</span>
          <input
            className={globalStyles.input}
            type="email"
            placeholder="name@hospital.gov.my"
          />
        </label>

        <label className={styles.fieldGroup}>
          <span className={globalStyles.fieldLabel}>One-time passcode</span>
          <div className={styles.otpGrid} aria-label="One-time passcode digits">
            {Array.from({ length: 6 }).map((_, index) => (
              <input
                key={index}
                className={styles.otpInput}
                inputMode="numeric"
                maxLength={1}
                aria-label={`OTP digit ${index + 1}`}
              />
            ))}
          </div>
        </label>

        <button
          type="button"
          className={cn(globalStyles.buttonBase, globalStyles.primaryButton)}
        >
          {submitLabel}
        </button>
      </form>

      <div className={styles.footer}>
        <Link className={styles.link} href="/guest">
          Continue as guest
        </Link>
        <Link className={styles.link} href={alternateHref}>
          {alternateLabel}
        </Link>
      </div>
    </section>
  );
}

const styles = {
  panel: [
    "mx-auto flex w-full max-w-md flex-col gap-6",
    "rounded-lg border border-slate-200 bg-white p-5 shadow-sm",
    "md:p-6",
  ].join(" "),
  header: "flex flex-col gap-2",
  title: "text-2xl font-semibold text-slate-950 md:text-3xl",
  description: "text-sm leading-6 text-slate-600",
  form: "flex flex-col gap-4",
  fieldGroup: "flex flex-col gap-2",
  otpGrid: "grid grid-cols-6 gap-2",
  otpInput: [
    "h-11 w-full rounded-md border border-slate-300 bg-white",
    "text-center text-lg font-semibold text-slate-950 outline-none",
    "transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100",
  ].join(" "),
  footer: [
    "flex flex-col gap-2 border-t border-slate-200 pt-4",
    "text-sm font-medium sm:flex-row sm:justify-between",
  ].join(" "),
  link: "text-teal-700 transition hover:text-teal-900",
};
