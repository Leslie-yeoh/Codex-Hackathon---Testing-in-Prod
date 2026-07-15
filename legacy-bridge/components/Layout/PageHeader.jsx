import { globalStyles } from "../../styles/global.style";

export default function PageHeader({ title, description }) {
  return (
    <section className={globalStyles.pageHeader}>
      <h1 className={globalStyles.pageTitle}>{title}</h1>
      {description && (
        <p className={globalStyles.pageDescription}>{description}</p>
      )}
    </section>
  );
}
