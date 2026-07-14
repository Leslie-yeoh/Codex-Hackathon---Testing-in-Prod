import DashboardContent from "../../components/Dashboard/DashboardContent";
import AppShell from "../../components/Layout/AppShell";
import PageHeader from "../../components/Layout/PageHeader";

export default function DashboardPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Dashboard"
        title="Legacy-to-Cloud Data Extractor"
        description="Convert scanned charts, handwritten notes, and legacy screenshots into validated FHIR-ready clinical data."
      />
      <DashboardContent />
    </AppShell>
  );
}
