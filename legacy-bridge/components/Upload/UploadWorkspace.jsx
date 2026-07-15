"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Columns3,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Pilcrow,
  Rows3,
  Table2,
  Trash2,
  Underline as UnderlineIcon,
} from "lucide-react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Table } from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Container from "../Container/Container";
import { extractedDefaults } from "../../constants/mock/upload.mock";
import {
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE,
} from "../../constants";
import {
  getCurrentUserRecords,
  saveCurrentUserRecord,
} from "../../services/records/recordService";
import { globalStyles } from "../../styles/global.style";

const cn = (...classes) => classes.filter(Boolean).join(" ");

const editorExtensions = [
  StarterKit.configure({
    heading: {
      levels: [2, 3],
    },
  }),
  Underline,
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  Table.configure({
    resizable: true,
  }),
  TableRow,
  TableHeader,
  TableCell,
];

export default function UploadWorkspace() {
  const [stage, setStage] = useState("empty");
  const [form, setForm] = useState(extractedDefaults);
  const [decision, setDecision] = useState("Pending review");
  const [isConfirmedChecked, setIsConfirmedChecked] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [confirmedRecords, setConfirmedRecords] = useState(getCurrentUserRecords);
  const [hasConfirmedCurrentRecord, setHasConfirmedCurrentRecord] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [latestRecord, setLatestRecord] = useState(null);
  const fileInputRef = useRef(null);

  const editor = useEditor({
    extensions: editorExtensions,
    content: form.rawText,
    immediatelyRender: false,
    onUpdate: ({ editor: currentEditor }) => {
      updateField("rawText", currentEditor.getHTML());
    },
  });

  const startExtraction = (fileName = "") => {
    setStage("processing");
    setDecision("Pending review");
    setIsConfirmedChecked(false);
    setAlertMessage("");
    setHasConfirmedCurrentRecord(false);
    setSelectedFileName(fileName);
    setLatestRecord(null);
    window.setTimeout(() => setStage("review"), 700);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setAlertMessage("Please upload a PNG, JPG, or PDF file.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setAlertMessage("The selected file is larger than the 10 MB limit.");
      event.target.value = "";
      return;
    }

    startExtraction(file.name);
    event.target.value = "";
  };

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setDecision("Manual edit");
    setAlertMessage("");
    setIsConfirmedChecked(false);
    setHasConfirmedCurrentRecord(false);
    setLatestRecord(null);
  };

  const updateFinding = (index, field, value) => {
    setForm((current) => ({
      ...current,
      findings: current.findings.map((finding, findingIndex) =>
        findingIndex === index ? { ...finding, [field]: value } : finding
      ),
    }));
    setDecision("Manual edit");
    setAlertMessage("");
    setIsConfirmedChecked(false);
    setHasConfirmedCurrentRecord(false);
    setLatestRecord(null);
  };

  const addFinding = () => {
    setForm((current) => ({
      ...current,
      findings: [
        ...current.findings,
        { observation: "", value: "", unit: "" },
      ],
    }));
    setDecision("Manual edit");
    setAlertMessage("");
    setIsConfirmedChecked(false);
    setHasConfirmedCurrentRecord(false);
  };

  const removeFinding = (index) => {
    setForm((current) => ({
      ...current,
      findings:
        current.findings.length === 1
          ? current.findings
          : current.findings.filter((_, findingIndex) => findingIndex !== index),
    }));
    setDecision("Manual edit");
    setAlertMessage("");
    setIsConfirmedChecked(false);
    setHasConfirmedCurrentRecord(false);
  };

  const handleConfirm = () => {
    if (hasConfirmedCurrentRecord) {
      setAlertMessage("This record has already been confirmed.");
      return;
    }

    if (!isReviewComplete(form)) {
      setAlertMessage("Please complete patient reference, context, and every finding row.");
      return;
    }

    if (!isConfirmedChecked) {
      setAlertMessage("Please confirm that the extracted details have been reviewed.");
      return;
    }

    const findings = getReviewedFindings(form.findings);

    const confirmedDate = new Date();
    const record = {
      id: createReferenceNumber(),
      patientId: form.patientId,
      context: form.rawText,
      illness: findings[0].observation,
      findings,
      observation: findings[0].observation,
      value: formatFindingValue(findings[0]),
      confirmedAt: confirmedDate.toLocaleString("en-MY", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
      confirmedAtISO: confirmedDate.toISOString(),
    };
    const result = saveCurrentUserRecord(record);

    if (!result.ok) {
      setAlertMessage(result.message);
      return;
    }

    setConfirmedRecords(result.records);
    setLatestRecord(result.record);
    setHasConfirmedCurrentRecord(true);
    setDecision("Confirmed");
    setAlertMessage(
      `Details confirmed. Reference ${record.id} has been added to recent confirmed records.`
    );
  };

  const isConfirmDisabled =
    hasConfirmedCurrentRecord || !isReviewComplete(form) || !isConfirmedChecked;
  const actionHint = getActionHint({
    form,
    hasConfirmedCurrentRecord,
    isConfirmedChecked,
  });

  const resetUpload = () => {
    setStage("empty");
    setIsConfirmedChecked(false);
    setAlertMessage("");
    setSelectedFileName("");
    setLatestRecord(null);
    setDecision("Pending review");
    setHasConfirmedCurrentRecord(false);
  };

  return (
    <Container title="Extraction Workspace">
      {stage === "empty" && (
        <div className={styles.dropzone}>
          <p className={styles.dropzoneTitle}>Drop prescription image or PDF here</p>
          <p className={styles.dropzoneText}>
            Upload a source document to create editable prescription details for review.
          </p>
          {alertMessage && (
            <div className={cn(styles.alertMessage, styles.alertWarning)} role="alert">
              {alertMessage}
            </div>
          )}
          <button
            type="button"
            className={cn(globalStyles.buttonBase, globalStyles.primaryButton)}
            onClick={() => fileInputRef.current?.click()}
          >
            Take photo / upload image
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept={ALLOWED_FILE_TYPES.join(",")}
            className={styles.fileInput}
            onChange={handleFileSelect}
          />
        </div>
      )}

      {stage === "processing" && (
        <div className={styles.processing}>
          <div className={styles.spinner} />
          <p className={styles.dropzoneTitle}>Reading document context...</p>
          {selectedFileName && (
            <p className={styles.dropzoneText}>{selectedFileName}</p>
          )}
        </div>
      )}

      {stage === "review" && (
        <div className={styles.workspaceGrid}>
          <div className={styles.previewPanel}>
            <h2 className={styles.panelTitle}>Edit Context</h2>
            {selectedFileName && (
              <p className={styles.fileName}>Source file: {selectedFileName}</p>
            )}
            <EditorToolbar editor={editor} />
            <EditorContent
              className={cn(styles.richTextEditor, "tiptap-editor")}
              editor={editor}
            />
          </div>

          <div className={styles.formPanel}>
            <div className={styles.findingsHeader}>
              <h2 className={styles.panelTitle}>Extracted Findings</h2>
              <button
                type="button"
                className={styles.addFindingButton}
                onClick={addFinding}
              >
                + Add finding
              </button>
            </div>
            <Field
              label="Patient Reference"
              value={form.patientId}
              onChange={(value) => updateField("patientId", value)}
            />
            <div className={styles.findingList}>
              {form.findings.map((finding, index) => (
                <div key={`finding-${index}`} className={styles.findingRow}>
                  <Field
                    label="Observation"
                    value={finding.observation}
                    onChange={(value) => updateFinding(index, "observation", value)}
                    warning
                  />
                  <Field
                    label="Value"
                    value={finding.value}
                    onChange={(value) => updateFinding(index, "value", value)}
                  />
                  <Field
                    label="Unit"
                    value={finding.unit}
                    onChange={(value) => updateFinding(index, "unit", value)}
                  />
                  <button
                    type="button"
                    className={styles.removeFindingButton}
                    disabled={form.findings.length === 1}
                    onClick={() => removeFinding(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <p className={styles.warningText}>{form.confidence}</p>
          </div>

          <div className={styles.summaryPanel}>
            <h2 className={styles.panelTitle}>Review Summary</h2>
            <div className={styles.summaryGrid}>
              <SummaryItem label="Patient ID" value={form.patientId} />
              <SummaryItem
                label="Total Findings"
                value={String(form.findings.length)}
              />
            </div>
            <FindingSummary findings={form.findings} />
          </div>

          {latestRecord && (
            <div className={styles.confirmedPanel}>
              <h2 className={styles.panelTitle}>Confirmed Record</h2>
              <div className={styles.confirmedGrid}>
                <SummaryItem label="Reference" value={latestRecord.id} />
                <SummaryItem label="Confirmed At" value={latestRecord.confirmedAt} />
                <SummaryItem label="Patient Reference" value={latestRecord.patientId} />
              </div>
              <FindingSummary findings={latestRecord.findings} />
              <p className={styles.recordNote}>
                Use this reference to find the confirmed details again in recent
                confirmed records and audit history.
              </p>
              <div className={styles.confirmedActions}>
                <Link
                  href="/records"
                  className={cn(globalStyles.buttonBase, globalStyles.primaryButton)}
                >
                  View in Records
                </Link>
                <button
                  type="button"
                  className={cn(globalStyles.buttonBase, globalStyles.secondaryButton)}
                  onClick={resetUpload}
                >
                  Upload another document
                </button>
              </div>
            </div>
          )}

          <div className={styles.actionBar}>
            {alertMessage && (
              <div
                className={cn(
                  styles.alertMessage,
                  decision === "Confirmed"
                    ? styles.alertSuccess
                    : styles.alertWarning
                )}
                role="alert"
              >
                {alertMessage}
              </div>
            )}
            <p className={styles.actionHint}>{actionHint}</p>
            <label className={styles.confirmationRow}>
              <input
                type="checkbox"
                className={globalStyles.checkbox}
                checked={isConfirmedChecked}
                onChange={(event) => setIsConfirmedChecked(event.target.checked)}
              />
              <span>I have reviewed the extracted context and clinical fields.</span>
            </label>
            <button
              type="button"
              className={cn(globalStyles.buttonBase, globalStyles.secondaryButton)}
              onClick={resetUpload}
            >
              Start over
            </button>
            <button
              type="button"
              className={cn(globalStyles.buttonBase, globalStyles.successButton)}
              disabled={isConfirmDisabled}
              onClick={handleConfirm}
            >
              Confirm details
            </button>
          </div>
        </div>
      )}

      {confirmedRecords.length > 0 && (
        <div className={styles.recordsPanel}>
          <h2 className={styles.panelTitle}>Recent Confirmed Records</h2>
          <div className={styles.recordList}>
            {confirmedRecords.map((record) => (
              <div key={record.id} className={styles.recordItem}>
                <div>
                  <p className={styles.recordTitle}>{record.id}</p>
                  <p className={styles.recordMeta}>
                    {record.patientId} | {record.confirmedAt}
                  </p>
                  <p className={styles.recordMeta}>
                    {getFindingCount(record)} finding
                    {getFindingCount(record) === 1 ? "" : "s"}
                  </p>
                </div>
                <span className={cn(globalStyles.badge, globalStyles.badgeVerified)}>
                  Confirmed
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Container>
  );
}

function createReferenceNumber() {
  return `RX-${Date.now().toString().slice(-8)}`;
}

function formatFindingValue(finding) {
  return [finding.value, finding.unit].filter(Boolean).join(" ");
}

function getReviewedFindings(findings) {
  return findings.map((finding) => ({
    observation: finding.observation.trim(),
    value: finding.value.trim(),
    unit: finding.unit.trim(),
  }));
}

function isReviewComplete(form) {
  const hasPatientReference = form.patientId.trim().length > 0;
  const hasContext = stripHtml(form.rawText).trim().length > 0;
  const hasCompleteFindings =
    form.findings.length > 0 &&
    form.findings.every(
      (finding) =>
        finding.observation.trim() &&
        finding.value.trim() &&
        finding.unit.trim()
    );

  return hasPatientReference && hasContext && hasCompleteFindings;
}

function stripHtml(value) {
  return value.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ");
}

function getActionHint({ form, hasConfirmedCurrentRecord, isConfirmedChecked }) {
  if (hasConfirmedCurrentRecord) {
    return "Record confirmed. View it in Records or upload another document.";
  }

  if (!isReviewComplete(form)) {
    return "Complete all fields before confirming the details.";
  }

  if (!isConfirmedChecked) {
    return "Select the confirmation checkbox to continue.";
  }

  return "Ready to confirm.";
}

function getFindingCount(record) {
  return Array.isArray(record.findings) && record.findings.length > 0
    ? record.findings.length
    : 1;
}

function EditorToolbar({ editor }) {
  if (!editor) {
    return null;
  }

  return (
    <div className={styles.editorToolbar} aria-label="Context editing tools">
      <div className={styles.toolbarGroup}>
        <ToolbarButton
          active={editor.isActive("paragraph")}
          icon={Pilcrow}
          label="Paragraph"
          onClick={() => editor.chain().focus().setParagraph().run()}
        />
        <ToolbarButton
          active={editor.isActive("heading", { level: 2 })}
          icon={Heading2}
          label="Heading"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        />
        <ToolbarButton
          active={editor.isActive("heading", { level: 3 })}
          icon={Heading3}
          label="Subheading"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        />
      </div>

      <div className={styles.toolbarGroup}>
        <ToolbarButton
          active={editor.isActive("bold")}
          icon={Bold}
          label="Bold"
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
        <ToolbarButton
          active={editor.isActive("italic")}
          icon={Italic}
          label="Italic"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />
        <ToolbarButton
          active={editor.isActive("underline")}
          icon={UnderlineIcon}
          label="Underline"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        />
      </div>

      <div className={styles.toolbarGroup}>
        <ToolbarButton
          active={editor.isActive("bulletList")}
          icon={List}
          label="Bullet List"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />
        <ToolbarButton
          active={editor.isActive("orderedList")}
          icon={ListOrdered}
          label="Numbered List"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        />
      </div>

      <div className={styles.toolbarGroup}>
        <ToolbarButton
          active={editor.isActive({ textAlign: "left" })}
          icon={AlignLeft}
          label="Left"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        />
        <ToolbarButton
          active={editor.isActive({ textAlign: "center" })}
          icon={AlignCenter}
          label="Center"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        />
        <ToolbarButton
          active={editor.isActive({ textAlign: "right" })}
          icon={AlignRight}
          label="Right"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        />
      </div>

      <div className={styles.toolbarGroup}>
        <ToolbarButton
          active={editor.isActive("table")}
          icon={Table2}
          label="Table"
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 2, cols: 3, withHeaderRow: true })
              .run()
          }
        />
        <ToolbarButton
          disabled={!editor.isActive("table")}
          icon={Rows3}
          label="Add Row"
          onClick={() => editor.chain().focus().addRowAfter().run()}
        />
        <ToolbarButton
          disabled={!editor.isActive("table")}
          icon={Columns3}
          label="Add Column"
          onClick={() => editor.chain().focus().addColumnAfter().run()}
        />
        <ToolbarButton
          disabled={!editor.isActive("table")}
          icon={Trash2}
          label="Remove Table"
          onClick={() => editor.chain().focus().deleteTable().run()}
        />
      </div>
    </div>
  );
}

function ToolbarButton({
  active = false,
  disabled = false,
  icon: Icon,
  label,
  onClick,
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        styles.toolbarButton,
        active && styles.toolbarButtonActive
      )}
      disabled={disabled}
      onClick={onClick}
      title={label}
    >
      <Icon size={16} aria-hidden="true" />
      <span className={styles.screenReaderOnly}>{label}</span>
    </button>
  );
}

function SummaryItem({ label, value }) {
  return (
    <div className={styles.summaryItem}>
      <span className={styles.summaryLabel}>{label}</span>
      <strong className={styles.summaryValue}>{value}</strong>
    </div>
  );
}

function FindingSummary({ findings }) {
  return (
    <div className={styles.findingSummary}>
      {findings.map((finding, index) => (
        <div key={`${finding.observation}-${index}`} className={styles.findingSummaryItem}>
          <span className={styles.summaryLabel}>Finding {index + 1}</span>
          <strong className={styles.summaryValue}>
            {finding.observation || "No observation entered"}
          </strong>
          <span className={styles.findingSummaryMeta}>
            {formatFindingValue(finding) || "No value entered"}
          </span>
        </div>
      ))}
    </div>
  );
}

function Field({ label, value, onChange, warning = false }) {
  return (
    <label className={styles.field}>
      <span className={globalStyles.fieldLabel}>{label}</span>
      <input
        className={cn(globalStyles.input, warning && globalStyles.warningInput)}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

const styles = {
  dropzone: "mt-5 flex min-h-64 flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center",
  dropzoneTitle: "text-lg font-semibold text-slate-950",
  dropzoneText: "max-w-md text-sm leading-6 text-slate-600",
  fileInput: "hidden",
  fileName: "mb-3 text-sm font-medium text-slate-600",
  processing: "mt-5 flex min-h-64 flex-col items-center justify-center gap-4 rounded-lg bg-slate-50 p-6 text-center",
  spinner: "h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-teal-700",
  workspaceGrid: "mt-5 grid gap-4 lg:grid-cols-2",
  previewPanel: "rounded-lg border border-slate-200 bg-slate-50 p-4",
  formPanel: "flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4",
  findingsHeader: "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
  addFindingButton:
    "rounded-md border border-teal-200 bg-teal-50 px-3 py-2 text-sm font-semibold text-teal-800 transition hover:bg-teal-100",
  findingList: "grid gap-3",
  findingRow:
    "grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 md:grid-cols-[1fr_0.8fr_0.8fr_auto] md:items-end",
  removeFindingButton:
    "min-h-10 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50",
  panelTitle: "text-base font-semibold text-slate-950",
  summaryPanel:
    "rounded-lg border border-slate-200 bg-white p-4 lg:col-span-2",
  summaryGrid: "mt-3 grid gap-3 md:grid-cols-2",
  findingSummary: "mt-3 grid gap-3",
  findingSummaryItem: "rounded-md border border-slate-200 bg-slate-50 p-3",
  findingSummaryMeta: "mt-1 block text-sm font-medium text-slate-600",
  summaryItem: "rounded-md border border-slate-200 bg-slate-50 p-3",
  summaryLabel: "block text-sm font-medium text-slate-500",
  summaryValue: "mt-1 block text-sm font-semibold text-slate-950",
  editorToolbar:
    "mb-2 flex flex-wrap gap-2 rounded-md border border-slate-200 bg-white p-2",
  toolbarGroup: "flex flex-wrap gap-2",
  toolbarButton:
    "inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40",
  toolbarButtonActive: "border-teal-300 bg-teal-50 text-teal-800",
  screenReaderOnly: "sr-only",
  richTextEditor:
    "overflow-hidden rounded-md border border-slate-300 bg-white text-sm",
  field: "flex flex-col gap-2",
  warningText: "rounded-md bg-amber-50 p-3 text-sm text-amber-900",
  actionBar:
    "flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 lg:col-span-2 lg:flex-row lg:items-center lg:justify-end",
  actionHint: "text-sm font-medium leading-6 text-slate-600 lg:flex-1",
  confirmationRow:
    "flex min-h-11 flex-1 cursor-pointer items-start gap-3 text-sm font-medium leading-6 text-slate-700",
  alertMessage: "w-full rounded-md px-3 py-2 text-sm font-medium sm:basis-full",
  alertWarning: "border border-amber-200 bg-amber-50 text-amber-900",
  alertSuccess: "border border-emerald-200 bg-emerald-50 text-emerald-800",
  confirmedPanel:
    "rounded-lg border border-emerald-200 bg-emerald-50 p-4 lg:col-span-2",
  confirmedGrid: "mt-3 grid gap-3 md:grid-cols-2",
  recordNote: "mt-3 text-sm leading-6 text-emerald-900",
  confirmedActions: "mt-4 flex flex-col gap-2 sm:flex-row",
  recordsPanel: "mt-5 rounded-lg border border-slate-200 bg-white p-4",
  recordList: "mt-3 grid gap-3",
  recordItem:
    "flex items-start justify-between gap-3 rounded-md border border-slate-200 bg-slate-50 p-3",
  recordTitle: "text-sm font-semibold text-slate-950",
  recordMeta: "mt-1 text-sm text-slate-600",
};
