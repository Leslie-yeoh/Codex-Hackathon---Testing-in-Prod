"use client";

import { useMemo, useState } from "react";

export default function Tabs({ tabs, ariaLabel = "Sections", defaultTab }) {
  const initialTab = defaultTab || tabs[0]?.key;
  const [activeTab, setActiveTab] = useState(initialTab);

  const activeContent = useMemo(
    () => tabs.find((tab) => tab.key === activeTab)?.content,
    [activeTab, tabs]
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.stickyBar}>
        <div className={styles.stickyInner}>
          <label className={styles.mobileLabel} htmlFor="tab-mobile-select">
            {ariaLabel}
          </label>
          <select
            id="tab-mobile-select"
            className={styles.mobileSelect}
            value={activeTab}
            onChange={(event) => setActiveTab(event.target.value)}
          >
            {tabs.map((tab) => (
              <option key={tab.key} value={tab.key}>
                {tab.label}
              </option>
            ))}
          </select>

          <div className={styles.tabList} role="tablist" aria-label={ariaLabel}>
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;

              return (
                <button
                  key={tab.key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={isActive ? styles.tabButtonActive : styles.tabButton}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <section role="tabpanel" className={styles.panel}>
        {activeContent}
      </section>
    </div>
  );
}

const styles = {
  wrapper: "grid gap-4",
  stickyBar:
    "sticky top-[73px] z-10 isolate pb-2 pt-3 before:absolute before:inset-y-0 before:left-1/2 before:-z-10 before:w-screen before:-translate-x-1/2 before:bg-slate-50",
  stickyInner: "w-full",
  mobileLabel: "sr-only",
  mobileSelect:
    "w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-100 md:hidden",
  tabList:
    "hidden gap-2 overflow-x-auto rounded-lg border border-slate-200 bg-white p-2 shadow-sm md:flex",
  tabButton:
    "whitespace-nowrap rounded-md px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950",
  tabButtonActive:
    "whitespace-nowrap rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white",
  panel: "min-w-0",
};
