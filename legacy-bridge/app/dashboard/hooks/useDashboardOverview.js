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

  useEffect(() => {
    const controller = new AbortController();

    fetchDashboardOverview({ signal: controller.signal })
      .then(setOverview)
      .catch((error) => {
        if (error.name !== "AbortError") {
          setOverview(initialOverview);
        }
      });

    return () => controller.abort();
  }, []);

  return overview;
}
