const userFieldMap = {
  username: "display_name",
  email: "email",
  password: "password",
  role: "role",
  status: "status",
  mustChangePassword: "must_change_password",
  createdAt: "created_at",
};

const recordFieldMap = {
  id: "record_reference",
  reference: "record_reference",
  patientId: "patient_identifier",
  patient: "patient_identifier",
  context: "source_context",
  rawText: "source_context",
  findings: "clinical_findings",
  source: "source_file",
  confirmedAt: "confirmed_at",
  confirmedAtISO: "confirmed_at_iso",
  ownerEmail: "owner_email",
  status: "status",
};

const reverseMap = (map) =>
  Object.entries(map).reduce(
    (result, [frontendKey, backendKey]) => ({
      ...result,
      [backendKey]: frontendKey,
    }),
    {}
  );

export class NormalizationService {
  static normalizeKeys(payload = {}, fieldMap = {}) {
    return Object.entries(payload).reduce((result, [key, value]) => {
      const normalizedKey = fieldMap[key] || key;

      return {
        ...result,
        [normalizedKey]: value,
      };
    }, {});
  }

  static userToBackend(payload) {
    return this.normalizeKeys(payload, userFieldMap);
  }

  static userToFrontend(payload) {
    return this.normalizeKeys(payload, reverseMap(userFieldMap));
  }

  static recordToBackend(payload) {
    return this.normalizeKeys(payload, recordFieldMap);
  }

  static recordToFrontend(payload) {
    return this.normalizeKeys(payload, reverseMap(recordFieldMap));
  }
}

export default NormalizationService;
