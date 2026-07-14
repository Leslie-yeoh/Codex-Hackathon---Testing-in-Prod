export const initialDashboardRecords = [
  {
    id: "RX-240714-001",
    patient: "Patient/MYKAD-******-5567",
    source: "Clinic note",
    resource: "Observation",
    status: "Needs Review",
    reviewer: "Dr. Sarah Tan",
    updated: "09:12 AM",
  },
  {
    id: "RX-240714-002",
    patient: "Patient/MYKAD-******-4410",
    source: "Legacy screenshot",
    resource: "Patient",
    status: "Validated",
    reviewer: "System AI",
    updated: "09:26 AM",
  },
  {
    id: "RX-240714-003",
    patient: "Patient/MYKAD-******-2198",
    source: "Handwritten chart",
    resource: "Observation",
    status: "Flagged",
    reviewer: "MOH Data Clerk",
    updated: "10:03 AM",
  },
];

export const demoDashboardRecord = {
  patient: "Patient/MYKAD-******-9081",
  source: "Scanned discharge note",
  resource: "Observation",
  status: "Needs Review",
  reviewer: "System AI",
  updated: "Now",
};
