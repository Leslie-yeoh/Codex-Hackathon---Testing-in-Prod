"use client";

import { useMemo, useState } from "react";
import {
  extractedDefaults,
  mockLegacyDocumentLines,
} from "../../constants/mock/upload.mock";
import { globalStyles } from "../../styles/global.style";

const cn = (...classes) => classes.filter(Boolean).join(" ");

export default function UploadWorkspace() {
  const [stage, setStage] = useState("empty");
  const [form, setForm] = useState(extractedDefaults);
  const [decision, setDecision] = useState("Pending review");

  const fhirJson = useMemo(
    () => ({
      resourceType: "Observation",
      status: decision === "Approved" ? "final" : "preliminary",
      code: {
        coding: [
          {
            system: "http://loinc.org",
            code: "8867-4",
            display: form.observation,
          },
        ],
      },
      subject: { reference: form.patientId },
      valueQuantity: {
        value: Number(form.value || 0),
        unit: form.unit,
        system: "http://unitsofmeasure.org",
        code: "/min",
      },
    }),
    [decision, form]
  );

  const startMockExtraction = () => {
    setStage("processing");
    setDecision("Pending review");
    window.setTimeout(() => setStage("review"), 700);
  };

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setDecision("Manual edit");
  };

  return (
    <section className={globalStyles.section}>
      <div className={globalStyles.sectionHeader}>
        <div>
          <h2 className={globalStyles.sectionTitle}>Extraction Workspace</h2>
          <p className={globalStyles.sectionDescription}>
            Simulate upload, edit extracted fields, and change the final review state.
          </p>
        </div>
        <span className={cn(globalStyles.badge, globalStyles.badgePending)}>
          {decision}
        </span>
      </div>

      {stage === "empty" && (
        <div className={styles.dropzone}>
          <p className={styles.dropzoneTitle}>Drop legacy image or PDF here</p>
          <p className={styles.dropzoneText}>
            Use the demo upload to populate OCR text and editable FHIR fields.
          </p>
          <button
            type="button"
            className={cn(globalStyles.buttonBase, globalStyles.primaryButton)}
            onClick={startMockExtraction}
          >
            Take photo / upload image
          </button>
        </div>
      )}

      {stage === "processing" && (
        <div className={styles.processing}>
          <div className={styles.spinner} />
          <p className={styles.dropzoneTitle}>AI is deciphering handwriting...</p>
        </div>
      )}

      {stage === "review" && (
        <div className={styles.workspaceGrid}>
          <div className={styles.previewPanel}>
            <p className={globalStyles.eyebrow}>Legacy Source Preview</p>
            <div className={styles.mockDocument}>
              {mockLegacyDocumentLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <textarea
              className={styles.rawTextArea}
              value={form.rawText}
              onChange={(event) => updateField("rawText", event.target.value)}
              aria-label="Raw OCR text"
            />
          </div>

          <div className={styles.formPanel}>
            <p className={globalStyles.eyebrow}>Editable FHIR Fields</p>
            <Field label="Patient Reference" value={form.patientId} onChange={(value) => updateField("patientId", value)} />
            <Field label="Observation" value={form.observation} onChange={(value) => updateField("observation", value)} warning />
            <Field label="Value" value={form.value} onChange={(value) => updateField("value", value)} />
            <Field label="Unit" value={form.unit} onChange={(value) => updateField("unit", value)} />
            <p className={styles.warningText}>{form.confidence}</p>
          </div>

          <div className={styles.jsonPanel}>
            <p className={globalStyles.eyebrow}>Cloud-ready FHIR JSON</p>
            <pre className={styles.jsonBlock}>{JSON.stringify(fhirJson, null, 2)}</pre>
          </div>

          <div className={styles.actionBar}>
            <button
              type="button"
              className={cn(globalStyles.buttonBase, globalStyles.secondaryButton)}
              onClick={() => setStage("empty")}
            >
              Reset
            </button>
            <button
              type="button"
              className={cn(globalStyles.buttonBase, globalStyles.dangerButton)}
              onClick={() => setDecision("Flagged")}
            >
              Flag issue
            </button>
            <button
              type="button"
              className={cn(globalStyles.buttonBase, globalStyles.successButton)}
              onClick={() => setDecision("Approved")}
            >
              Approve FHIR payload
            </button>
          </div>
        </div>
      )}
    </section>
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
  processing: "mt-5 flex min-h-64 flex-col items-center justify-center gap-4 rounded-lg bg-slate-50 p-6 text-center",
  spinner: "h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-teal-700",
  workspaceGrid: "mt-5 grid gap-4 lg:grid-cols-2",
  previewPanel: "rounded-lg border border-slate-200 bg-slate-50 p-4",
  formPanel: "flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4",
  jsonPanel: "rounded-lg border border-slate-200 bg-slate-950 p-4 text-slate-50 lg:col-span-2",
  mockDocument: "my-3 rounded-md bg-white p-4 text-sm leading-7 text-slate-800 shadow-inner",
  rawTextArea: "min-h-28 w-full rounded-md border border-slate-300 p-3 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100",
  field: "flex flex-col gap-2",
  warningText: "rounded-md bg-amber-50 p-3 text-sm text-amber-900",
  jsonBlock: "overflow-x-auto text-xs leading-5 md:text-sm",
  actionBar: "flex flex-col gap-2 lg:col-span-2 sm:flex-row sm:justify-end",
};
