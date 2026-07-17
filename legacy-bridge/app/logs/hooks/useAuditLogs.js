"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchAuditLogs } from "../../../services/auditLog/auditLogService";

export default function useAuditLogs() {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All");

  useEffect(() => {
    const controller = new AbortController();

    fetchAuditLogs({ signal: controller.signal })
      .then(setLogs)
      .catch((error) => {
        if (error.name !== "AbortError") {
          setLogs([]);
        }
      })
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, []);

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

  return {
    filteredLogs,
    isLoading,
    query,
    setQuery,
    setType,
    type,
  };
}
