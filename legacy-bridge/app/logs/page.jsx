import AppShell from "../../components/Layout/AppShell";
import LogsContent from "../../components/Logs/LogsContent";
import PageHeader from "../../components/Layout/PageHeader";

export default function LogsPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Audit Log"
        title="Prescription History"
        description="Track AI extraction, manual edits, approvals, and flagged prescription events."
      />
      <LogsContent />
    </AppShell>
  );
}
