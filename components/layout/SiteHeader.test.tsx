import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteHeader } from "@/components/layout/SiteHeader";

describe("SiteHeader", () => {
  it("links to the three main routes and the quote CTA", () => {
    render(<SiteHeader />);
    expect(screen.getByRole("link", { name: /capacidades/i })).toHaveAttribute(
      "href",
      "/capacidades",
    );
    expect(screen.getByRole("link", { name: /nosotros/i })).toHaveAttribute("href", "/nosotros");
    expect(screen.getByRole("link", { name: "Solicitar cotización" })).toHaveAttribute(
      "href",
      "/#cotizacion",
    );
  });
});
