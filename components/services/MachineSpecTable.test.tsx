import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MachineSpecTable } from "@/components/services/MachineSpecTable";

describe("MachineSpecTable", () => {
  it("renders the machine park with axis travel and spindle speed", () => {
    render(<MachineSpecTable />);
    expect(screen.getByRole("heading", { name: "Parque de máquinas y metrología" })).toBeInTheDocument();
    expect(screen.getByText("Mazak VTC-800")).toBeInTheDocument();
    expect(screen.getByText("Okuma LB3000")).toBeInTheDocument();
    expect(screen.getByText("X 2000 · Y 800 · Z 600 mm")).toBeInTheDocument();
    expect(screen.getByText("12,000 RPM")).toBeInTheDocument();
  });

  it("lists the metrology equipment", () => {
    render(<MachineSpecTable />);
    expect(screen.getByText("Calibradores digitales Mitutoyo")).toBeInTheDocument();
    expect(screen.getByText("Mesa de granito para inspección dimensional")).toBeInTheDocument();
  });
});
