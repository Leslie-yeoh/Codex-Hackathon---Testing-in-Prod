import AppShell from "../../components/Layout/AppShell";
import PageHeader from "../../components/Layout/PageHeader";
import RecordsContent from "./components/RecordsContent";

export default function RecordsPage() {
  return (
    <AppShell>
      <PageHeader title="Records" />
      <RecordsContent />
    </AppShell>
  );
}
