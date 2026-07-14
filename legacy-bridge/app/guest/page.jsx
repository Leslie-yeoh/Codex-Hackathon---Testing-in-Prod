import Link from "next/link";
import { globalStyles } from "../../styles/global.style";

const cn = (...classes) => classes.filter(Boolean).join(" ");

export default function GuestPage() {
  return (
    <main className={styles.page}>
      <section className={styles.panel}>
        <div className={styles.header}>
          <p className={globalStyles.eyebrow}>Guest View</p>
          <h1 className={styles.title}>Preview the extraction workflow</h1>
          <p className={styles.description}>
            Guest mode lets judges inspect the dashboard, upload workspace, and audit
            flow without creating a clinical reviewer session.
          </p>
        </div>

        <div className={styles.notice}>
          Guest actions are read-only in the final product. Approval, dispense, and
          cloud-write actions should require a named clinical reviewer.
        </div>

        <div className={styles.actions}>
          <Link
            href="/"
            className={cn(globalStyles.buttonBase, globalStyles.primaryButton)}
          >
            Continue as guest
          </Link>
          <Link
            href="/login"
            className={cn(globalStyles.buttonBase, globalStyles.secondaryButton)}
          >
            Log in instead
          </Link>
        </div>
      </section>
    </main>
  );
}

const styles = {
  page: `${globalStyles.appShell} flex min-h-screen items-center px-4 py-8`,
  panel: [
    "mx-auto flex w-full max-w-lg flex-col gap-6",
    "rounded-lg border border-slate-200 bg-white p-5 shadow-sm",
    "md:p-6",
  ].join(" "),
  header: "flex flex-col gap-2",
  title: "text-2xl font-semibold text-slate-950 md:text-3xl",
  description: "text-sm leading-6 text-slate-600",
  notice: "rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-900",
  actions: "flex flex-col gap-3 sm:flex-row",
};
