"use client";

import { useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Button from "../../../../components/Button/Button";
import { decodeSharedRecord } from "../../utils/shareRecord.utils";
import styles from "./sharedRecord.style";

export default function SharedRecordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("record");
  const shouldPrint = searchParams.get("print") === "1";
  const record = useMemo(() => decodeSharedRecord(token), [token]);

  useEffect(() => {
    if (record && shouldPrint) {
      window.setTimeout(() => window.print(), 250);
    }
  }, [record, shouldPrint]);

  if (!record) {
    return (
      <main className={styles.page}>
        <section className={styles.card}>
          <h1 className={styles.title}>Shared record unavailable</h1>
          <p className={styles.text}>
            The link is incomplete or no longer contains readable record details.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <div className={styles.header}>
          <div>
            <p className={styles.label}>Shared Clinical Record</p>
            <h1 className={styles.title}>{record.id}</h1>
          </div>
          <Button
            type="button"
            variant="secondary"
            className={styles.printButton}
            onClick={() => window.print()}
          >
            Download PDF
          </Button>
        </div>

        <div className={styles.detailGrid}>
          <DetailItem label="Patient Reference" value={record.patientId} />
          <DetailItem label="Total Findings" value={String(getFindings(record).length)} />
          <DetailItem label="Confirmed At" value={record.confirmedAt} />
        </div>
        <RecordContext context={record.context} />
        <FindingsTable findings={getFindings(record)} />
      </section>
    </main>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className={styles.detailItem}>
      <span className={styles.detailLabel}>{label}</span>
      <strong className={styles.detailValue}>{value}</strong>
    </div>
  );
}

function RecordContext({ context }) {
  return (
    <section className={styles.contextPanel}>
      <h2 className={styles.contextTitle}>Document Context</h2>
      {context ? (
        <div
          className={styles.contextBody}
          dangerouslySetInnerHTML={{ __html: context }}
        />
      ) : (
        <p className={styles.text}>Context was not included in this shared record.</p>
      )}
    </section>
  );
}

function FindingsTable({ findings }) {
  return (
    <div className={styles.findingsTableWrap}>
      <table className={styles.findingsTable}>
        <thead>
          <tr>
            <th className={styles.findingsHeadCell}>Observation</th>
            <th className={styles.findingsHeadCell}>Value</th>
            <th className={styles.findingsHeadCell}>Unit</th>
          </tr>
        </thead>
        <tbody>
          {findings.map((finding, index) => (
            <tr key={`${finding.observation}-${index}`}>
              <td className={styles.findingsCell}>{finding.observation}</td>
              <td className={styles.findingsCell}>{finding.value}</td>
              <td className={styles.findingsCell}>{finding.unit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function getFindings(record) {
  if (Array.isArray(record.findings) && record.findings.length > 0) {
    return record.findings;
  }

  return [
    {
      observation: record.observation || "",
      value: record.value || "",
      unit: "",
    },
  ];
}
