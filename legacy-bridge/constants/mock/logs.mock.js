export const initialAuditLogs = [
  {
    id: "LOG-001",
    time: "14 July 2026, 09:12 AM",
    operator: "System AI",
    type: "AI_Extraction",
    description: "Extracted PR 92 bpm from handwritten clinic note.",
  },
  {
    id: "LOG-002",
    time: "14 July 2026, 09:18 AM",
    operator: "Dr. Sarah Tan",
    type: "Manual_Edit",
    description: "Changed shorthand PR to Heart rate before FHIR validation.",
  },
  {
    id: "LOG-003",
    time: "14 July 2026, 09:26 AM",
    operator: "MOH Data Clerk",
    type: "Final_Approval",
    description: "Approved Observation payload for cloud database write.",
  },
];
