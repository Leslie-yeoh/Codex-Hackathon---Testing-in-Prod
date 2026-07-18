"use client";

import { useEffect, useState } from "react";
import { fetchDashboardOverview } from "../../../services/dashboard/dashboardService";

const initialOverview = {
  activity: [],
  kpis: [],
  moduleHealth: [],
  systemConditions: [],
  weeklyVolume: [],
};

export default function useDashboardOverview() {
  const [overview, setOverview] = useState(initialOverview);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    fetchDashboardOverview({ signal: controller.signal })
      .then(setOverview)
      .catch((error) => {
        if (error.name !== "AbortError") {
          setOverview(initialOverview);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  return { ...overview, isLoading };
}
