import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { QualityMetrology } from "@/components/sections/QualityMetrology";

describe("QualityMetrology", () => {
  it("covers metrology, traceability, and the Tier 1/2 delivery commitment", () => {
    render(<QualityMetrology />);
    expect(screen.getByText("Metrología en piso")).toBeInTheDocument();
    expect(screen.getByText("Trazabilidad por lote")).toBeInTheDocument();
    expect(screen.getByText("Compromiso Tier 1 / Tier 2")).toBeInTheDocument();
  });
});
