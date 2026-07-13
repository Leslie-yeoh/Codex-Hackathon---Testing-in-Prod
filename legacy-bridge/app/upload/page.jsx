import { globalStyles } from "../../styles/global.style";

export default function UploadPage() {
  return (
    <main className={globalStyles.page}>
      <section className={globalStyles.pageHeader}>
        <p className={globalStyles.eyebrow}>Interactive Workspace</p>
        <h1 className={globalStyles.pageTitle}>Scan New Prescription</h1>
        <p className={globalStyles.pageDescription}>
          Upload or capture a prescription image, then review extracted medicine details before approval.
        </p>
      </section>
    </main>
  );
}
