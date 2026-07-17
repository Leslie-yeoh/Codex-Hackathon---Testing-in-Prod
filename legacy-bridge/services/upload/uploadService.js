import { extractedDefaults } from "../../constants/mock/upload.mock";
import { apiClient } from "../api/apiClient";
import ServiceConfigService from "../config/serviceConfigService";

const USE_MOCK = ServiceConfigService.shouldDisplayMockActions();
const MOCK_DELAY = 700;

const waitForMock = (value, signal) =>
  new Promise((resolve, reject) => {
    if (signal?.aborted) {
      const abortError = new Error("Request aborted");
      abortError.name = "AbortError";
      reject(abortError);
      return;
    }

    const timer = window.setTimeout(() => resolve(value), MOCK_DELAY);
    signal?.addEventListener(
      "abort",
      () => {
        window.clearTimeout(timer);
        const abortError = new Error("Request aborted");
        abortError.name = "AbortError";
        reject(abortError);
      },
      { once: true }
    );
  });

const normalizeExtraction = (data = {}) => {
  const fields = Array.isArray(data.extracted_fields)
    ? data.extracted_fields
    : data.extracted_fields ? [data.extracted_fields] : [];
  return {
    fileId: data.file_id ?? "",
    patientId: fields.find((field) => field.patient_reference)?.patient_reference ?? "",
    rawText: data.natural_language ?? data.raw_text ?? "",
    findings: (fields.length ? fields : [{}]).map((field) => ({
      observation: field.observations ?? field.observation ?? "",
      value: field.value ?? "",
      unit: field.unit ?? "",
    })),
    confidence: data.low_confidence_flag
      ? "Low confidence OCR result. Review before confirming."
      : "Review the OCR result before confirming.",
  };
};

class UploadService {
  static async extractDocument({ file, enhance = false, signal } = {}) {
    if (USE_MOCK) {
      return waitForMock({ ...extractedDefaults, fileId: "mock-upload" }, signal);
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("enhance", String(enhance));
    const response = await apiClient("/ocr/handwriting", {
      method: "POST",
      body: formData,
      signal,
    });
    if (!response.success) {
      throw new Error(response.metadata?.error || "OCR failed.");
    }
    return normalizeExtraction(response);
  }

  static async confirmExtraction({ fileId, patientId, findings, context, signal } = {}) {
    if (USE_MOCK) {
      return waitForMock({ file_id: fileId, success: true }, signal);
    }

    return apiClient("/ocr/handwriting/" + fileId + "/confirm", {
      method: "POST",
      body: JSON.stringify({
        patientID: patientId,
        findings,
        context,
      }),
      signal,
    });
  }
}

export const extractDocument = (options) =>
  UploadService.extractDocument(options);
export const confirmExtraction = (options) =>
  UploadService.confirmExtraction(options);

export default UploadService;