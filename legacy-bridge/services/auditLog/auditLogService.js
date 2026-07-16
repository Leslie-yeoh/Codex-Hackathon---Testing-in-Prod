import { initialAuditLogs } from "../../constants/mock/logs.mock";
import { apiClient } from "../api/apiClient";
import ServiceConfigService from "../config/serviceConfigService";

const USE_MOCK = ServiceConfigService.shouldDisplayMockActions();
const MOCK_DELAY = 300;

const waitForMock = (value, signal) =>
  new Promise((resolve, reject) => {
    if (signal?.aborted) {
      const abortError = new Error("Request aborted");
      abortError.name = "AbortError";
      reject(abortError);
      return;
    }

    const timer = window.setTimeout(() => resolve(value), MOCK_DELAY);

    signal?.addEventListener(
      "abort",
      () => {
        window.clearTimeout(timer);
        const abortError = new Error("Request aborted");
        abortError.name = "AbortError";
        reject(abortError);
      },
      { once: true }
    );
  });

const getPayloadData = (payload) => payload?.data ?? payload;

const normalizeAuditLog = (log) => ({
  ...log,
  id: String(log?.id ?? log?.log_id ?? ""),
  time: log?.time ?? log?.created_at ?? "",
  operator: log?.operator ?? log?.actor_name ?? "System",
  type: log?.type ?? log?.event_type ?? "Activity",
  description: log?.description ?? log?.message ?? "",
});

const normalizeAuditLogList = (payload) => {
  const data = getPayloadData(payload);
  const logs = Array.isArray(data) ? data : data?.items ?? payload?.items ?? [];

  return logs.map(normalizeAuditLog);
};

class AuditLogService {
  static async fetchAuditLogs({ signal } = {}) {
    if (USE_MOCK) {
      return waitForMock(initialAuditLogs.map(normalizeAuditLog), signal);
    }

    return normalizeAuditLogList(await apiClient("/api/audit-logs", { signal }));
  }
}

export const fetchAuditLogs = (options) =>
  AuditLogService.fetchAuditLogs(options);

export default AuditLogService;
