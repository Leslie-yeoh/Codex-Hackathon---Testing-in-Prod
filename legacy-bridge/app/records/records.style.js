const styles = {
  emptyState:
    "rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center",
  emptyTitle: "text-lg font-semibold text-slate-950",
  emptyText: "mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600",
  mobileFilterBar: "mb-4 flex md:hidden",
  filterButton: "w-full gap-2",
  recordsLayout: "grid items-start gap-4 md:grid-cols-[330px_1fr]",
  desktopFilterPanel:
    "hidden min-w-0 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:block",
  filterFields: "grid min-w-0 gap-4",
  filterField: "grid gap-2",
  filterActions: "grid gap-2 sm:grid-cols-2 md:grid-cols-1",
  recordsGrid: "grid content-start gap-4",
  listPanel: "grid gap-3",
  resultCount: "text-sm font-semibold text-slate-600",
  noResults:
    "rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm font-medium text-slate-600",
  recordList: "grid gap-3",
  recordButton:
    "flex w-full items-start justify-between gap-3 rounded-lg border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-teal-200 hover:bg-teal-50",
  recordTitle: "block text-sm font-semibold text-slate-950",
  recordMeta: "mt-1 block text-sm text-slate-600",
  modalOverlay: "fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4",
  modalBackdrop: "absolute inset-0 h-full w-full bg-slate-950/45",
  modalPanel:
    "relative max-h-[88vh] w-full overflow-y-auto rounded-t-2xl border border-slate-200 bg-white p-4 shadow-2xl sm:max-w-3xl sm:rounded-lg sm:p-5",
  detailHeader: "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
  detailTitle: "text-lg font-semibold text-slate-950",
  detailActions: "flex flex-col gap-2 sm:flex-row",
  actionButton: "gap-2",
  closeButton:
    "absolute right-4 top-4 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:static",
  shareMessage:
    "mt-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800",
  detailGrid: "mt-4 grid gap-3",
  detailItem: "rounded-md border border-slate-200 bg-slate-50 p-3",
  detailLabel: "block text-sm font-medium text-slate-500",
  detailValue: "mt-1 block text-sm font-semibold text-slate-950",
  originalImage: "mt-4 max-h-96 w-full rounded-lg border border-slate-200 object-contain",
  contextPanel:
    "mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4",
  contextTitle: "text-sm font-semibold text-slate-950",
  contextBody: "mt-3 text-sm leading-7 text-slate-700 [&_h2]:mt-4 [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:mt-3 [&_h3]:font-semibold [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_table]:my-3 [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-slate-300 [&_th]:bg-white [&_th]:px-2 [&_th]:py-1 [&_th]:text-left [&_td]:border [&_td]:border-slate-300 [&_td]:px-2 [&_td]:py-1",
  contextEmpty: "mt-3 text-sm leading-6 text-slate-500",
  findingsTableWrap:
    "mt-4 overflow-hidden rounded-lg border border-slate-200 bg-white",
  findingsTable: "min-w-full text-left text-sm",
  findingsHeadCell:
    "border-b border-slate-200 bg-slate-50 px-3 py-2 font-semibold text-slate-600",
  findingsCell: "border-b border-slate-100 px-3 py-2 text-slate-700",
};

export default styles;
