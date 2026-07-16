import AppShell from "../../components/Layout/AppShell";
import LogsContent from "./components/LogsContent";
import PageHeader from "../../components/Layout/PageHeader";

export default function LogsPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Audit Log"
        title="Audit Log"
      />
      <LogsContent />
    </AppShell>
  );
}
