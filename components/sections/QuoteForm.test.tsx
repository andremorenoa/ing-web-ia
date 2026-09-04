import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { QuoteForm } from "@/components/sections/QuoteForm";

describe("QuoteForm", () => {
  it("has the four required fields and a submit button", () => {
    render(<QuoteForm />);
    expect(screen.getByLabelText("Material")).toBeInTheDocument();
    expect(screen.getByLabelText("Tolerancia requerida")).toBeInTheDocument();
    expect(screen.getByLabelText("Cantidad")).toBeInTheDocument();
    expect(screen.getByLabelText("Fecha de entrega deseada")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Enviar solicitud" })).toBeInTheDocument();
  });

  it("offers the four material options from the design system", () => {
    render(<QuoteForm />);
    const select = screen.getByLabelText("Material") as HTMLSelectElement;
    const optionLabels = Array.from(select.options).map((o) => o.textContent);
    expect(optionLabels).toEqual(["D2", "H13", "Vanadis", "Otro"]);
  });
});
