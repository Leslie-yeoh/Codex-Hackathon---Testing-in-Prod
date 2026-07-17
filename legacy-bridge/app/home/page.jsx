"use client";

import Link from "next/link";
import Container from "../../components/Container/Container";
import AppShell from "../../components/Layout/AppShell";
import { useAuth } from "../../hooks/globalHooks";
import { globalStyles } from "../../styles/global.style";
import {
  HOME_CAPABILITIES,
  HOME_IMPACT_STATS,
  HOME_READINESS_ITEMS,
  HOME_WORKFLOW_STEPS,
} from "./constants";
import styles from "./home.style";

const cn = (...classes) => classes.filter(Boolean).join(" ");

export default function HomePage() {
  const { isSignedIn } = useAuth();

  return (
    <AppShell>
      {!isSignedIn && (
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <h1 className={styles.heroTitle}>
            Turn paper and old hospital records into clear digital records.
          </h1>
          <p className={styles.heroText}>
            Legacy Bridge helps hospital staff upload scanned notes, prescriptions,
            PDFs, or legacy system screenshots, then review and confirm the extracted
            clinical information before it becomes a saved digital record.
          </p>
          <div className={styles.heroActions}>
            <Link
              href="/login"
              className={cn(globalStyles.buttonBase, globalStyles.primaryButton)}
            >
              Sign in to start
            </Link>
            <Link
              href="/about"
              className={cn(globalStyles.buttonBase, globalStyles.secondaryButton)}
            >
              Learn about Legacy Bridge
            </Link>
          </div>
          <dl className={styles.heroMeta}>
            <div>
              <dt>Primary users</dt>
              <dd>Clinic staff, record officers, reviewers, hospital IT</dd>
            </div>
            <div>
              <dt>Core workflow</dt>
              <dd>Upload, review, confirm, and find records later</dd>
            </div>
          </dl>
        </div>

        <aside className={styles.productPreview} aria-label="Product readiness summary">
          <div className={styles.previewHeader}>
            <div>
              <h2 className={styles.previewTitle}>Clinical bridge workspace</h2>
            </div>
          </div>

          <div className={styles.readinessList}>
            {HOME_READINESS_ITEMS.map((item) => (
              <ReadinessItem key={item.label} label={item.label} value={item.value} />
            ))}
          </div>

          <div className={styles.systemCard}>
            <p className={styles.systemTitle}>System posture</p>
            <p className={styles.systemText}>
              Built for healthcare teams that need readable records, clear ownership,
              and controlled review before information is shared or connected to
              another system.
            </p>
          </div>
        </aside>
      </section>
      )}

      <section className={globalStyles.statsGrid}>
        {HOME_IMPACT_STATS.map((stat) => (
          <div key={stat.label} className={globalStyles.statCard}>
            <p className={globalStyles.statLabel}>{stat.label}</p>
            <p className={globalStyles.statValue}>{stat.value}</p>
          </div>
        ))}
      </section>

      <Container
        className="hover:!scale-100"
        title="How a record moves through Legacy Bridge"
        description="The product flow is written for daily use: upload the source, check what was extracted, correct missing information, confirm the record, then find it again when needed."
      >
        <div className={styles.stepper}>
          {HOME_WORKFLOW_STEPS.map((step, index) => (
            <div key={step} className={styles.stepItem}>
              <div className={styles.stepMarkerWrap}>
                <span className={styles.stepRipple} aria-hidden="true" />
                <span className={styles.stepMarker} />
                {index < HOME_WORKFLOW_STEPS.length - 1 && (
                  <span className={styles.stepConnector} aria-hidden="true" />
                )}
              </div>
              <div className={styles.stepCard}>{step}</div>
            </div>
          ))}
        </div>
      </Container>

      <section className={styles.capabilityGrid}>
        {HOME_CAPABILITIES.map((capability) => (
          <article key={capability.title} className={styles.capabilityCard}>
            <h3 className={styles.cardTitle}>{capability.title}</h3>
            <p className={styles.cardText}>{capability.description}</p>
          </article>
        ))}
      </section>

      <section className={styles.readinessPanel}>
        <div>
          <h2 className={styles.readinessTitle}>Built for hospital-ready data handoff.</h2>
          <p className={globalStyles.sectionDescription}>
            When patient information moves between paper files, older systems, and
            modern platforms, context can be missed. Legacy Bridge keeps the process
            understandable: staff can see the original context, edit extracted details,
            confirm the final record, and return to it from Records.
          </p>
        </div>
        <div className={styles.readinessActions}>
          <Link
            href="/about"
            className={cn(globalStyles.buttonBase, globalStyles.secondaryButton)}
          >
            Read about the project
          </Link>
          <Link href="/about" className={styles.textLink}>
            Review the approach
          </Link>
        </div>
      </section>
    </AppShell>
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
