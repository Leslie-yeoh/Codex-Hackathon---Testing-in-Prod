import Link from "next/link";
import { globalStyles } from "../../styles/global.style";

const cn = (...classes) => classes.filter(Boolean).join(" ");

const impactStats = [
  { label: "FHIR-ready output", value: "Patient + Observation" },
  { label: "Human review status", value: "Traceable" },
  { label: "Workflow coverage", value: "Review to audit" },
];

const capabilities = [
  {
    title: "Clinical OCR ingestion",
    description:
      "Accept scanned paper charts, handwritten notes, PDFs, or legacy UI screenshots from frontline staff.",
  },
  {
    title: "Malaysian shorthand normalization",
    description:
      "Convert terms like demam, batuk, TCA, PR, and h/o into standard clinical language.",
  },
  {
    title: "FHIR validation workspace",
    description:
      "Preview and edit Patient and Observation resources before a payload is approved.",
  },
  {
    title: "Audit-ready operations",
    description:
      "Track extraction, manual edits, flags, approvals, and reviewer ownership in one flow.",
  },
];

const workflowSteps = [
  "Legacy record input",
  "OCR extraction",
  "AI normalization",
  "FHIR validation",
  "Reviewer decision",
];

export default function HomeContent() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <div className={styles.statusRow}>
            <span className={cn(globalStyles.badge, styles.liveBadge)}>
              Clinical review workspace
            </span>
            <span className={styles.statusText}>FHIR-ready operating environment</span>
          </div>

          <h1 className={styles.heroTitle}>
            Transform legacy hospital records into reviewed cloud-ready data.
          </h1>
          <p className={styles.heroText}>
            Legacy Bridge gives hospital teams a practical workflow for converting
            scanned charts, handwritten notes, and old system screenshots into
            structured FHIR payloads with human review, validation, and audit history.
          </p>
          <div className={styles.heroActions}>
            <Link
              href="/upload"
              className={cn(globalStyles.buttonBase, globalStyles.primaryButton)}
            >
              Start extraction
            </Link>
            <Link
              href="/dashboard"
              className={cn(globalStyles.buttonBase, globalStyles.secondaryButton)}
            >
              View dashboard
            </Link>
          </div>
          <dl className={styles.heroMeta}>
            <div>
              <dt>Primary users</dt>
              <dd>Data clerks, clinical reviewers, hospital IT</dd>
            </div>
            <div>
              <dt>Core workflow</dt>
              <dd>Patient + Observation extraction</dd>
            </div>
          </dl>
        </div>

        <aside className={styles.productPreview} aria-label="Product readiness summary">
          <div className={styles.previewHeader}>
            <div>
              <p className={styles.previewKicker}>Operational readiness</p>
              <h2 className={styles.previewTitle}>Clinical bridge workspace</h2>
            </div>
            <span className={cn(globalStyles.badge, globalStyles.badgeVerified)}>
              Ready
            </span>
          </div>

          <div className={styles.readinessList}>
            <ReadinessItem
              label="Input coverage"
              value="Scans, PDFs, screenshots"
            />
            <ReadinessItem
              label="Reviewer control"
              value="Edit, approve, flag"
            />
            <ReadinessItem
              label="Integration output"
              value="Structured FHIR-style JSON"
            />
          </div>

          <div className={styles.systemCard}>
            <p className={styles.systemTitle}>System posture</p>
            <p className={styles.systemText}>
              Designed for public healthcare teams that need controlled extraction,
              review, validation, and audit visibility before clinical records move
              into connected cloud systems.
            </p>
          </div>
        </aside>
      </section>

      <section className={globalStyles.statsGrid}>
        {impactStats.map((stat) => (
          <div key={stat.label} className={globalStyles.statCard}>
            <p className={globalStyles.statLabel}>{stat.label}</p>
            <p className={globalStyles.statValue}>{stat.value}</p>
          </div>
        ))}
      </section>

      <section className={globalStyles.section}>
        <div className={globalStyles.sectionHeader}>
          <div>
            <h2 className={globalStyles.sectionTitle}>Production-shaped workflow</h2>
            <p className={globalStyles.sectionDescription}>
              The workflow is designed around real operational steps: ingestion, extraction,
              normalization, validation, review, and audit.
            </p>
          </div>
        </div>

        <div className={styles.stepper}>
          {workflowSteps.map((step, index) => (
            <div key={step} className={styles.stepItem}>
              <div className={styles.stepMarkerWrap}>
                <span className={styles.stepMarker} />
                {index < workflowSteps.length - 1 && (
                  <span className={styles.stepConnector} aria-hidden="true" />
                )}
              </div>
              <div className={styles.stepCard}>{step}</div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.capabilityGrid}>
        {capabilities.map((capability) => (
          <article key={capability.title} className={styles.capabilityCard}>
            <h3 className={styles.cardTitle}>{capability.title}</h3>
            <p className={styles.cardText}>{capability.description}</p>
          </article>
        ))}
      </section>

      <section className={styles.readinessPanel}>
        <div>
          <p className={globalStyles.eyebrow}>Why it matters</p>
          <h2 className={styles.readinessTitle}>Built for hospital-ready data handoff.</h2>
          <p className={globalStyles.sectionDescription}>
            Patient transfer between incompatible hospital systems can lose clinical
            context. Legacy Bridge gives teams a structured path to capture, review,
            validate, and trace data before it is prepared for modern EHR integration.
          </p>
        </div>
        <div className={styles.readinessActions}>
          <Link href="/about" className={cn(globalStyles.buttonBase, globalStyles.secondaryButton)}>
            Read about the project
          </Link>
          <Link href="/logs" className={styles.textLink}>
            View audit trail
          </Link>
        </div>
      </section>
    </>
  );
}

