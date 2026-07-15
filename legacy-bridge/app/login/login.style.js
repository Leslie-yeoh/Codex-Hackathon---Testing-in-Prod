import { globalStyles } from "../../styles/global.style";

const styles = {
  authPage: `${globalStyles.appShell} flex min-h-screen items-center px-4 py-8`,
  panel: [
    "mx-auto flex w-full max-w-md flex-col gap-6",
    "rounded-lg border border-slate-200 bg-white p-5 shadow-sm",
    "md:p-6",
  ].join(" "),
  header: "flex flex-col gap-2",
  title: "text-2xl font-semibold text-slate-950 md:text-3xl",
  alert: "rounded-md border p-3 text-sm leading-6",
  alertError: "border-red-200 bg-red-50 text-red-800",
  alertSuccess: "border-emerald-200 bg-emerald-50 text-emerald-800",
  form: "flex flex-col gap-4",
  checkboxRow:
    "flex min-h-11 cursor-pointer items-center gap-3 text-sm font-medium text-slate-700",
  footer: [
    "flex flex-col items-center gap-3 border-t border-slate-200 pt-4 text-center",
    "text-sm font-medium",
  ].join(" "),
  accountPrompt: "text-slate-600",
  link: "text-teal-700 transition hover:text-teal-900",
};

export default styles;
