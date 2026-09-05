export const PROCESS_OPTIONS = [
  "Fresado CNC",
  "Torneado",
  "Shims / Lainas",
  "Rectificado",
  "Ensamble",
] as const;

export type ProcessOption = (typeof PROCESS_OPTIONS)[number];

export function isProcessOption(value: string): value is ProcessOption {
  return (PROCESS_OPTIONS as readonly string[]).includes(value);
}

// Maps docs/services.csv service ids to the closest match in PROCESS_OPTIONS,
// so a "Cotizar este proceso" click can preselect the matching field in QuoteForm.
export const SERVICE_ID_TO_PROCESS: Record<string, ProcessOption> = {
  "cnc-001": "Fresado CNC",
  "cnc-002": "Fresado CNC",
  "cnc-003": "Torneado",
  "cnc-004": "Torneado",
  "cnc-005": "Fresado CNC",
  "her-001": "Shims / Lainas",
  "her-002": "Rectificado",
  "her-003": "Rectificado",
  "her-004": "Fresado CNC",
  "est-001": "Ensamble",
  "est-002": "Ensamble",
  "est-003": "Ensamble",
  "aca-001": "Rectificado",
  "aca-002": "Rectificado",
  "aca-003": "Rectificado",
};
