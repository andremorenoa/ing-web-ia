import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteFooter } from "@/components/layout/SiteFooter";

describe("SiteFooter", () => {
  it("renders the contact email and phone from CONTACT", () => {
    render(<SiteFooter />);
    expect(screen.getByRole("link", { name: "cotizaciones@vektorcnc.mx" })).toHaveAttribute(
      "href",
      "mailto:cotizaciones@vektorcnc.mx",
    );
    expect(screen.getByRole("link", { name: "+52 844 000 0000" })).toHaveAttribute(
      "href",
      "tel:+528440000000",
    );
  });
});
