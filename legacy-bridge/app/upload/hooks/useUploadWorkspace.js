"use client";

import { useEffect, useRef, useState } from "react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Table } from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { MAX_FILE_SIZE } from "../../../constants";
import { extractedDefaults } from "../../../constants/mock/upload.mock";
import {
  confirmExtraction,
  extractDocument,
} from "../../../services/upload/uploadService";

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

export default function useUploadWorkspace() {
  const [stage, setStage] = useState("empty");
  const [form, setForm] = useState(extractedDefaults);
  const [decision, setDecision] = useState("Pending review");
  const [isConfirmedChecked, setIsConfirmedChecked] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [confirmedRecords, setConfirmedRecords] = useState([]);
  const [hasConfirmedCurrentRecord, setHasConfirmedCurrentRecord] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [latestRecord, setLatestRecord] = useState(null);
  const [gridfsFileId, setGridfsFileId] = useState("");
  const [originalImageUrl, setOriginalImageUrl] = useState("");
  const [enhanceImage, setEnhanceImage] = useState(false);
  const fileInputRef = useRef(null);
  const originalImageUrlRef = useRef("");

  const clearOriginalImage = () => {
    if (originalImageUrlRef.current) {
      URL.revokeObjectURL(originalImageUrlRef.current);
      originalImageUrlRef.current = "";
    }
    setOriginalImageUrl("");
  };

  useEffect(() => () => {
    if (originalImageUrlRef.current) {
      URL.revokeObjectURL(originalImageUrlRef.current);
    }
  }, []);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setDecision("Manual edit");
    setAlertMessage("");
    setIsConfirmedChecked(false);
    setHasConfirmedCurrentRecord(false);
    setLatestRecord(null);
  };

  const editor = useEditor({
    extensions: editorExtensions,
    content: form.rawText,
    immediatelyRender: false,
    onUpdate: ({ editor: currentEditor }) => {
      updateField("rawText", currentEditor.getHTML());
    },
  });

  const startExtraction = async (file) => {
    clearOriginalImage();
    originalImageUrlRef.current = URL.createObjectURL(file);
    setOriginalImageUrl(originalImageUrlRef.current);
    setStage("processing");
    setDecision("Pending review");
    setIsConfirmedChecked(false);
    setAlertMessage("");
    setHasConfirmedCurrentRecord(false);
    setSelectedFileName(file.name);
    setGridfsFileId("");
    setLatestRecord(null);

    try {
      const extractedData = await extractDocument({ file, enhance: enhanceImage });
      if (!extractedData.fileId) {
        throw new Error("OCR storage did not return a file ID.");
      }
      setGridfsFileId(extractedData.fileId);
      setForm(extractedData);
      editor?.commands.setContent(extractedData.rawText);
      setStage("review");
    } catch (error) {
      if (error.name !== "AbortError") {
        setAlertMessage("Unable to extract this document. Please try again.");
        clearOriginalImage();
        setStage("empty");
      }
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setAlertMessage("Please upload a PNG or JPG image.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setAlertMessage("The selected file is larger than the 20 MB limit.");
      event.target.value = "";
      return;
    }

    void startExtraction(file);
    event.target.value = "";
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


  const handleConfirm = async () => {
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
    if (!gridfsFileId) {
      setAlertMessage("OCR storage is unavailable. Upload the image again.");
      return;
    }

    try {
      await confirmExtraction({
        fileId: gridfsFileId,
        patientId: record.patientId,
        findings,
        context: form.rawText,
      });
    } catch (error) {
      setAlertMessage(error.message || "Unable to save this OCR record.");
      return;
    }

    setConfirmedRecords((current) => [record, ...current].slice(0, 25));
    setLatestRecord(record);
    setHasConfirmedCurrentRecord(true);
    setDecision("Confirmed");
    setAlertMessage(
      `Details confirmed. Reference ${record.id} has been added to recent confirmed records.`
    );
  };

  const resetUpload = () => {
    setStage("empty");
    setIsConfirmedChecked(false);
    setAlertMessage("");
    setSelectedFileName("");
    setGridfsFileId("");
    clearOriginalImage();
    setLatestRecord(null);
    setDecision("Pending review");
    setHasConfirmedCurrentRecord(false);
  };

  const isConfirmDisabled =
    hasConfirmedCurrentRecord || !isReviewComplete(form) || !isConfirmedChecked;
  const actionHint = getActionHint({
    form,
    hasConfirmedCurrentRecord,
    isConfirmedChecked,
  });

  return {
    actionHint,
    addFinding,
    alertMessage,
    confirmedRecords,
    decision,
    editor,
    enhanceImage,
    fileInputRef,
    form,
    handleConfirm,
    handleFileSelect,
    isConfirmedChecked,
    isConfirmDisabled,
    latestRecord,
    originalImageUrl,
    removeFinding,
    resetUpload,
    selectedFileName,
    setEnhanceImage,
    setIsConfirmedChecked,
    stage,
    updateField,
    updateFinding,
  };
}

export function createReferenceNumber() {
  return `RX-${Date.now().toString().slice(-8)}`;
}

export function formatFindingValue(finding) {
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
