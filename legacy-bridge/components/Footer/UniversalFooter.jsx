export default function UniversalFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.message}>
          Project Legacy Bridge. Codex Community Hackathon Kuala Lumpur 2026.
        </p>
      </div>
    </footer>
  );
}

const styles = {
  footer: "border-t border-slate-200 bg-white text-slate-700",
  inner:
    "mx-auto flex w-full max-w-7xl items-center justify-center px-4 py-4 text-center sm:px-6 md:px-8",
  message: "text-sm font-medium leading-6 text-slate-600",
};
