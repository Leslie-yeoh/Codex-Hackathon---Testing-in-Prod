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
const getRecordFindings = (record) =>
  Array.isArray(record.findings) && record.findings.length > 0
    ? record.findings
    : [
        {
          observation: record.observation || "",
          value: record.value || "",
          unit: "",
        },
      ];

const getDownloadName = (record, extension) =>
  `${String(record.id || "record").replace(/[^a-z0-9._-]/gi, "_") || "record"}.${extension}`;

const downloadFile = (content, type, filename) => {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

const csvCell = (value) => {
  const text = String(value ?? "");
  const safeText = /^[=+\-@]/.test(text) ? `'${text}` : text;

  return `"${safeText.replaceAll('"', '""')}"`;
};

export const downloadRecordJson = (record) =>
  downloadFile(
    JSON.stringify(record, null, 2),
    "application/json",
    getDownloadName(record, "json")
  );

export const downloadRecordCsv = (record) => {
  const rows = [
    ["Record ID", "Patient Reference", "Confirmed At", "Document Context", "Observation", "Value", "Unit"],
    ...getRecordFindings(record).map((finding) => [
      record.id,
      record.patientId,
      record.confirmedAt,
      record.context || "",
      finding.observation,
      finding.value,
      finding.unit,
    ]),
  ];
  const csv = rows.map((row) => row.map(csvCell).join(",")).join("\r\n");

  downloadFile(csv, "text/csv;charset=utf-8", getDownloadName(record, "csv"));
};
