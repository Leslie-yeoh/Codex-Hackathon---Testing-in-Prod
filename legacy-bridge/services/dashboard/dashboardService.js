import { apiClient } from "../api/apiClient";

const getPayloadData = (payload) => payload?.data ?? payload;

const normalizeDashboardPayload = (payload) => {
  const data = getPayloadData(payload);

  return {
    activity: data?.activity ?? [],
    kpis: data?.kpis ?? [],
    moduleHealth: data?.moduleHealth ?? data?.module_health ?? [],
    systemConditions:
      data?.systemConditions ?? data?.system_conditions ?? [],
    weeklyVolume:
      data?.weeklyVolume ?? data?.weekly_volume ?? [],
  };
};

class DashboardService {
  static async fetchDashboardOverview({ signal } = {}) {
    return normalizeDashboardPayload({
      weeklyVolume: await apiClient("/dashboard/weekly-volume", { signal }),
    });
  }
}

export const fetchDashboardOverview = (options) =>
  DashboardService.fetchDashboardOverview(options);

export default DashboardService;