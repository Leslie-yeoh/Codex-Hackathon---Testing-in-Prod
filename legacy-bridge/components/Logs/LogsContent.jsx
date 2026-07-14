"use client";

import { useMemo, useState } from "react";
import { demoAuditLog, initialAuditLogs } from "../../constants/mock/logs.mock";
import { globalStyles } from "../../styles/global.style";

const cn = (...classes) => classes.filter(Boolean).join(" ");

export default function LogsContent() {
  const [logs, setLogs] = useState(initialAuditLogs);
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All");

  const filteredLogs = useMemo(
    () =>
      logs.filter((log) => {
        const matchesQuery = `${log.operator} ${log.id} ${log.description}`
          .toLowerCase()
          .includes(query.toLowerCase());
        const matchesType = type === "All" || log.type === type;
        return matchesQuery && matchesType;
      }),
    [logs, query, type]
  );

  const addLog = () => {
    const nextLog = {
      ...demoAuditLog,
      id: `LOG-${String(logs.length + 1).padStart(3, "0")}`,
    };

    setLogs((current) => [nextLog, ...current]);
  };

  return (
    <section className={globalStyles.section}>
      <div className={globalStyles.sectionHeader}>
        <div>
          <h2 className={globalStyles.sectionTitle}>Audit Timeline</h2>
          <p className={globalStyles.sectionDescription}>
            Search, filter, add, and view traceable actions for the extraction workflow.
          </p>
        </div>
        <button
          type="button"
          className={cn(globalStyles.buttonBase, globalStyles.secondaryButton)}
          onClick={addLog}
        >
          Add demo log
        </button>
      </div>

      <div className={styles.filters}>
        <input
          className={globalStyles.searchInput}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search operator, log ID, or action"
        />
        <select
          className={styles.select}
          value={type}
          onChange={(event) => setType(event.target.value)}
        >
          <option>All</option>
          <option>AI_Extraction</option>
          <option>Manual_Edit</option>
          <option>Final_Approval</option>
        </select>
      </div>

      <div className={globalStyles.tableWrap}>
        <div className={globalStyles.tableScroll}>
          <table className={globalStyles.table}>
            <thead className={globalStyles.tableHead}>
              <tr>
                <th className={globalStyles.tableHeadCell}>Timestamp</th>
                <th className={globalStyles.tableHeadCell}>Operator</th>
                <th className={globalStyles.tableHeadCell}>Type</th>
                <th className={globalStyles.tableHeadCell}>Description</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} className={globalStyles.tableRow}>
                  <td className={globalStyles.tableCell}>{log.time}</td>
                  <td className={globalStyles.tableCell}>{log.operator}</td>
                  <td className={globalStyles.tableCell}>
                    <span className={cn(globalStyles.badge, styles.typeBadge)}>
                      {log.type}
                    </span>
                  </td>
                  <td className={globalStyles.tableCell}>{log.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

const styles = {
  filters: "my-5 flex flex-col gap-3 md:flex-row md:items-center",
  select: "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 md:w-56",
  typeBadge: "bg-slate-100 text-slate-700",
};
