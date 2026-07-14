import { globalStyles } from "../../styles/global.style";

const architecture = [
  "Unstructured input: image, PDF, handwritten note, or legacy screenshot",
  "OCR layer: extracts raw text from the source material",
  "AI normalization: maps shorthand and mixed-language terms into clinical language",
  "FHIR mapping: validates Patient and Observation structures",
  "Audit trail: records reviewer actions and approval history",
];

const principles = [
  {
    title: "Clinical safety first",
    description: "Low-confidence fields are surfaced for manual review before approval.",
  },
  {
    title: "Interoperability over lock-in",
    description: "The MVP uses FHIR-style payloads so extracted data can move between systems.",
  },
  {
    title: "Traceable human review",
    description: "Every edit, flag, and approval should be connected to an operator.",
  },
];

export default function AboutContent() {
  return (
    <>
      <section className={styles.grid}>
        <article className={globalStyles.section}>
          <h2 className={globalStyles.sectionTitle}>The problem</h2>
          <p className={styles.paragraph}>
            Many hospital workflows still depend on paper records, exported scans, or
            isolated legacy systems. When patient information moves between facilities,
            important context can be delayed, duplicated, or lost.
          </p>
        </article>

        <article className={globalStyles.section}>
          <h2 className={globalStyles.sectionTitle}>The solution</h2>
          <p className={styles.paragraph}>
            Legacy Bridge acts as a middleware layer. It converts messy clinical inputs
            into structured, reviewable, FHIR-ready data that can support modern EHR
            integration.
          </p>
        </article>
      </section>

      <section className={globalStyles.section}>
        <div className={globalStyles.sectionHeader}>
          <div>
            <h2 className={globalStyles.sectionTitle}>System architecture</h2>
            <p className={globalStyles.sectionDescription}>
              The hackathon demo focuses on the path from unstructured records to a
              validated clinical payload.
            </p>
          </div>
        </div>
        <ol className={styles.timeline}>
          {architecture.map((item, index) => (
            <li key={item} className={styles.timelineItem}>
              <span className={styles.timelineNumber}>{index + 1}</span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.cards}>
        {principles.map((principle) => (
          <article key={principle.title} className={globalStyles.section}>
            <h3 className={styles.cardTitle}>{principle.title}</h3>
            <p className={styles.paragraph}>{principle.description}</p>
          </article>
        ))}
      </section>
    </>
  );
}

const styles = {
  grid: "grid gap-4 md:grid-cols-2",
  paragraph: "mt-3 text-sm leading-6 text-slate-600 md:text-base",
  timeline: "mt-5 grid gap-3",
  timelineItem: "flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700",
  timelineNumber: "flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-teal-700 text-xs font-bold text-white",
  cards: "grid gap-4 md:grid-cols-3",
  cardTitle: "text-base font-semibold text-slate-950",
};
