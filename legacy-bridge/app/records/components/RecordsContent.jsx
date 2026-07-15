"use client";

import { useMemo, useState } from "react";
import { Download, Share2, SlidersHorizontal } from "lucide-react";
import BottomSheet from "../../../components/BottomSheet/BottomSheet";
import Button from "../../../components/Button/Button";
import Container from "../../../components/Container/Container";
import DateRangePicker from "../../../components/DateRangePicker/DateRangePicker";
import { getCurrentUserRecords } from "../../../services/records/recordService";
import { globalStyles } from "../../../styles/global.style";
import { ALL_ILLNESS_OPTION, DATE_FILTER_OPTIONS } from "../constants";
import styles from "../records.style";
import {
  encodeRecordForShare,
  getShareableRecord,
} from "../utils/shareRecord.utils";

const cn = (...classes) => classes.filter(Boolean).join(" ");

export default function RecordsContent() {
  const [query, setQuery] = useState("");
  const [dateRange, setDateRange] = useState("all");
  const [customDateRange, setCustomDateRange] = useState();
  const [illness, setIllness] = useState(ALL_ILLNESS_OPTION);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  const [records] = useState(getCurrentUserRecords);
  const [selectedId, setSelectedId] = useState("");

  const illnessOptions = useMemo(
    () => [
      ALL_ILLNESS_OPTION,
      ...new Set(
        records
          .flatMap((record) =>
            getRecordFindings(record).map((finding) => finding.observation)
          )
          .filter(Boolean)
      ),
    ],
    [records]
  );

  const filteredRecords = useMemo(
    () =>
      records.filter((record) => {
        const findings = getRecordFindings(record);
        const findingsText = findings
          .map((finding) => `${finding.observation} ${finding.value} ${finding.unit}`)
          .join(" ");
        const matchesQuery = `${record.id} ${record.patientId} ${findingsText}`
          .toLowerCase()
          .includes(query.toLowerCase());
        const matchesIllness =
          illness === ALL_ILLNESS_OPTION ||
          findings.some((finding) => finding.observation === illness);
        const matchesDate = isWithinDateRange(record, dateRange, customDateRange);

        return matchesQuery && matchesIllness && matchesDate;
      }),
    [customDateRange, dateRange, illness, query, records]
  );

  const selectedRecord =
    records.find((record) => record.id === selectedId);

  const getShareUrl = (record, shouldPrint = false) => {
    const token = encodeRecordForShare(getShareableRecord(record));
    const url = new URL("/records/share", window.location.origin);
    url.searchParams.set("record", token);

    if (shouldPrint) {
      url.searchParams.set("print", "1");
    }

    return url.toString();
  };

  const handleCopyShareLink = async (record) => {
    const shareUrl = getShareUrl(record);

    try {
      await window.navigator.clipboard.writeText(shareUrl);
      setShareMessage("Share link copied.");
    } catch {
      setShareMessage(shareUrl);
    }
  };

  const handleDownloadPdf = (record) => {
    window.open(getShareUrl(record, true), "_blank", "noopener,noreferrer");
  };

  const filterContent = (
    <FilterFields
      dateRange={dateRange}
      customDateRange={customDateRange}
      illness={illness}
      illnessOptions={illnessOptions}
      query={query}
      onClear={() => {
        setQuery("");
        setDateRange("all");
        setCustomDateRange(undefined);
        setIllness(ALL_ILLNESS_OPTION);
      }}
      onApply={() => setIsFilterOpen(false)}
      onDateRangeChange={setDateRange}
      onCustomDateRangeChange={setCustomDateRange}
      onIllnessChange={setIllness}
      onQueryChange={setQuery}
    />
  );

  return (
    <Container title="Records">
      {records.length === 0 ? (
        <div className={styles.emptyState}>
          <h2 className={styles.emptyTitle}>No confirmed records yet</h2>
          <p className={styles.emptyText}>
            Confirm prescription details from the Upload page. Saved records will
            appear here for this account only.
          </p>
        </div>
      ) : (
        <>
          <div className={styles.mobileFilterBar}>
            <Button
              type="button"
              variant="secondary"
              className={styles.filterButton}
              onClick={() => setIsFilterOpen(true)}
            >
              <SlidersHorizontal size={16} aria-hidden="true" />
              Filter records
            </Button>
          </div>

          <div className={styles.recordsLayout}>
            <aside className={styles.desktopFilterPanel}>{filterContent}</aside>

            <div className={styles.recordsGrid}>
              <div className={styles.listPanel}>
                <div className={styles.resultCount}>
                  {filteredRecords.length} record
                  {filteredRecords.length === 1 ? "" : "s"} found
                </div>

                {filteredRecords.length === 0 ? (
                  <div className={styles.noResults}>
                    No records match the selected filters.
                  </div>
                ) : (
                  <div className={styles.recordList}>
                    {filteredRecords.map((record) => {
                      return (
                        <button
                          key={record.id}
                          type="button"
                          className={styles.recordButton}
                          onClick={() => {
                            setSelectedId(record.id);
                            setShareMessage("");
                            setIsDetailOpen(true);
                          }}
                        >
                          <span>
                            <strong className={styles.recordTitle}>{record.id}</strong>
                            <span className={styles.recordMeta}>
                              {record.patientId} | {record.confirmedAt}
                            </span>
                            <span className={styles.recordMeta}>
                              {getRecordFindings(record).length} finding
                              {getRecordFindings(record).length === 1 ? "" : "s"}
                            </span>
                          </span>
                          <span
                            className={cn(
                              globalStyles.badge,
                              globalStyles.badgeVerified
                            )}
                          >
                            Confirmed
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          <BottomSheet
            title="Filter records"
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
          >
            {filterContent}
          </BottomSheet>

          {selectedRecord && isDetailOpen && (
            <RecordDetailModal
              record={selectedRecord}
              shareMessage={shareMessage}
              onClose={() => setIsDetailOpen(false)}
              onCopyShareLink={handleCopyShareLink}
              onDownloadPdf={handleDownloadPdf}
            />
          )}
        </>
      )}
    </Container>
  );
}

function RecordDetailModal({
  onClose,
  onCopyShareLink,
  onDownloadPdf,
  record,
  shareMessage,
}) {
  return (
    <div className={styles.modalOverlay} role="presentation">
      <button
        type="button"
        className={styles.modalBackdrop}
        aria-label="Close record details"
        onClick={onClose}
      />
      <section
        className={styles.modalPanel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="record-detail-title"
      >
        <div className={styles.detailHeader}>
          <h2 id="record-detail-title" className={styles.detailTitle}>
            {record.id}
          </h2>
          <button
            type="button"
            className={styles.closeButton}
            aria-label="Close record details"
            onClick={onClose}
          >
            x
          </button>
        </div>

        <div className={styles.detailActions}>
          <Button
            type="button"
            variant="secondary"
            className={styles.actionButton}
            onClick={() => onCopyShareLink(record)}
          >
            <Share2 size={16} aria-hidden="true" />
            Share link
          </Button>
          <Button
            type="button"
            variant="secondary"
            className={styles.actionButton}
            onClick={() => onDownloadPdf(record)}
          >
            <Download size={16} aria-hidden="true" />
            PDF
          </Button>
        </div>

        {shareMessage && (
          <div className={styles.shareMessage} role="status">
            {shareMessage}
          </div>
        )}

        <div className={styles.detailGrid}>
          <DetailItem label="Patient Reference" value={record.patientId} />
          <DetailItem
            label="Total Findings"
            value={String(getRecordFindings(record).length)}
          />
          <DetailItem label="Confirmed At" value={record.confirmedAt} />
        </div>
        <RecordContext context={record.context} />
        <FindingsTable findings={getRecordFindings(record)} />
      </section>
    </div>
  );
}

function FilterFields({
  customDateRange,
  dateRange,
  illness,
  illnessOptions,
  query,
  onClear,
  onApply,
  onCustomDateRangeChange,
  onDateRangeChange,
  onIllnessChange,
  onQueryChange,
}) {
  return (
    <div className={styles.filterFields}>
      <label className={styles.filterField}>
        <span className={globalStyles.fieldLabel}>Search</span>
        <input
          className={globalStyles.input}
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Reference, patient, or finding"
        />
      </label>

      <label className={styles.filterField}>
        <span className={globalStyles.fieldLabel}>Date</span>
        <select
          className={globalStyles.input}
          value={dateRange}
          onChange={(event) => onDateRangeChange(event.target.value)}
        >
          {DATE_FILTER_OPTIONS.map((option) => (
            <option key={option.key} value={option.key}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      {dateRange === "custom" && (
        <DateRangePicker
          value={customDateRange}
          onChange={onCustomDateRangeChange}
        />
      )}

      <label className={styles.filterField}>
        <span className={globalStyles.fieldLabel}>Illness</span>
        <select
          className={globalStyles.input}
          value={illness}
          onChange={(event) => onIllnessChange(event.target.value)}
        >
          {illnessOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <div className={styles.filterActions}>
        <Button type="button" onClick={onApply}>
          Apply filters
        </Button>
        <Button type="button" variant="secondary" onClick={onClear}>
          Clear filters
        </Button>
      </div>
    </div>
  );
}

function isWithinDateRange(record, dateRange, customDateRange) {
  if (dateRange === "all") {
    return true;
  }

  const rawDate = record.confirmedAtISO || record.confirmedAt;
  const recordDate = new Date(rawDate);

  if (Number.isNaN(recordDate.getTime())) {
    return dateRange === "all";
  }

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (dateRange === "today") {
    return recordDate >= startOfToday;
  }

  if (dateRange === "custom") {
    if (!customDateRange?.from) {
      return true;
    }

    const rangeStart = startOfDay(customDateRange.from);
    const rangeEnd = customDateRange.to
      ? endOfDay(customDateRange.to)
      : endOfDay(customDateRange.from);

    return recordDate >= rangeStart && recordDate <= rangeEnd;
  }

  const rangeDays = dateRange === "last7" ? 7 : 30;
  const rangeStart = new Date(now);
  rangeStart.setDate(now.getDate() - rangeDays);

  return recordDate >= rangeStart;
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function endOfDay(date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
    999
  );
}

function DetailItem({ label, value }) {
  return (
    <div className={styles.detailItem}>
      <span className={styles.detailLabel}>{label}</span>
      <strong className={styles.detailValue}>{value}</strong>
    </div>
  );
}

function RecordContext({ context }) {
  return (
    <section className={styles.contextPanel}>
      <h3 className={styles.contextTitle}>Document Context</h3>
      {context ? (
        <div
          className={styles.contextBody}
          dangerouslySetInnerHTML={{ __html: context }}
        />
      ) : (
        <p className={styles.contextEmpty}>
          Context was not saved for this older record.
        </p>
      )}
    </section>
  );
}

function FindingsTable({ findings }) {
  return (
    <div className={styles.findingsTableWrap}>
      <table className={styles.findingsTable}>
        <thead>
          <tr>
            <th className={styles.findingsHeadCell}>Observation</th>
            <th className={styles.findingsHeadCell}>Value</th>
            <th className={styles.findingsHeadCell}>Unit</th>
          </tr>
        </thead>
        <tbody>
          {findings.map((finding, index) => (
            <tr key={`${finding.observation}-${index}`}>
              <td className={styles.findingsCell}>{finding.observation}</td>
              <td className={styles.findingsCell}>{finding.value}</td>
              <td className={styles.findingsCell}>{finding.unit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function getRecordFindings(record) {
  if (Array.isArray(record.findings) && record.findings.length > 0) {
    return record.findings;
  }

  return [
    {
      observation: record.observation || "",
      value: record.value || "",
      unit: "",
    },
  ];
}
