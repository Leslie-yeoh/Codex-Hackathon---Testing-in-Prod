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

const getPayloadData = (payload) => payload?.data ?? payload;

const normalizeExtraction = (payload) => {
  const data = getPayloadData(payload);

  return {
    patientId:
      data?.patientId ?? data?.patient_identifier ?? extractedDefaults.patientId,
    rawText: data?.rawText ?? data?.source_context ?? extractedDefaults.rawText,
    findings:
      data?.findings ?? data?.clinical_findings ?? extractedDefaults.findings,
    confidence: data?.confidence ?? data?.review_note ?? extractedDefaults.confidence,
  };
};

class UploadService {
  static async extractDocument({ fileName = "", signal } = {}) {
    if (USE_MOCK) {
      return waitForMock(normalizeExtraction(extractedDefaults), signal);
    }

    return normalizeExtraction(
      await apiClient("/api/uploads/extract", {
        method: "POST",
        body: JSON.stringify({ file_name: fileName }),
        signal,
      })
    );
  }
}

export const extractDocument = (options) =>
  UploadService.extractDocument(options);

export default UploadService;
