import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { CONTACT } from "@/lib/content";

describe("SiteFooter", () => {
  it("renders the contact email and phone from CONTACT", () => {
    render(<SiteFooter />);
    expect(screen.getByRole("link", { name: CONTACT.email })).toHaveAttribute(
      "href",
      `mailto:${CONTACT.email}`,
    );
    expect(screen.getByRole("link", { name: CONTACT.phone })).toHaveAttribute(
      "href",
      CONTACT.phoneHref,
    );
  });
});
