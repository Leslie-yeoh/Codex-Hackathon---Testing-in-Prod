import {
  DASHBOARD_ACTIVITY,
  DASHBOARD_KPIS,
  DASHBOARD_MODULE_HEALTH,
  DASHBOARD_SYSTEM_CONDITIONS,
  DASHBOARD_WEEKLY_VOLUME,
} from "../../constants/mock/dashboard.mock";
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

const normalizeDashboardPayload = (payload) => {
  const data = getPayloadData(payload);

  return {
    activity: data?.activity ?? DASHBOARD_ACTIVITY,
    kpis: data?.kpis ?? DASHBOARD_KPIS,
    moduleHealth: data?.moduleHealth ?? data?.module_health ?? DASHBOARD_MODULE_HEALTH,
    systemConditions:
      data?.systemConditions ??
      data?.system_conditions ??
      DASHBOARD_SYSTEM_CONDITIONS,
    weeklyVolume:
      data?.weeklyVolume ?? data?.weekly_volume ?? DASHBOARD_WEEKLY_VOLUME,
  };
};

class DashboardService {
  static async fetchDashboardOverview({ signal } = {}) {
    if (USE_MOCK) {
      return waitForMock(normalizeDashboardPayload({}), signal);
    }

    return normalizeDashboardPayload(
      await apiClient("/api/dashboard/overview", { signal })
    );
  }
}

export const fetchDashboardOverview = (options) =>
  DashboardService.fetchDashboardOverview(options);

export default DashboardService;
