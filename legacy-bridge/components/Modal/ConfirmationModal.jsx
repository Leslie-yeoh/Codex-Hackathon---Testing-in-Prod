"use client";

import Button from "../Button/Button";

export default function ConfirmationModal({
  cancelLabel = "Cancel",
  confirmLabel = "Confirm",
  description,
  isOpen,
  onCancel,
  onConfirm,
  title,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.overlay} role="presentation">
      <button
        type="button"
        className={styles.backdrop}
        aria-label="Close confirmation modal"
        onClick={onCancel}
      />
      <section
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-title"
      >
        <div className={styles.content}>
          <h2 id="confirmation-title" className={styles.title}>
            {title}
          </h2>
          {description && <p className={styles.description}>{description}</p>}
        </div>

        <div className={styles.actions}>
          <Button type="button" variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button type="button" variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </section>
    </div>
  );
}

const styles = {
  overlay:
    "fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4",
  backdrop: "absolute inset-0 h-full w-full bg-slate-950/45",
  panel:
    "relative w-full rounded-t-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:max-w-md sm:rounded-lg",
  content: "grid gap-2",
  title: "text-xl font-semibold text-slate-950",
  description: "text-sm leading-6 text-slate-600",
  actions: "mt-5 grid grid-cols-2 gap-3",
};
