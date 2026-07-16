const styles = {
  hero: [
    "grid gap-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm",
    "md:grid-cols-[1.08fr_0.92fr] md:items-center md:p-8",
  ].join(" "),
  heroCopy: "flex flex-col gap-5",
  statusRow: "flex flex-wrap items-center gap-3",
  liveBadge: "bg-teal-50 text-teal-800",
  statusText: "text-sm font-medium text-slate-500",
  heroTitle:
    "max-w-4xl text-4xl font-semibold tracking-normal text-slate-950 md:text-6xl",
  heroText: "max-w-2xl text-base leading-7 text-slate-600",
  heroActions: "flex flex-col gap-3 sm:flex-row",
  heroMeta: "grid gap-3 border-t border-slate-200 pt-4 text-sm sm:grid-cols-2",
  productPreview: "rounded-lg border border-slate-200 bg-slate-50 p-4 shadow-sm",
  previewHeader: "flex items-start justify-between gap-3",
  previewTitle: "text-lg font-semibold text-slate-950",
  readinessList: "my-4 grid gap-3",
  readinessItem:
    "flex flex-col gap-1 rounded-md border border-slate-200 bg-white p-3 text-sm text-slate-600",
  systemCard: "rounded-md bg-slate-900 p-4 text-slate-50",
  systemTitle: "text-sm font-semibold",
  systemText: "mt-2 text-sm leading-6 text-slate-300",
  stepper: "mt-5 grid gap-0 md:grid-cols-5",
  stepItem:
    "grid grid-cols-[24px_1fr] gap-3 md:grid-cols-1 md:grid-rows-[24px_auto]",
  stepMarkerWrap: "relative flex justify-center md:items-center",
  stepMarker: "relative z-10 mt-3 h-3 w-3 rounded-full bg-teal-700 md:mt-0",
  stepConnector: [
    "absolute left-1/2 top-6 h-[calc(100%+1.25rem)] w-px -translate-x-1/2 bg-slate-200",
    "md:left-[calc(50%+0.75rem)] md:top-1/2 md:h-px md:w-[calc(100%-1.5rem)] md:translate-x-0 md:-translate-y-1/2",
  ].join(" "),
  stepCard:
    "mb-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 md:mb-0 md:mr-3 md:text-center",
  capabilityGrid: "grid gap-4 md:grid-cols-2 lg:grid-cols-4",
  capabilityCard: "rounded-lg border border-slate-200 bg-white p-5 shadow-sm",
  cardTitle: "mt-4 text-base font-semibold text-slate-950",
  cardText: "mt-2 text-sm leading-6 text-slate-600",
  readinessPanel:
    "grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-[1fr_auto] md:items-center md:p-6",
  readinessTitle: "mt-2 text-2xl font-semibold text-slate-950",
  readinessActions: "flex flex-col gap-3 sm:flex-row md:flex-col",
  textLink:
    "mt-4 inline-flex text-sm font-semibold text-teal-700 transition hover:text-teal-900",
};

export default styles;
