"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  demoDashboardRecord,
  initialDashboardRecords,
} from "../../constants/mock/dashboard.mock";
import { globalStyles } from "../../styles/global.style";

const cn = (...classes) => classes.filter(Boolean).join(" ");

export default function DashboardContent() {
  const [records, setRecords] = useState(initialDashboardRecords);
  const [selectedId, setSelectedId] = useState(initialDashboardRecords[0].id);

  const selectedRecord = records.find((record) => record.id === selectedId);
  const validatedCount = records.filter((record) => record.status === "Validated").length;
  const pendingCount = records.filter((record) => record.status === "Needs Review").length;
  const accuracyRate = useMemo(
    () => Math.round((validatedCount / records.length) * 1000) / 10,
    [records.length, validatedCount]
  );

  const addDemoRecord = () => {
    const nextNumber = String(records.length + 1).padStart(3, "0");
    const newRecord = {
      ...demoDashboardRecord,
      id: `RX-240714-${nextNumber}`,
    };

    setRecords((current) => [newRecord, ...current]);
    setSelectedId(newRecord.id);
  };

  const updateStatus = (id, status) => {
    setRecords((current) =>
      current.map((record) =>
        record.id === id
          ? { ...record, status, reviewer: "Dr. Sarah Tan", updated: "Now" }
          : record
      )
    );
  };

  return (
    <>
      <section className={globalStyles.statsGrid}>
        <StatCard label="Records Processed Today" value={records.length} />
        <StatCard label="FHIR Valid Payloads" value={`${accuracyRate}%`} />
        <StatCard label="Pending Review" value={pendingCount} />
      </section>

      <section className={globalStyles.section}>
        <div className={globalStyles.sectionHeader}>
          <div>
            <h2 className={globalStyles.sectionTitle}>Review Queue</h2>
            <p className={globalStyles.sectionDescription}>
              Add a demo extraction, inspect a record, then change its review status.
            </p>
          </div>
          <div className={styles.actions}>
            <button
              type="button"
              className={cn(globalStyles.buttonBase, globalStyles.secondaryButton)}
              onClick={addDemoRecord}
            >
              Add mock record
            </button>
            <Link
              href="/upload"
              className={cn(globalStyles.buttonBase, globalStyles.primaryButton)}
            >
              New extraction
            </Link>
          </div>
        </div>

        <div className={styles.grid}>
          <div className={globalStyles.tableWrap}>
            <div className={globalStyles.tableScroll}>
              <table className={globalStyles.table}>
                <thead className={globalStyles.tableHead}>
                  <tr>
                    <th className={globalStyles.tableHeadCell}>Record</th>
                    <th className={globalStyles.tableHeadCell}>Patient</th>
                    <th className={globalStyles.tableHeadCell}>Status</th>
                    <th className={globalStyles.tableHeadCell}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr key={record.id} className={globalStyles.tableRow}>
                      <td className={globalStyles.tableCell}>{record.id}</td>
                      <td className={globalStyles.tableCell}>{record.patient}</td>
                      <td className={globalStyles.tableCell}>
                        <StatusBadge status={record.status} />
                      </td>
                      <td className={globalStyles.tableCell}>
                        <button
                          type="button"
                          className={styles.textButton}
                          onClick={() => setSelectedId(record.id)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {selectedRecord && (
            <aside className={styles.detailPanel}>
              <p className={globalStyles.eyebrow}>Selected Record</p>
              <h3 className={styles.detailTitle}>{selectedRecord.id}</h3>
              <dl className={styles.detailList}>
                <DetailItem label="Source" value={selectedRecord.source} />
                <DetailItem label="FHIR Resource" value={selectedRecord.resource} />
                <DetailItem label="Reviewer" value={selectedRecord.reviewer} />
                <DetailItem label="Updated" value={selectedRecord.updated} />
              </dl>
              <div className={styles.actions}>
                <button
                  type="button"
                  className={cn(globalStyles.buttonBase, globalStyles.successButton)}
                  onClick={() => updateStatus(selectedRecord.id, "Validated")}
                >
                  Mark valid
                </button>
                <button
                  type="button"
                  className={cn(globalStyles.buttonBase, globalStyles.dangerButton)}
                  onClick={() => updateStatus(selectedRecord.id, "Flagged")}
                >
                  Flag issue
                </button>
              </div>
            </aside>
          )}
        </div>
      </section>
    </>
  );
}

function StatCard({ label, value }) {
  return (
    <div className={globalStyles.statCard}>
      <p className={globalStyles.statLabel}>{label}</p>
      <p className={globalStyles.statValue}>{value}</p>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div>
      <dt className={styles.detailLabel}>{label}</dt>
      <dd className={styles.detailValue}>{value}</dd>
    </div>
  );
}

function StatusBadge({ status }) {
  const statusClass = {
    "Needs Review": globalStyles.badgePending,
    Validated: globalStyles.badgeVerified,
    Flagged: globalStyles.badgeFlagged,
  }[status];

  return <span className={cn(globalStyles.badge, statusClass)}>{status}</span>;
}

const styles = {
  actions: "flex flex-col gap-2 sm:flex-row",
  grid: "mt-5 grid gap-4 lg:grid-cols-[1fr_320px]",
  detailPanel: "rounded-lg border border-slate-200 bg-slate-50 p-4",
  detailTitle: "mt-1 text-lg font-semibold text-slate-950",
  detailList: "my-4 grid gap-3 text-sm",
  detailLabel: "font-medium text-slate-500",
  detailValue: "mt-1 text-slate-900",
  textButton: "font-semibold text-teal-700 transition hover:text-teal-900",
};
