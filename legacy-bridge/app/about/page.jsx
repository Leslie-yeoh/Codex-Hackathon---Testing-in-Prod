import AboutContent from "../../components/About/AboutContent";
import AppShell from "../../components/Layout/AppShell";
import PageHeader from "../../components/Layout/PageHeader";

export default function AboutPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="About"
        title="Why Legacy Bridge exists"
        description="Legacy Bridge is designed for hospital teams that need a practical path from fragmented clinical records to structured, reviewable data."
      />
      <AboutContent />
    </AppShell>
  );
}
