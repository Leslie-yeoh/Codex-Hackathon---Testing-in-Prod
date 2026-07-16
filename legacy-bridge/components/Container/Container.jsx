import { globalStyles } from "../../styles/global.style";

const cn = (...classes) => classes.filter(Boolean).join(" ");

export default function Container({
  actions,
  as: Element = "section",
  children,
  className = "",
  description,
  title,
}) {
  const hasHeader = title || description || actions;

  return (
    <Element className={cn(globalStyles.section, className)}>
      {hasHeader && (
        <div className={globalStyles.sectionHeader}>
          <div>
            {title && <h2 className={globalStyles.sectionTitle}>{title}</h2>}
            {description && (
              <p className={globalStyles.sectionDescription}>{description}</p>
            )}
          </div>
          {actions}
        </div>
      )}
      {children}
    </Element>
  );
}
