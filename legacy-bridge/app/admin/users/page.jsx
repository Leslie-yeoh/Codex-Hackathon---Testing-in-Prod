import AdminUsersContent from "./components/AdminUsersContent";
import AppShell from "../../../components/Layout/AppShell";
import PageHeader from "../../../components/Layout/PageHeader";

export default function AdminUsersPage() {
  return (
    <AppShell>
      <PageHeader title="User management" />
      <AdminUsersContent />
    </AppShell>
  );
}
