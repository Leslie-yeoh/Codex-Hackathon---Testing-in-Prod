import { globalStyles } from "../../styles/global.style";

export default function PageHeader({ eyebrow, title, description }) {
  return (
    <section className={globalStyles.pageHeader}>
      <p className={globalStyles.eyebrow}>{eyebrow}</p>
      <h1 className={globalStyles.pageTitle}>{title}</h1>
      <p className={globalStyles.pageDescription}>{description}</p>
    </section>
  );
}
