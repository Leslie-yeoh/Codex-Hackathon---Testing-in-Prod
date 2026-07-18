import Image from "next/image";

import Container from "../../../components/Container/Container";

const architecture = [
  "Upload source: staff add a photo, scan, PDF, or screenshot from an older record.",
  "Text reading: the system reads the visible text so staff do not need to type everything again.",
  "Clinical organization: extracted content is arranged into patient context, findings, values, and notes.",
  "Human review: staff correct missing or unclear information before confirming the record.",
  "Saved record: confirmed information becomes searchable and can be shared as a PDF or link.",
];

const principles = [
  {
    title: "For hospital staff",
    description:
      "Legacy Bridge reduces repeated typing and gives staff a clear place to check, correct, and confirm extracted record details.",
  },
  {
    title: "For reviewers",
    description:
      "Reviewers can compare the original context with extracted fields, then confirm only when the information is complete.",
  },
  {
    title: "For technical teams",
    description:
      "The interface keeps records structured and traceable so future backend services can connect them to hospital systems.",
  },
];

const emrHighlights = [
  {
    title: "22 of 151 hospitals",
    description: "Government hospitals reported as fully digital as of July 2026.",
  },
  {
    title: "510 of 2,917 facilities",
    description: "Primary healthcare facilities reported as fully digital as of July 2026.",
  },
  {
    title: "2028-2030 rollout",
    description: "Government clinics are targeted for full digitalisation by 2028, followed by hospitals by 2030.",
  },
];
const nationalGoals = [
  "Support Malaysia's 2030 goal for a nationwide electronic medical record.",
  "Replace paper records with secure, seamless sharing across public and private healthcare.",
  "Reduce patient waiting times by making reviewed records easier to find and use.",
];
const technologyStack = [
  {
    name: "JavaScript",
    type: "Programming language",
    icon: "/logo/language_icon/JavaScript.png",
  },
  {
    name: "Python",
    type: "Programming language",
    icon: "/logo/language_icon/Python.png",
  },
  {
    name: "React",
    type: "Frontend framework",
    icon: "/logo/language_icon/React.png",
  },
  {
    name: "Next.js",
    type: "Application framework",
    icon: "/logo/language_icon/Next.js.png",
  },
  {
    name: "MongoDB",
    type: "Database framework",
    icon: "/logo/language_icon/mongodb.png",
  },
  {
    name: "Codex",
    type: "AI development assistant",
    icon: "/logo/language_icon/codex-color.png",
  },
  {
    name: "Gemini",
    type: "AI support tool",
    icon: "/logo/language_icon/gemini-color.png",
  },
];

const futureDevelopments = [
  {
    title: "Redis integration",
    description:
      "Use Redis for short-lived extraction jobs, session coordination, caching, and queue status so users can leave and return without losing processing progress.",
  },
  {
    title: "Better OCR model",
    description:
      "Improve document reading with stronger OCR support for handwriting, scanned prescriptions, low-quality images, tables, and mixed clinical notes.",
  },
  {
    title: "Async extraction workspace",
    description:
      "Run extraction as a background job so larger files can process without blocking the page. Users can see progress, continue other work, and return when the result is ready.",
  },
];

