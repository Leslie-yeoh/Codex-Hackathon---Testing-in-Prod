"use client";

import Container from "../../../components/Container/Container";
import { globalStyles } from "../../../styles/global.style";
import useDashboardOverview from "../hooks/useDashboardOverview";

const cn = (...classes) => classes.filter(Boolean).join(" ");

export default function DashboardContent() {
  const {
    kpis,
    moduleHealth,
    systemConditions,
    weeklyVolume,
  } = useDashboardOverview();
  const maxWeeklyVolume = Math.max(
    ...weeklyVolume.map((item) => item.records),
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
        <Container title="Weekly Processing Volume">
          <div className={styles.chart}>
            {weeklyVolume.map((item) => (
              <div key={item.day} className={styles.barItem}>
                <div className={styles.barTrack}>
                  <div
                    className={styles.barFill}
                    style={{
                      height: `${Math.max(
                        (item.records / maxWeeklyVolume) * 100,
                        8
                      )}%`,
                    }}
                  />
                </div>
                <span className={styles.barValue}>{item.records}</span>
                <span className={styles.barLabel}>{item.day}</span>
              </div>
            ))}
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
  chart: "mt-5 flex h-64 items-end gap-3",
  barItem: "flex flex-1 flex-col items-center gap-2",
  barTrack:
    "flex h-44 w-full items-end rounded-md bg-slate-100 px-2 py-2 sm:px-3",
  barFill: "w-full rounded-md bg-teal-700 transition-all",
  barValue: "text-sm font-semibold text-slate-950",
  barLabel: "text-xs font-medium text-slate-500",
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
