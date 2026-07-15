import AdminSettingsContent from "./components/AdminSettingsContent";
import AppShell from "../../../components/Layout/AppShell";
import PageHeader from "../../../components/Layout/PageHeader";

export default function AdminSettingsPage() {
  return (
    <AppShell>
      <PageHeader title="System Settings" />
      <AdminSettingsContent />
    </AppShell>
  );
}
