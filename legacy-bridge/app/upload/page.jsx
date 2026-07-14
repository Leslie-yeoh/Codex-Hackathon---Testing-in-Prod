import AppShell from "../../components/Layout/AppShell";
import PageHeader from "../../components/Layout/PageHeader";
import UploadWorkspace from "../../components/Upload/UploadWorkspace";

export default function UploadPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Interactive Workspace"
        title="Scan New Prescription"
        description="Upload or capture a prescription image, then review extracted medicine details before approval."
      />
      <UploadWorkspace />
    </AppShell>
  );
}
