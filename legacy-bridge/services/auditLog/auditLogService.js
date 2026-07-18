import { apiClient } from "../api/apiClient";

const getPayloadData = (payload) => payload?.data ?? payload;

const normalizeAuditLog = (log) => ({
  ...log,
  id: String(log?.id ?? log?.log_id ?? ""),
  time: log?.time ?? log?.created_at ?? "",
  operator: log?.operator ?? log?.actor_name ?? "System",
  type: log?.type ?? log?.event_type ?? "Activity",
  description: log?.description ?? log?.message ?? "",
});

class AuditLogService {
  static async fetchAuditLogs({ signal } = {}) {
    const payload = await apiClient("/audit-logs", { signal });
    const data = getPayloadData(payload);
    const logs = Array.isArray(data) ? data : data?.items ?? [];
    return logs.map(normalizeAuditLog);
  }
}

export const fetchAuditLogs = (options) =>
  AuditLogService.fetchAuditLogs(options);

export default AuditLogService;