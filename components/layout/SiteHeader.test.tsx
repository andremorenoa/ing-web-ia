import { fireEvent, render, screen, within } from "@testing-library/react";
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

  it("keeps the mobile nav panel closed by default, with a collapsed toggle button", () => {
    render(<SiteHeader />);
    expect(screen.queryByRole("navigation", { name: "Menú móvil" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Abrir menú" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("opens the mobile nav panel when the toggle is clicked", () => {
    render(<SiteHeader />);
    fireEvent.click(screen.getByRole("button", { name: "Abrir menú" }));

    const panel = screen.getByRole("navigation", { name: "Menú móvil" });
    expect(panel).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cerrar menú" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("closes the mobile nav panel after clicking a link inside it", () => {
    render(<SiteHeader />);
    fireEvent.click(screen.getByRole("button", { name: "Abrir menú" }));

    const panel = screen.getByRole("navigation", { name: "Menú móvil" });
    fireEvent.click(within(panel).getByRole("link", { name: "Capacidades" }));

    expect(screen.queryByRole("navigation", { name: "Menú móvil" })).not.toBeInTheDocument();
  });
});
