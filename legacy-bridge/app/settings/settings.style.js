const styles = {
  settingsShell: "grid gap-4 lg:grid-cols-[260px_1fr]",
  mobileSectionSelect: "grid gap-2 lg:hidden",
  sideNav:
    "hidden self-start rounded-lg border border-slate-200 bg-white p-2 shadow-sm lg:sticky lg:top-24 lg:grid lg:gap-1",
  sideNavButton:
    "w-full rounded-md px-3 py-2 text-left text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950",
  sideNavButtonActive:
    "w-full rounded-md bg-teal-700 px-3 py-2 text-left text-sm font-semibold text-white",
  settingsPanel: "min-w-0",
  profileGrid: "mt-4 grid gap-4 lg:grid-cols-[220px_1fr]",
  avatarPanel:
    "mx-auto flex aspect-square w-full max-w-56 flex-col items-center justify-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 lg:mx-0",
  avatar:
    "flex h-20 w-20 items-center justify-center rounded-xl bg-teal-700 text-xl font-bold text-white",
  fieldList: "mt-4 grid gap-4",
  fieldGroup: "flex flex-col gap-2",
  passwordSection: "grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4",
  passwordInputWrap: "relative block",
  passwordInput:
    "w-full rounded-md border border-slate-300 bg-white px-3 py-2 pr-16 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100",
  passwordToggle:
    "absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs font-semibold text-teal-700 transition hover:bg-teal-50",
  subsectionTitle: "text-base font-semibold text-slate-950",
  optionList: "mt-4 grid gap-3",
  themeOptions: "grid gap-2 sm:grid-cols-3",
  optionButton:
    "rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50",
  optionButtonActive:
    "rounded-md border border-teal-700 bg-teal-50 px-3 py-2 text-sm font-semibold text-teal-800 transition hover:bg-teal-100",
  toggleRow:
    "flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3 text-sm font-medium text-slate-700",
  privacyActions: "grid gap-2 sm:grid-cols-2",
};

export default styles;
