import { globalStyles } from "../../styles/global.style";

const styles = {
  authPage: `${globalStyles.appShell} flex min-h-screen items-center px-4 py-8`,
  panel: [
    "mx-auto flex w-full max-w-3xl flex-col gap-6",
    "rounded-lg border border-slate-200 bg-white p-5 shadow-sm",
    "md:p-6",
  ].join(" "),
  header: "flex flex-col gap-2",
  eyebrow: "text-xs font-semibold uppercase tracking-wide text-teal-700",
  title: "text-2xl font-semibold text-slate-950 md:text-3xl",
  description: "text-sm leading-6 text-slate-600",
  alert: "rounded-md border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-800",
  form: "flex flex-col gap-4",
  fieldGrid: "grid gap-4 md:grid-cols-2",
  passwordHint: "rounded-md bg-slate-50 p-3 text-sm leading-6 text-slate-600",
  footer: "border-t border-slate-200 pt-4 text-sm font-medium",
  link: "text-teal-700 transition hover:text-teal-900",
};

export default styles;
