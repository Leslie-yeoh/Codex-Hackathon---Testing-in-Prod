"use client";

import Container from "../../../components/Container/Container";
import { LOG_TYPE_OPTIONS } from "../constants";
import useAuditLogs from "../hooks/useAuditLogs";
import styles from "../logs.style";
import { globalStyles } from "../../../styles/global.style";

const cn = (...classes) => classes.filter(Boolean).join(" ");

export default function LogsContent() {
  const { filteredLogs, isLoading, query, setQuery, setType, type } = useAuditLogs();

  return (
    <Container title="Audit Timeline">
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
          {LOG_TYPE_OPTIONS.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className={styles.emptyState} role="status">Loading audit logs...</div>
      ) : filteredLogs.length === 0 ? (
        <div className={styles.emptyState}>No audit logs match the current filters.</div>
      ) : (
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
      )}
    </Container>
  );
}
