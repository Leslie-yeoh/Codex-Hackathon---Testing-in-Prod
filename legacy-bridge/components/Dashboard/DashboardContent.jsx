"use client";

import Container from "../Container/Container";
import { globalStyles } from "../../styles/global.style";
import useDashboardOverview from "../../app/dashboard/hooks/useDashboardOverview";

const cn = (...classes) => classes.filter(Boolean).join(" ");
const emptyWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function DashboardContent() {
  const {
    isLoading,
    kpis,
    moduleHealth,
    systemConditions,
    weeklyVolume,
  } = useDashboardOverview();
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const hasWeeklyVolume = weeklyVolume.length > 0;
  const chartVolume = hasWeeklyVolume
    ? weeklyVolume
    : emptyWeek.map((day) => ({ day, records: 0 }));
  const maxWeeklyVolume = Math.max(
    ...chartVolume.map((item) => item.records),
    1
  );

  return (
    <div className={styles.contentStack}>
      <section className={globalStyles.statsGrid}>
        {kpis.map((item) => (
          <StatCard key={item.label} label={item.label} value={item.value} />
        ))}
      </section>

      <section className={styles.grid}>
        <Container title="Weekly Processing Volume" className="flex flex-col">
          <div className={styles.chart}>
            <div className={styles.yAxis} aria-hidden="true">
              <span>{maxWeeklyVolume}</span>
              <span>0</span>
            </div>
            <div className={styles.chartContent}>
              <div className={styles.chartPlot}>
                {chartVolume.map((item, index) => (
                  <div key={`${item.day}-${index}`} className={styles.barItem}>
                    <span className={styles.barValue}>{item.records}</span>
                    <div className={styles.barTrack}>
                      <div
                        className={styles.barFill}
                        style={{
                          height: `${(item.records / maxWeeklyVolume) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
                {!hasWeeklyVolume && (
                  <p className={styles.emptyChart}>No OCR processing data yet</p>
                )}
              </div>
              <div className={styles.xAxis}>
                {chartVolume.map((item, index) => (
                  <span key={`${item.day}-${index}`} className={styles.barLabel}>
                    {item.day}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Container>

        <Container title="System Health">
          <div className={styles.healthList}>
            {moduleHealth.map((item) => (
              <div key={item.name} className={styles.healthItem}>
                <div>
                  <p className={styles.healthTitle}>{item.name}</p>
                  <p className={styles.healthMeta}>{item.detail}</p>
                </div>
                <span
                  className={cn(
                    globalStyles.badge,
                    item.status === "Healthy"
                      ? globalStyles.badgeVerified
                      : globalStyles.badgePending
                  )}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <Container title="System Condition">
        <div className={styles.conditionGrid}>
          {systemConditions.map((item) => (
            <div key={item.label} className={styles.conditionCard}>
              <div className={styles.conditionHeader}>
                <p className={styles.conditionLabel}>{item.label}</p>
                <span className={cn(globalStyles.badge, globalStyles.badgeVerified)}>
                  {item.status}
                </span>
              </div>
              <p className={styles.conditionValue}>{item.value}</p>
              <p className={styles.conditionDetail}>{item.detail}</p>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className={styles.contentStack} role="status" aria-busy="true">
      <span className="sr-only">Loading dashboard data...</span>
      <section className={globalStyles.statsGrid}>
        {[0, 1, 2].map((index) => (
          <div key={index} className="h-28 animate-pulse rounded-lg bg-slate-200" />
        ))}
      </section>
      <section className={styles.grid}>
        <Container title="Weekly Processing Volume" className="flex flex-col">
          <div className="mt-5 h-96 animate-pulse rounded-lg bg-slate-200" />
        </Container>
        <Container title="System Health">
          <div className="mt-5 grid gap-3">
            {[0, 1, 2].map((index) => (
              <div key={index} className="h-20 animate-pulse rounded-lg bg-slate-200" />
            ))}
          </div>
        </Container>
      </section>
      <Container title="System Condition">
        <div className="grid gap-3 md:grid-cols-3">
          {[0, 1, 2].map((index) => (
            <div key={index} className="h-36 animate-pulse rounded-lg bg-slate-200" />
          ))}
        </div>
      </Container>
    </div>
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

const styles = {
  contentStack: "grid gap-4 md:gap-5",
  grid: "grid gap-4 lg:grid-cols-[1.4fr_1fr]",
  chart: "mt-5 flex min-h-100 flex-1 items-center justify-center gap-2",
  yAxis: "flex h-80 flex-col justify-between text-xs font-medium text-slate-500",
  chartContent: "min-w-0 flex-1",
  chartPlot:
    "relative flex h-72 items-end gap-3 border-b border-l border-slate-300 px-3 pt-2",
  xAxis: "flex gap-3 pl-3 pt-2",
  barItem: "flex h-full flex-1 flex-col items-center justify-end",
  barTrack: "flex h-full w-full items-end",
  barFill: "w-full rounded-t-md bg-teal-700 transition-all",
  barValue: "mb-1 text-sm font-semibold text-slate-950",
  barLabel: "flex-1 text-center text-xs font-medium text-slate-500",
  emptyChart:
    "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded bg-white/90 px-2 py-1 text-sm text-slate-500",
  healthList: "mt-5 grid gap-3",
  healthItem:
    "flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4",
  healthTitle: "text-sm font-semibold text-slate-950",
  healthMeta: "mt-1 text-sm text-slate-600",
  conditionGrid: "grid gap-3 md:grid-cols-3",
  conditionCard: "rounded-lg border border-slate-200 bg-white p-4 shadow-sm",
  conditionHeader: "flex items-start justify-between gap-3",
  conditionLabel: "text-sm font-semibold text-slate-600",
  conditionValue: "mt-3 text-3xl font-bold text-slate-950",
  conditionDetail: "mt-2 text-sm leading-6 text-slate-600",
};
