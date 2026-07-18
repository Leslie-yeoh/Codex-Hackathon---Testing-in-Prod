"use client";

import { Download, Share2, SlidersHorizontal } from "lucide-react";
import { createPortal } from "react-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import BottomSheet from "../../../components/BottomSheet/BottomSheet";
import Button from "../../../components/Button/Button";
import Container from "../../../components/Container/Container";
import DateRangePicker from "../../../components/DateRangePicker/DateRangePicker";
import { globalStyles } from "../../../styles/global.style";
import { DATE_FILTER_OPTIONS } from "../constants";
import useRecordsView, { getRecordFindings } from "../hooks/useRecordsView";
import { downloadRecordCsv, downloadRecordJson } from "../utils/shareRecord.utils";
import styles from "../records.style";

const cn = (...classes) => classes.filter(Boolean).join(" ");

export default function RecordsContent() {
  const {
    clearFilters,
    closeFilter,
    closeRecordDetail,
    customDateRange,
    dateRange,
    filteredRecords,
    handleCopyShareLink,
    handleDownloadPdf,
    illness,
    illnessOptions,
    isDetailOpen,
    isFilterOpen,
    openFilter,
    openRecordDetail,
    records,
    selectedRecord,
    selectedImageUrl,
    setCustomDateRange,
    setDateRange,
    setIllness,
    setQuery,
    shareMessage,
    query,
  } = useRecordsView();

  const filterContent = (
    <FilterFields
      dateRange={dateRange}
      customDateRange={customDateRange}
      illness={illness}
      illnessOptions={illnessOptions}
      query={query}
      onClear={clearFilters}
      onApply={closeFilter}
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
              onClick={openFilter}
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
                          onClick={() => openRecordDetail(record.id)}
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
            onClose={closeFilter}
          >
            {filterContent}
          </BottomSheet>

          {selectedRecord && isDetailOpen && (
            <RecordDetailModal
              record={selectedRecord}
              imageUrl={selectedImageUrl}
              shareMessage={shareMessage}
              onClose={closeRecordDetail}
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
  imageUrl,
  onClose,
  onCopyShareLink,
  onDownloadPdf,
  record,
  shareMessage,
}) {
  return createPortal(
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
          <Button
            type="button"
            variant="secondary"
            className={styles.actionButton}
            onClick={() => downloadRecordJson(record)}
          >
            <Download size={16} aria-hidden="true" />
            JSON
          </Button>
          <Button
            type="button"
            variant="secondary"
            className={styles.actionButton}
            onClick={() => downloadRecordCsv(record)}
          >
            <Download size={16} aria-hidden="true" />
            CSV
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
        {imageUrl && record.contentType?.startsWith("image/") && (
          <img
            src={imageUrl}
            alt={record.originalFilename || "Original uploaded record"}
            className={styles.originalImage}
          />
        )}
        <RecordContext context={record.context} />
        <FindingsTable findings={getRecordFindings(record)} />
      </section>
    </div>,
    document.body
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

function DetailItem({ label, value }) {
  return (
    <div className={styles.detailItem}>
      <span className={styles.detailLabel}>{label}</span>
      <strong className={styles.detailValue}>{value}</strong>
    </div>
  );
}

function RecordContext({ context }) {
  const isHtml = context.trimStart().startsWith("<");

  return (
    <section className={styles.contextPanel}>
      <h3 className={styles.contextTitle}>Document Context</h3>
      {isHtml ? (
        <div
          className={styles.contextBody}
          dangerouslySetInnerHTML={{ __html: context }}
        />
      ) : context ? (
        <div className={styles.contextBody}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{context}</ReactMarkdown>
        </div>
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