function ReadinessItem({ label, value }) {
  return (
    <div className={styles.readinessItem}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

const styles = {
  hero: [
    "grid gap-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm",
    "md:grid-cols-[1.08fr_0.92fr] md:items-center md:p-8",
  ].join(" "),
  heroCopy: "flex flex-col gap-5",
  statusRow: "flex flex-wrap items-center gap-3",
  liveBadge: "bg-teal-50 text-teal-800",
  statusText: "text-sm font-medium text-slate-500",
  heroTitle: "max-w-4xl text-4xl font-semibold tracking-normal text-slate-950 md:text-6xl",
  heroText: "max-w-2xl text-base leading-7 text-slate-600",
  heroActions: "flex flex-col gap-3 sm:flex-row",
  heroMeta: "grid gap-3 border-t border-slate-200 pt-4 text-sm sm:grid-cols-2",
  productPreview: "rounded-lg border border-slate-200 bg-slate-50 p-4 shadow-sm",
  previewHeader: "flex items-start justify-between gap-3",
  previewKicker: "text-xs font-semibold uppercase tracking-wide text-slate-500",
  previewTitle: "mt-1 text-lg font-semibold text-slate-950",
  readinessList: "my-4 grid gap-3",
  readinessItem: "flex flex-col gap-1 rounded-md border border-slate-200 bg-white p-3 text-sm text-slate-600",
  systemCard: "rounded-md bg-slate-900 p-4 text-slate-50",
  systemTitle: "text-sm font-semibold",
  systemText: "mt-2 text-sm leading-6 text-slate-300",
  stepper: "mt-5 grid gap-0 md:grid-cols-5",
  stepItem: "grid grid-cols-[24px_1fr] gap-3 md:grid-cols-1 md:grid-rows-[24px_auto]",
  stepMarkerWrap: "relative flex justify-center md:items-center",
  stepMarker: "relative z-10 mt-3 h-3 w-3 rounded-full bg-teal-700 md:mt-0",
  stepConnector: [
    "absolute left-1/2 top-6 h-[calc(100%+1.25rem)] w-px -translate-x-1/2 bg-slate-200",
    "md:left-[calc(50%+0.75rem)] md:top-1/2 md:h-px md:w-[calc(100%-1.5rem)] md:translate-x-0 md:-translate-y-1/2",
  ].join(" "),
  stepCard: "mb-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 md:mb-0 md:mr-3 md:text-center",
  capabilityGrid: "grid gap-4 md:grid-cols-2 lg:grid-cols-4",
  capabilityCard: "rounded-lg border border-slate-200 bg-white p-5 shadow-sm",
  cardTitle: "mt-4 text-base font-semibold text-slate-950",
  cardText: "mt-2 text-sm leading-6 text-slate-600",
  readinessPanel: "grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-[1fr_auto] md:items-center md:p-6",
  readinessTitle: "mt-2 text-2xl font-semibold text-slate-950",
  readinessActions: "flex flex-col gap-3 sm:flex-row md:flex-col",
  textLink: "mt-4 inline-flex text-sm font-semibold text-teal-700 transition hover:text-teal-900",
};
