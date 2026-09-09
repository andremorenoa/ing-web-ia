import { isMaterialOption, isProcessOption, MATERIAL_OPTIONS } from "@/lib/quote";

export interface QuotePayload {
  process: string;
  tolerance: string;
  quantity: string;
  dueDate: string;
  materials: string[];
}

const MAX_TEXT_FIELD_LENGTH = 200;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function isNonEmptyBoundedString(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.length <= MAX_TEXT_FIELD_LENGTH
  );
}

function isValidDueDate(value: string): boolean {
  if (value === "") return true;
  if (!ISO_DATE_PATTERN.test(value)) return false;

  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return false;

  const tomorrow = new Date();
  tomorrow.setHours(0, 0, 0, 0);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return parsed >= tomorrow;
}

/**
 * Validates and normalizes an untrusted request body into a QuotePayload,
 * or returns null if anything is missing, malformed, or out of range.
 * Only the fields listed below are ever read — anything else on the input
 * object is silently dropped rather than forwarded upstream.
 */
export function validateQuotePayload(data: unknown): QuotePayload | null {
  if (typeof data !== "object" || data === null) return null;
  const record = data as Record<string, unknown>;

  const process = record.process;
  if (typeof process !== "string" || !isProcessOption(process)) return null;

  if (!isNonEmptyBoundedString(record.tolerance)) return null;
  if (!isNonEmptyBoundedString(record.quantity)) return null;

  const dueDate = record.dueDate ?? "";
  if (typeof dueDate !== "string" || !isValidDueDate(dueDate)) return null;

  const materials = record.materials;
  if (!Array.isArray(materials) || materials.length > MATERIAL_OPTIONS.length) return null;
  if (!materials.every((material): material is string => typeof material === "string" && isMaterialOption(material))) {
    return null;
  }

  return {
    process,
    tolerance: (record.tolerance as string).trim(),
    quantity: (record.quantity as string).trim(),
    dueDate,
    materials,
  };
}
