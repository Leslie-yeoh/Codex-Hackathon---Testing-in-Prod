import DashboardContent from "../../components/Dashboard/DashboardContent";
import AppShell from "../../components/Layout/AppShell";
import PageHeader from "../../components/Layout/PageHeader";

export default function DashboardPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Dashboard"
        title="Admin Dashboard"
      />
      <DashboardContent />
    </AppShell>
  );
}
