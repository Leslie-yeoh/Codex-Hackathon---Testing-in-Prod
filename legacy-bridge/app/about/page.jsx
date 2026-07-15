import AboutContent from "../../components/About/AboutContent";
import AppShell from "../../components/Layout/AppShell";
import PageHeader from "../../components/Layout/PageHeader";

export default function AboutPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="About"
        title="About Legacy Bridge"
        description="Legacy Bridge helps healthcare teams convert older clinical records into reviewed digital records that are easier to search, share, and prepare for integration."
      />
      <AboutContent />
    </AppShell>
  );
}
