import { normalizeEmail } from "../../utils/globalFormatter";
import { getCurrentUser } from "../login/loginService";

const recordsKeyPrefix = "legacyBridgeConfirmedRecords";
const maxStoredRecords = 25;

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

export const getCurrentUserRecords = () => readRecordsByUser(getCurrentUser());

export const saveCurrentUserRecord = (record) => {
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
  const records = [recordWithOwner, ...readRecordsByUser(currentUser)].slice(
    0,
    maxStoredRecords
  );

  writeRecordsByUser(currentUser, records);

  return {
    ok: true,
    record: recordWithOwner,
    records,
  };
};
