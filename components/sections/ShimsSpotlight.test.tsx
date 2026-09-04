import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ShimsSpotlight } from "@/components/sections/ShimsSpotlight";
import type { Service } from "@/lib/services";

const FIXTURE_SERVICE: Service = {
  id: "her-001",
  name: "Shims / Lainas a Medida",
  category: "Herramental y Troqueles",
  description: "Shims de precisión.",
  materials: ["D2", "H13", "Vanadis", "Acero inoxidable 304"],
  specs: ["Espesor desde 0.05 mm", "Tolerancia ±0.001″", "Dureza hasta 63 HRC"],
  leadTime: "<24 hrs",
  featured: true,
};

describe("ShimsSpotlight", () => {
  it("renders the service name, specs, materials, and a quote CTA", () => {
    render(<ShimsSpotlight service={FIXTURE_SERVICE} />);
    expect(screen.getByRole("heading", { name: "Shims / Lainas a Medida" })).toBeInTheDocument();
    expect(screen.getAllByText("Dureza hasta 63 HRC").length).toBeGreaterThan(0);
    expect(screen.getByText("D2 · H13 · Vanadis · Acero inoxidable 304")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Cotizar shims y lainas" })).toHaveAttribute(
      "href",
      "/#cotizacion",
    );
  });
});
