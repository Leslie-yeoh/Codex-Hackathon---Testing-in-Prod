"use client";

import DashboardContent from "../dashboard/components/DashboardContent";
import RecentActivityContent from "../dashboard/components/RecentActivityContent";
import AppShell from "../../components/Layout/AppShell";
import PageHeader from "../../components/Layout/PageHeader";
import LogsContent from "../logs/components/LogsContent";
import Tabs from "../../components/Tabs/Tabs";
import AdminSettingsContent from "./settings/components/AdminSettingsContent";
import AdminUsersContent from "./users/components/AdminUsersContent";
import { ADMIN_TABS } from "./constants";

const contentMap = {
  dashboard: <DashboardContent />,
  users: <AdminUsersContent />,
  settings: <AdminSettingsContent />,
  audit: <LogsContent />,
  recent: <RecentActivityContent />,
};

export default function AdminPage() {
  const tabs = ADMIN_TABS.map((tab) => ({
    ...tab,
    content: contentMap[tab.key],
  }));

  return (
    <AppShell>
      <PageHeader title="Admin Panel" />
      <Tabs tabs={tabs} ariaLabel="Admin panel sections" />
    </AppShell>
  );
}
