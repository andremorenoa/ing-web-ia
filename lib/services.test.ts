import { describe, expect, it } from "vitest";
import {
  SERVICE_CATEGORIES,
  getFeaturedServices,
  getServices,
  getServicesByCategory,
  parseServicesCsv,
} from "@/lib/services";

const FIXTURE_CSV = `"id","name","category","description","materials","specs","lead_time","featured"
"a-1","Fresado de prueba","Maquinados CNC","Una descripción, con coma adentro.","Aluminio 6061, Acero 4140","Tolerancia ±0.001″; Mesa 2000 mm","24-48 hrs","TRUE"
"b-1","Anodizado de prueba","Acabados y Tratamientos","Otra descripción.","Aluminio 6061","Espesor 10 micras","3-5 días","FALSE"
`;

describe("parseServicesCsv", () => {
  it("parses quoted fields with embedded commas correctly", () => {
    const services = parseServicesCsv(FIXTURE_CSV);
    expect(services).toHaveLength(2);
    expect(services[0]).toEqual({
      id: "a-1",
      name: "Fresado de prueba",
      category: "Maquinados CNC",
      description: "Una descripción, con coma adentro.",
      materials: ["Aluminio 6061", "Acero 4140"],
      specs: ["Tolerancia ±0.001″", "Mesa 2000 mm"],
      leadTime: "24-48 hrs",
      featured: true,
    });
  });

  it("parses featured=FALSE as false", () => {
    const services = parseServicesCsv(FIXTURE_CSV);
    expect(services[1].featured).toBe(false);
  });
});

describe("getServicesByCategory", () => {
  it("groups services in the fixed SERVICE_CATEGORIES order and drops empty categories", () => {
    const services = parseServicesCsv(FIXTURE_CSV);
    const groups = getServicesByCategory(services);
    expect(groups.map((g) => g.category)).toEqual(["Maquinados CNC", "Acabados y Tratamientos"]);
    expect(groups[0].services).toHaveLength(1);
  });
});

describe("getFeaturedServices", () => {
  it("returns only featured=true services", () => {
    const services = parseServicesCsv(FIXTURE_CSV);
    expect(getFeaturedServices(services).map((s) => s.id)).toEqual(["a-1"]);
  });
});

describe("getServices (real docs/services.csv)", () => {
  it("reads and parses all 15 real services", () => {
    const services = getServices();
    expect(services).toHaveLength(15);
    for (const service of services) {
      expect(SERVICE_CATEGORIES).toContain(service.category);
      expect(service.id).toMatch(/^[a-z]+-\d{3}$/);
    }
  });

  it("includes the exact featured set from docs/services.csv", () => {
    const featured = getFeaturedServices(getServices()).map((s) => s.id).sort();
    expect(featured).toEqual(["cnc-001", "cnc-003", "est-003", "her-001", "her-002"]);
  });
});
