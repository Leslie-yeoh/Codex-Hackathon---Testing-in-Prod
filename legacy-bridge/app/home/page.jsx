import NavigationBar from "../../components/Header/NavigationBar";
import { globalStyles } from "../../styles/global.style";

export default function Home() {
  return (
    <div className={globalStyles.appShell}>
      <NavigationBar />
      <main className={globalStyles.page}>
        <section className={globalStyles.pageHeader}>
          <p className={globalStyles.eyebrow}>Dashboard</p>
          <h1 className={globalStyles.pageTitle}>Legacy-to-Cloud Data Extractor</h1>
          <p className={globalStyles.pageDescription}>
            Convert scanned charts, handwritten notes, and legacy screenshots into
            validated FHIR-ready clinical data.
          </p>
        </section>
      </main>
    </div>
  );
}
