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
  it("renders one article per featured service with its top two specs, plus a closing CTA card", () => {
    render(<ServicesPreview services={FIXTURE_SERVICES} />);
    expect(screen.getByRole("heading", { name: "Fresado CNC Vertical — Mesa Grande" })).toBeInTheDocument();
    expect(screen.getByText("Mesa hasta 2000 × 800 mm")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Shims / Lainas a Medida" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Proyectos Especiales / Desarrollo a Medida" })).toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(FIXTURE_SERVICES.length + 1);
  });

  it("links each card to its anchor on the capacidades page", () => {
    render(<ServicesPreview services={FIXTURE_SERVICES} />);
    const links = screen.getAllByRole("link", { name: "Ver ficha" });
    expect(links[0]).toHaveAttribute("href", "/capacidades#cnc-001");
  });

  it("links each card's quote CTA to the form with its process preselected", () => {
    render(<ServicesPreview services={FIXTURE_SERVICES} />);
    const links = screen.getAllByRole("link", { name: "Cotizar este proceso" });
    expect(links[0]).toHaveAttribute("href", "/?proceso=Fresado%20CNC#cotizacion");
    expect(links[1]).toHaveAttribute("href", "/?proceso=Shims%20%2F%20Lainas#cotizacion");
  });

  it("includes a special-projects CTA card that links straight to the quote form", () => {
    render(<ServicesPreview services={FIXTURE_SERVICES} />);
    const ctaLink = screen.getByRole("link", { name: "Cotizar proyecto especial" });
    expect(ctaLink).toHaveAttribute("href", "/#cotizacion");
  });
});
