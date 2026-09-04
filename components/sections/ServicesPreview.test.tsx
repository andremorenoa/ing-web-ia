import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ServicesPreview } from "@/components/sections/ServicesPreview";
import type { Service } from "@/lib/services";

const FIXTURE_SERVICES: Service[] = [
  {
    id: "cnc-001",
    name: "Fresado CNC Vertical — Mesa Grande",
    category: "Maquinados CNC",
    description: "Fresado de piezas de gran formato.",
    materials: ["Aluminio 6061", "Acero 4140"],
    specs: ["Mesa hasta 2000 × 800 mm", "Tolerancia ±0.001″"],
    leadTime: "3-5 días",
    featured: true,
  },
  {
    id: "her-001",
    name: "Shims / Lainas a Medida",
    category: "Herramental y Troqueles",
    description: "Shims de precisión.",
    materials: ["D2", "H13"],
    specs: ["Espesor desde 0.05 mm", "Dureza hasta 63 HRC"],
    leadTime: "<24 hrs",
    featured: true,
  },
];

describe("ServicesPreview", () => {
  it("renders one article per featured service with its top two specs", () => {
    render(<ServicesPreview services={FIXTURE_SERVICES} />);
    expect(screen.getByRole("heading", { name: "Fresado CNC Vertical — Mesa Grande" })).toBeInTheDocument();
    expect(screen.getByText("Mesa hasta 2000 × 800 mm")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Shims / Lainas a Medida" })).toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(2);
  });

  it("links each card to its anchor on the capacidades page", () => {
    render(<ServicesPreview services={FIXTURE_SERVICES} />);
    const links = screen.getAllByRole("link", { name: "Ver ficha" });
    expect(links[0]).toHaveAttribute("href", "/capacidades#cnc-001");
  });
});