export default function AboutContent() {
  return (
    <>
      <section className={styles.emrPanel} aria-labelledby="emr-transition-title">
        <div>
          <p className={styles.emrEyebrow}>Malaysia EMR transition</p>
          <h2 id="emr-transition-title" className={styles.emrTitle}>
            From paper files to connected care
          </h2>
          <p className={styles.emrText}>
            Public healthcare is expanding electronic medical records to make patient
            information easier to find, review, and share across care settings.
          </p>
        </div>
        <div className={styles.emrHighlights}>
          {emrHighlights.map((highlight) => (
            <article key={highlight.title} className={styles.emrHighlight}>
              <h3 className={styles.emrHighlightTitle}>{highlight.title}</h3>
              <p className={styles.emrHighlightText}>{highlight.description}</p>
            </article>
          ))}
        </div>
        <a
          className={styles.emrSource}
          href="https://berita.rtm.gov.my/nasional/senarai-berita-nasional/senarai-artikel/kkm-sasar-pendigitalan-penuh-klinik-kerajaan-menjelang-2028/"
          target="_blank"
          rel="noreferrer"
        >
          Source: Ministry of Health update reported by RTM, 8 July 2026
        </a>
      </section>
      <section className={styles.grid}>
        <Container as="article" title="The problem">
          <p className={styles.paragraph}>
            Many healthcare workflows still depend on paper records, scanned documents,
            or systems that cannot easily share data with newer platforms. Staff may
            need to read the same document many times, retype information, or search
            through old files when a patient returns.
          </p>
        </Container>

        <Container as="article" title="The solution">
          <p className={styles.paragraph}>
            Legacy Bridge provides a guided workspace for turning those older sources
            into digital records. The goal is not to replace clinical judgment. The
            goal is to help users capture the context, review extracted details, fix
            gaps, and save a confirmed version for later use.
          </p>
        </Container>
      </section>

      <Container
        title="How it works"
        description="The same workflow can be understood by non-technical users and technical teams: start with the source, organize the information, review it, then save it."
      >
        <ol className={styles.timeline}>
          {architecture.map((item, index) => (
            <li key={item} className={styles.timelineItem}>
              <span className={styles.timelineNumber}>{index + 1}</span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      </Container>

      <section className={styles.cards}>
        {principles.map((principle) => (
          <Container key={principle.title} as="article" title={principle.title}>
            <p className={styles.paragraph}>{principle.description}</p>
          </Container>
        ))}
      </section>

      <Container
        title="An AI web app for Malaysia's healthcare future"
        description="Legacy Bridge exploring how these goals could be achieved through practical record digitisation and review."
      >
        <ul className={styles.goals}>
          {nationalGoals.map((goal) => (
            <li key={goal} className={styles.goal}>{goal}</li>
          ))}
        </ul>
      </Container>
      <Container title="Technical note">
        <p className={styles.paragraph}>
          For technical readers, Legacy Bridge is shaped as a frontend workflow for
          clinical data preparation. It separates source upload, extracted context,
          editable clinical findings, user confirmation, record ownership, audit
          visibility, and admin monitoring. Future backend work can connect these
          steps to OCR services, AI extraction, secure storage, access control, and
          standards-based health data exchange.
        </p>
      </Container>

      <Container title="Future developments">
        <p className={styles.paragraph}>
          The current frontend is structured so future backend services can be added
          without changing the user workflow.
        </p>
        <ol className={styles.timeline}>
          {futureDevelopments.map((item, index) => (
            <li key={item.title} className={styles.timelineItem}>
              <span className={styles.timelineNumber}>{index + 1}</span>
              <span>
                <strong className={styles.futureTitle}>{item.title}</strong>
                <span className={styles.futureDescription}>{item.description}</span>
              </span>
            </li>
          ))}
        </ol>
      </Container>
      <Container title="Programming languages, frameworks and AI">
        <p className={styles.paragraph}>
          Legacy Bridge is built with React, Next.js, and Tailwind CSS. The code is
          written in JavaScript and TypeScript, following modern web development practices.
        </p>
        <div className={styles.techGrid}>
          {technologyStack.map((item) => (
            <article key={item.name} className={styles.techCard}>
              <Image
                src={item.icon}
                alt={`${item.name} icon`}
                width={48}
                height={48}
                className={styles.techIcon}
              />
              <div>
                <h3 className={styles.techName}>{item.name}</h3>
                <p className={styles.techType}>{item.type}</p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </>
  );
}

const styles = {
  emrPanel: "grid gap-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-transform duration-300 hover:scale-[1.02] md:p-6",
  emrEyebrow: "text-xs font-semibold uppercase tracking-wide text-teal-700",
  emrTitle: "mt-2 text-2xl font-semibold text-slate-950 md:text-3xl",
  emrText: "mt-3 max-w-3xl text-sm leading-6 text-slate-600 md:text-base",
  emrHighlights: "grid gap-3 md:grid-cols-3",
  emrHighlight: "rounded-lg border border-slate-200 bg-slate-50 p-4 shadow-sm",
  emrHighlightTitle: "text-lg font-semibold text-teal-800",
  emrHighlightText: "mt-2 text-sm leading-6 text-slate-600",
  emrSource: "text-sm font-medium text-teal-800 underline underline-offset-4 transition hover:text-teal-950",  grid: "grid gap-4 md:grid-cols-2",
  paragraph: "mt-3 text-sm leading-6 text-slate-600 md:text-base",
  timeline: "mt-5 grid gap-3",
  timelineItem: "flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700",
  timelineNumber: "flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-teal-700 text-xs font-bold text-white",
  cards: "grid gap-4 md:grid-cols-3",
  goals: "mt-5 grid gap-3",
  goal: "rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700",
  techGrid: "mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
  techCard:
    "flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4",
  techIcon:
    "h-12 w-12 shrink-0 rounded-md border border-slate-200 bg-white object-contain p-2",
  techName: "text-sm font-semibold text-slate-950",
  techType: "mt-1 text-xs font-medium text-slate-500",
  futureTitle: "block text-sm font-semibold text-slate-950",
  futureDescription: "mt-1 block text-sm leading-6 text-slate-600",
};
