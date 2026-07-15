"use client";

import { X } from "lucide-react";

export default function BottomSheet({ children, isOpen, onClose, title }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.overlay} role="presentation">
      <button
        type="button"
        className={styles.backdrop}
        aria-label="Close filter panel"
        onClick={onClose}
      />
      <section
        className={styles.sheet}
        role="dialog"
        aria-modal="true"
        aria-labelledby="bottom-sheet-title"
      >
        <div className={styles.header}>
          <h2 id="bottom-sheet-title" className={styles.title}>
            {title}
          </h2>
          <button
            type="button"
            className={styles.closeButton}
            aria-label="Close filter panel"
            onClick={onClose}
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}

const styles = {
  overlay: "fixed inset-0 z-50 md:hidden",
  backdrop: "absolute inset-0 h-full w-full bg-slate-950/40",
  sheet:
    "absolute inset-x-0 bottom-0 max-h-[82vh] overflow-y-auto rounded-t-2xl bg-white p-4 shadow-2xl",
  header: "mb-4 flex items-center justify-between gap-3",
  title: "text-lg font-semibold text-slate-950",
  closeButton:
    "inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-50",
};
