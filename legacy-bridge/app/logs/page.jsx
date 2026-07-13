import { globalStyles } from "../../styles/global.style";

export default function LogsPage() {
  return (
    <main className={globalStyles.page}>
      <section className={globalStyles.pageHeader}>
        <p className={globalStyles.eyebrow}>Audit Log</p>
        <h1 className={globalStyles.pageTitle}>Prescription History</h1>
        <p className={globalStyles.pageDescription}>
          Track AI extraction, manual edits, approvals, and flagged prescription events.
        </p>
      </section>
    </main>
  );
}
