import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CategorySection } from "@/components/services/CategorySection";
import type { CategoryGroup } from "@/lib/services";

const FIXTURE_GROUP: CategoryGroup = {
  category: "Herramental y Troqueles",
  services: [
    {
      id: "her-001",
      name: "Shims / Lainas a Medida",
      category: "Herramental y Troqueles",
      description: "Shims de precisión.",
      materials: ["D2", "H13", "Vanadis"],
      specs: ["Espesor desde 0.05 mm", "Dureza hasta 63 HRC"],
      leadTime: "<24 hrs",
      featured: true,
    },
  ],
};

describe("CategorySection", () => {
  it("renders the category heading and one row per service", () => {
    render(<CategorySection group={FIXTURE_GROUP} />);
    expect(screen.getByRole("heading", { name: "Herramental y Troqueles" })).toBeInTheDocument();
    expect(screen.getByText("Shims / Lainas a Medida")).toBeInTheDocument();
    expect(screen.getByText("D2 · H13 · Vanadis")).toBeInTheDocument();
    expect(screen.getByText("<24 hrs")).toBeInTheDocument();
  });

  it("gives each service row an id matching its service id, for deep-linking", () => {
    render(<CategorySection group={FIXTURE_GROUP} />);
    expect(document.getElementById("her-001")).toBeInTheDocument();
  });
});
