const styles = {
  toolbar: "grid gap-3 md:grid-cols-[1fr_auto]",
  addUserIcon: "pr-2",
  addUserForm: "mt-5 grid gap-3",
  select:
    "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100",
  passwordInputWrap: "relative block",
  passwordInput:
    "w-full rounded-md border border-slate-300 bg-white px-3 py-2 pr-16 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100",
  passwordToggle:
    "absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs font-semibold text-teal-700 transition",
  alert:
    "mt-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800",
  inactiveRow: "bg-slate-50 text-slate-500",
  actionButton:
    "rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition",
  dangerButton:
    "rounded-md border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-700 transition",
  modalOverlay:
    "fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6",
  modalPanel:
    "w-full max-w-lg rounded-lg border border-slate-200 bg-white p-5 shadow-xl md:p-6",
  modalHeader: "flex items-start justify-between gap-4",
  modalTitle: "text-xl font-semibold text-slate-950",
  closeButton:
    "flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-xl font-semibold text-slate-500 transition",
  modalActions: "flex items-center justify-between gap-3",
};

export default styles;
