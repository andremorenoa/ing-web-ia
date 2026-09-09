import { describe, expect, it, vi } from "vitest";
import { validateQuotePayload } from "@/app/api/quote/validate";

const VALID_PAYLOAD = {
  process: "Fresado CNC",
  tolerance: "±0.001″",
  quantity: "50 piezas",
  dueDate: "",
  materials: ["D2", "H13"],
};

describe("validateQuotePayload", () => {
  it("accepts a well-formed payload and returns it trimmed", () => {
    const result = validateQuotePayload({ ...VALID_PAYLOAD, tolerance: "  ±0.001″  " });
    expect(result).toEqual(VALID_PAYLOAD);
  });

  it("rejects a non-object payload", () => {
    expect(validateQuotePayload(null)).toBeNull();
    expect(validateQuotePayload("not an object")).toBeNull();
    expect(validateQuotePayload(42)).toBeNull();
  });

  it("rejects a process value outside PROCESS_OPTIONS", () => {
    expect(validateQuotePayload({ ...VALID_PAYLOAD, process: "Inyección de plástico" })).toBeNull();
  });

  it("rejects an empty or overly long tolerance", () => {
    expect(validateQuotePayload({ ...VALID_PAYLOAD, tolerance: "" })).toBeNull();
    expect(validateQuotePayload({ ...VALID_PAYLOAD, tolerance: "x".repeat(500) })).toBeNull();
  });

  it("rejects an empty quantity", () => {
    expect(validateQuotePayload({ ...VALID_PAYLOAD, quantity: "" })).toBeNull();
  });

  it("rejects a material outside MATERIAL_OPTIONS", () => {
    expect(
      validateQuotePayload({ ...VALID_PAYLOAD, materials: ["D2", "Kryptonita"] }),
    ).toBeNull();
  });

  it("rejects a materials value that isn't an array", () => {
    expect(validateQuotePayload({ ...VALID_PAYLOAD, materials: "D2" })).toBeNull();
  });

  it("accepts an empty materials array", () => {
    expect(validateQuotePayload({ ...VALID_PAYLOAD, materials: [] })).toEqual({
      ...VALID_PAYLOAD,
      materials: [],
    });
  });

  it("rejects a due date that is today or in the past", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2027, 2, 15, 10, 0, 0));

    expect(validateQuotePayload({ ...VALID_PAYLOAD, dueDate: "2027-03-15" })).toBeNull();
    expect(validateQuotePayload({ ...VALID_PAYLOAD, dueDate: "2027-03-14" })).toBeNull();
    expect(validateQuotePayload({ ...VALID_PAYLOAD, dueDate: "2027-03-16" })).not.toBeNull();

    vi.useRealTimers();
  });

  it("rejects a due date that isn't in YYYY-MM-DD format", () => {
    expect(validateQuotePayload({ ...VALID_PAYLOAD, dueDate: "16/03/2027" })).toBeNull();
    expect(validateQuotePayload({ ...VALID_PAYLOAD, dueDate: "not-a-date" })).toBeNull();
  });

  it("drops unexpected extra fields instead of forwarding them upstream", () => {
    const result = validateQuotePayload({ ...VALID_PAYLOAD, extra: "should not survive" });
    expect(result).toEqual(VALID_PAYLOAD);
  });
});
