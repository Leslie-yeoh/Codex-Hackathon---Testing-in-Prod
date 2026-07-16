import { globalStyles } from "../../styles/global.style";

export default function ToggleRow({ checked, description, label, onChange }) {
  return (
    <label className={styles.toggleRow}>
      <span>
        <span className={styles.title}>{label}</span>
        {description && <span className={styles.description}>{description}</span>}
      </span>
      <input
        type="checkbox"
        className={globalStyles.checkbox}
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
    </label>
  );
}

const styles = {
  toggleRow:
    "flex items-start justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3 text-sm font-medium text-slate-700",
  title: "block text-sm font-semibold text-slate-800",
  description: "mt-1 block text-sm font-normal leading-5 text-slate-500",
};
