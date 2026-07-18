import { normalizeEmail } from "../../utils/globalFormatter";
import { apiClient } from "../api/apiClient";
import ServiceConfigService from "../config/serviceConfigService";
import { getCurrentUser } from "../login/loginService";
import NormalizationService from "../normalization/normalizationService";

const USE_MOCK = ServiceConfigService.shouldDisplayMockActions();
const MOCK_DELAY = 300;
const recordsKeyPrefix = "legacyBridgeConfirmedRecords";
const maxStoredRecords = 25;

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

const getAccountRecordsKey = (user) => {
  const email = normalizeEmail(user?.email || "guest");
  return `${recordsKeyPrefix}:${email}`;
};

const readRecordsByUser = (user) => {
  if (typeof window === "undefined" || !user?.email) {
    return [];
  }

  try {
    return JSON.parse(window.localStorage.getItem(getAccountRecordsKey(user))) || [];
  } catch {
    window.localStorage.removeItem(getAccountRecordsKey(user));
    return [];
  }
};

const writeRecordsByUser = (user, records) => {
  if (!user?.email) {
    return;
  }

  window.localStorage.setItem(
    getAccountRecordsKey(user),
    JSON.stringify(records.slice(0, maxStoredRecords))
  );
};

const normalizeRecord = (payload) => {
  const data = NormalizationService.recordToFrontend(getPayloadData(payload));
  const findings = Array.isArray(data.findings)
    ? data.findings
    : data.clinical_findings ?? [];

  return {
    ...data,
    id: String(data.id ?? data.reference ?? data.record_reference ?? ""),
    patientId:
      data.patientId ??
      data.patient ??
      data.patient_identifier ??
      data.patient_reference ??
      "",
    context: data.context ?? data.rawText ?? data.source_context ?? "",
    findings,
    confirmedAt:
      data.confirmedAt ?? data.confirmed_at ?? new Date().toLocaleString("en-MY"),
    confirmedAtISO: data.confirmedAtISO ?? data.confirmed_at_iso ?? null,
    ownerEmail: data.ownerEmail ?? data.owner_email ?? "",
  };
};

const normalizeRecordList = (payload) => {
  const data = getPayloadData(payload);
  const records = Array.isArray(data) ? data : data?.items ?? payload?.items ?? [];

  return records.map(normalizeRecord);
};

class RecordService {
  static async fetchCurrentUserRecords({ signal } = {}) {
    const currentUser = getCurrentUser();

    if (USE_MOCK) {
      return waitForMock(readRecordsByUser(currentUser).map(normalizeRecord), signal);
    }

    const payload = await apiClient("/ocr/records", { signal });
    return normalizeRecordList(payload);
  }

  static fetchCurrentUserRecordFile(recordId, { signal } = {}) {
    return apiClient("/ocr/records/" + recordId + "/file", {
      signal,
      responseType: "blob",
    });
  }

  static async saveCurrentUserRecord(record, { signal } = {}) {
    const currentUser = getCurrentUser();

    if (!currentUser?.email) {
      return {
        ok: false,
        message: "Sign in before saving records.",
        records: [],
      };
    }

    const recordWithOwner = {
      ...record,
      ownerEmail: currentUser.email,
    };

    if (USE_MOCK) {
      const records = [recordWithOwner, ...readRecordsByUser(currentUser)]
        .slice(0, maxStoredRecords)
        .map(normalizeRecord);

      writeRecordsByUser(currentUser, records);

      return waitForMock(
        {
          ok: true,
          record: normalizeRecord(recordWithOwner),
          records,
        },
        signal
      );
    }

    const payload = await apiClient("/api/records", {
      method: "POST",
      body: JSON.stringify(NormalizationService.recordToBackend(recordWithOwner)),
      signal,
    });
    const savedRecord = normalizeRecord(payload);
    const records = await RecordService.fetchCurrentUserRecords({ signal });

    return {
      ok: true,
      record: savedRecord,
      records,
    };
  }
}

export const getCurrentUserRecords = (options) =>
  RecordService.fetchCurrentUserRecords(options);
export const getCurrentUserRecordFile = (recordId, options) =>
  RecordService.fetchCurrentUserRecordFile(recordId, options);
export const saveCurrentUserRecord = (record, options) =>
  RecordService.saveCurrentUserRecord(record, options);

export default RecordService;
