export const encodeRecordForShare = (record) =>
  btoa(encodeURIComponent(JSON.stringify(record)));

export const decodeSharedRecord = (token) => {
  if (!token) {
    return null;
  }

  try {
    return JSON.parse(decodeURIComponent(atob(token)));
  } catch {
    return null;
  }
};

export const getShareableRecord = (record) => ({
  id: record.id,
  patientId: record.patientId,
  context: record.context || "",
  findings:
    Array.isArray(record.findings) && record.findings.length > 0
      ? record.findings
      : [
          {
            observation: record.observation || "",
            value: record.value || "",
            unit: "",
          },
        ],
  confirmedAt: record.confirmedAt,
});
