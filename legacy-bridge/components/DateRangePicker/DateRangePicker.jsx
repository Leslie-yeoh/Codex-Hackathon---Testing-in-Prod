"use client";

import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

export default function DateRangePicker({ value, onChange }) {
  return (
    <div
      className={styles.wrapper}
      style={{
        "--rdp-day_button-width": "1.875rem",
        "--rdp-day_button-height": "1.875rem",
        "--rdp-day-width": "100%",
        "--rdp-day-height": "1.875rem",
        "--rdp-months-gap": "0",
      }}
    >
      <DayPicker
        mode="range"
        selected={value}
        onSelect={onChange}
        numberOfMonths={1}
        className={styles.calendar}
        classNames={{
          month: styles.month,
          month_grid: styles.monthGrid,
          weekday: styles.weekday,
          day: styles.day,
          day_button: styles.dayButton,
          today: styles.today,
          selected: styles.selected,
          range_start: styles.rangeStart,
          range_end: styles.rangeEnd,
          range_middle: styles.rangeMiddle,
        }}
      />
    </div>
  );
}

const styles = {
  wrapper:
    "w-full overflow-hidden rounded-lg border border-slate-200 bg-white p-2 text-sm shadow-sm",
  calendar: "mx-0 w-full max-w-none text-sm",
  month: "w-full",
  monthGrid: "w-full table-fixed border-collapse",
  weekday: "w-[14.285%] pb-2 text-center font-medium text-slate-700",
  day: "w-[14.285%] p-1 text-center",
  dayButton:
    "mx-auto flex h-9 w-9 items-center justify-center rounded-md transition hover:bg-teal-50",
  today: "font-bold text-teal-800",
  selected: "bg-teal-700 text-white",
  rangeStart: "rounded-l-md bg-teal-700 text-white",
  rangeEnd: "rounded-r-md bg-teal-700 text-white",
  rangeMiddle: "bg-teal-50 text-teal-900",
};
