import { Suspense } from "react";
import SharedRecordContent from "./components/SharedRecordContent";

export default function SharedRecordPage() {
  return (
    <Suspense fallback={<div className={styles.loading}>Loading shared record...</div>}>
      <SharedRecordContent />
    </Suspense>
  );
}

const styles = {
  loading: "min-h-screen bg-slate-50 p-6 text-sm font-medium text-slate-700",
};
