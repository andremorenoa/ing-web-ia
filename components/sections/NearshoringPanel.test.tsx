import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NearshoringPanel } from "@/components/sections/NearshoringPanel";

describe("NearshoringPanel", () => {
  it("shows the Saltillo-Laredo logistics facts", () => {
    render(<NearshoringPanel />);
    expect(screen.getByText("300 km")).toBeInTheDocument();
    expect(screen.getByText("3 hrs")).toBeInTheDocument();
    expect(screen.getByText("T-MEC")).toBeInTheDocument();
    expect(screen.getByText("Sin fletes marítimos")).toBeInTheDocument();
    expect(screen.getByText("Puerta a puerta")).toBeInTheDocument();
  });
});
