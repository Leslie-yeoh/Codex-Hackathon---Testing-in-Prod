const styles = {
  page: "min-h-screen bg-slate-50 p-4 text-slate-950 print:bg-white sm:p-8",
  card: "mx-auto max-w-3xl rounded-lg border border-slate-200 bg-white p-5 shadow-sm print:border-0 print:shadow-none sm:p-8",
  header:
    "flex flex-col gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-start sm:justify-between",
  label: "text-sm font-semibold text-slate-500",
  title: "mt-1 text-2xl font-semibold text-slate-950",
  text: "mt-2 text-sm leading-6 text-slate-600",
  printButton: "print:hidden",
  detailGrid: "mt-5 grid gap-3 sm:grid-cols-2",
  detailItem: "rounded-md border border-slate-200 bg-slate-50 p-3 print:bg-white",
  detailLabel: "block text-sm font-medium text-slate-500",
  detailValue: "mt-1 block text-sm font-semibold text-slate-950",
  contextPanel:
    "mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4 print:bg-white",
  contextTitle: "text-sm font-semibold text-slate-950",
  contextBody: "mt-3 text-sm leading-7 text-slate-700",
  findingsTableWrap:
    "mt-5 overflow-hidden rounded-lg border border-slate-200 bg-white",
  findingsTable: "min-w-full text-left text-sm",
  findingsHeadCell:
    "border-b border-slate-200 bg-slate-50 px-3 py-2 font-semibold text-slate-600",
  findingsCell: "border-b border-slate-100 px-3 py-2 text-slate-700",
};

export default styles;
