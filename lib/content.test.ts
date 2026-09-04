import { describe, expect, it } from "vitest";
import { CONTACT, HERO_METRICS, NEARSHORING_FACTS } from "@/lib/content";

describe("HERO_METRICS", () => {
  it("has the three technical metrics from the brief, in order", () => {
    expect(HERO_METRICS.map((m) => m.value)).toEqual(["±0.001″", "<24 h", "63 HRC"]);
  });
});

describe("NEARSHORING_FACTS", () => {
  it("includes the Saltillo-Laredo logistics facts from the brief", () => {
    const values = NEARSHORING_FACTS.map((f) => f.value);
    expect(values).toEqual(["300 km", "3 hrs", "T-MEC", "Sin fletes marítimos", "Puerta a puerta"]);
  });
});

describe("CONTACT", () => {
  it("has a matching phone and phoneHref", () => {
    expect(CONTACT.phoneHref).toBe(`tel:${CONTACT.phone.replace(/\s/g, "")}`);
    expect(CONTACT.email).toMatch(/^[^@]+@[^@]+\.[^@]+$/);
  });
});
